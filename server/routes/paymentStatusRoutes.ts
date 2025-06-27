
import { Router } from 'express';
import Stripe from 'stripe';
import { db } from '../db';
import { orderGroups } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Initialize Stripe - only if we have the secret key
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })
  : null;

// Check payment status
router.post('/payment-status', async (req, res) => {
  try {
    const { payment_intent_id, client_secret } = req.body;

    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: 'Payment processing is not configured'
      });
    }

    if (!payment_intent_id) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    // Find the order group associated with this payment
    const orderGroup = await db
      .select()
      .from(orderGroups)
      .where(eq(orderGroups.stripePaymentIntentId, payment_intent_id))
      .limit(1);

    let orderGroupId = null;
    if (orderGroup.length > 0) {
      orderGroupId = orderGroup[0].id;

      // Update order status based on payment status
      if (paymentIntent.status === 'succeeded') {
        await db
          .update(orderGroups)
          .set({
            status: 'confirmed',
            paymentStatus: 'paid',
            paymentMethod: 'card',
            paidAt: new Date(),
          })
          .where(eq(orderGroups.id, orderGroupId));
      }
    }

    res.json({
      success: true,
      status: paymentIntent.status,
      orderGroupId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });

  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment status'
    });
  }
});

export default router;
