import { Request, Response } from 'express';
import { storage } from '../storage';
import { SimpleOrderNotificationService } from '../services/simpleOrderNotificationService';

import { db } from '../db';
import { orders, paymentLinks } from '@shared/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { markPaymentLinkAsUsed } from '../services/paymentLinkService';

const orderNotificationService = new SimpleOrderNotificationService();

/**
 * Webhook endpoint for receiving status updates from external Kanban app
 * This enables bidirectional notification support
 */
export async function handleKanbanWebhook(req: Request, res: Response) {
  try {
    const { orderId, status, updatedBy, timestamp, previousStatus } = req.body;

    console.log(`Received Kanban webhook for order ${orderId}: ${previousStatus} → ${status}`);

    // Validate required fields
    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: orderId and status'
      });
    }

    // Skip if update came from our POS system to avoid loops
    if (updatedBy === 'Jays Frames POS') {
      console.log('Skipping webhook - update originated from POS system');
      return res.json({ success: true, message: 'Update originated from POS, no notification needed' });
    }

    // Update local order status
    const order = await storage.updateOrder(parseInt(orderId), {
      productionStatus: status,
      lastStatusChange: new Date()
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Send automated notification for Kanban status change
    let notificationSent = false;
    try {
      if (order.customerId) {
        const customer = await storage.getCustomer(order.customerId);
        if (customer && customer.phone) {
          // Map status to notification event type
          let eventType: 'production_started' | 'frame_cut' | 'mat_cut' | 'assembly_complete' | 'ready_for_pickup' | null = null;

          switch (status) {
            case 'in_production':
            case 'production_started':
              eventType = 'production_started';
              break;
            case 'frame_cut':
            case 'frame_cutting_complete':
              eventType = 'frame_cut';
              break;
            case 'mat_cut':
            case 'mat_cutting_complete':
              eventType = 'mat_cut';
              break;
            case 'assembly_complete':
            case 'assembled':
              eventType = 'assembly_complete';
              break;
            case 'ready_for_pickup':
            case 'completed':
            case 'ready':
              eventType = 'ready_for_pickup';
              break;
          }

          if (eventType) {
            await orderNotificationService.handleOrderEvent({
              orderId: order.id.toString(),
              orderNumber: `ORD-${order.id}`,
              customerName: customer.name,
              customerPhone: customer.phone,
              eventType: eventType
            });
            console.log(`Kanban webhook notification sent for order ${order.id}: ${status}`);
            notificationSent = true;
          }
        }
      }
    } catch (notificationError) {
      console.error('Failed to send Kanban webhook notification:', notificationError);
      // Don't fail the webhook if notification fails
    }

    res.json({
      success: true,
      message: 'Status update processed successfully',
      orderId: order.id,
      newStatus: status,
      notificationSent: notificationSent
    });

  } catch (error: any) {
    console.error('Error processing Kanban webhook:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process webhook'
    });
  }
}

/**
 * General webhook endpoint for any external system updates
 */
export async function handleOrderUpdateWebhook(req: Request, res: Response) {
  try {
    const { orderId, eventType, customerPhone, customerName, metadata } = req.body;

    console.log(`Received order update webhook: ${eventType} for order ${orderId}`);

    // Validate required fields
    if (!orderId || !eventType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: orderId and eventType'
      });
    }

    // If customer info not provided, look up from database
    let phone = customerPhone;
    let name = customerName;

    if (!phone || !name) {
      const order = await storage.getOrder(parseInt(orderId));
      if (order && order.customerId) {
        const customer = await storage.getCustomer(order.customerId);
        if (customer) {
          phone = phone || customer.phone;
          name = name || customer.name;
        }
      }
    }

    if (!phone || !name) {
      return res.status(400).json({
        success: false,
        error: 'Customer information not found'
      });
    }

    // Send notification
    await orderNotificationService.handleOrderEvent({
      orderId: orderId.toString(),
      orderNumber: `ORD-${orderId}`,
      customerName: name,
      customerPhone: phone,
      eventType: eventType,
      metadata: metadata || {}
    });

    console.log(`Webhook notification sent for order ${orderId}: ${eventType}`);

    res.json({
      success: true,
      message: 'Notification sent successfully',
      orderId: orderId,
      eventType: eventType
    });

  } catch (error: any) {
    console.error('Error processing order update webhook:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process webhook'
    });
  }
}

/**
 * Handle Stripe webhook events for payment processing
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      console.warn('Stripe webhook secret not configured');
      return res.status(400).json({
        success: false,
        error: 'Webhook secret not configured'
      });
    }

    if (!sig) {
      return res.status(400).json({
        success: false,
        error: 'Missing stripe signature'
      });
    }

    // Initialize Stripe if secret key is available
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.warn('Stripe secret key not configured');
      return res.status(400).json({
        success: false,
        error: 'Stripe not configured'
      });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20'
    });

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({
        success: false,
        error: 'Invalid signature'
      });
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Find and update the payment link
        try {
          const result = await db
            .select()
            .from(paymentLinks)
            .where(eq(paymentLinks.stripePaymentIntentId, paymentIntent.id))
            .limit(1);

          if (result.length > 0) {
            const paymentLink = result[0];
            
            // Mark payment link as used
            await markPaymentLinkAsUsed(paymentLink.token, paymentIntent.id);
            
            // Update order payment status if order exists
            if (paymentLink.orderId) {
              await storage.updateOrder(paymentLink.orderId, {
                paymentStatus: 'paid',
                lastStatusChange: new Date()
              });
              
              console.log(`Order ${paymentLink.orderId} marked as paid`);
            }
          }
        } catch (dbError) {
          console.error('Database error processing payment:', dbError);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Webhook processing failed'
    });
  }
}

/**
 * Webhook health check endpoint
 */
export async function webhookHealthCheck(req: Request, res: Response) {
  res.json({
    success: true,
    message: 'Webhook endpoints are operational',
    timestamp: new Date().toISOString(),
    endpoints: {
      kanban: '/api/webhooks/kanban',
      orderUpdate: '/api/webhooks/order-update',
      stripe: '/api/webhooks/stripe',
      health: '/api/webhooks/health'
    }
  });
}