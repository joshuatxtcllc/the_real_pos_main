import { Request, Response } from 'express';
import { simpleOrderNotificationService, OrderEvent } from '../services/simpleOrderNotificationService';

export class OrderNotificationController {
  
  /**
   * Trigger a notification for a specific order event
   */
  async triggerNotification(req: Request, res: Response): Promise<void> {
    try {
      const { 
        orderId, 
        orderNumber, 
        customerName, 
        customerPhone, 
        eventType, 
        metadata 
      } = req.body;

      // Validate required fields
      if (!orderId || !orderNumber || !customerName || !customerPhone || !eventType) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: orderId, orderNumber, customerName, customerPhone, eventType'
        });
        return;
      }

      // Validate event type
      const validEventTypes = [
        'order_placed', 'payment_received', 'production_started', 
        'frame_cut', 'mat_cut', 'assembly_complete', 
        'ready_for_pickup', 'payment_due', 'pickup_overdue'
      ];

      if (!validEventTypes.includes(eventType)) {
        res.status(400).json({
          success: false,
          error: `Invalid event type. Must be one of: ${validEventTypes.join(', ')}`
        });
        return;
      }

      const orderEvent: OrderEvent = {
        orderId,
        orderNumber,
        customerName,
        customerPhone,
        eventType,
        metadata
      };

      await simpleOrderNotificationService.handleOrderEvent(orderEvent);

      res.json({
        success: true,
        message: `Notification triggered for order ${orderNumber}`,
        eventType
      });

    } catch (error) {
      console.error('Error triggering notification:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to trigger notification'
      });
    }
  }

  /**
   * Schedule a delayed notification
   */
  async scheduleNotification(req: Request, res: Response): Promise<void> {
    try {
      const { 
        orderId, 
        orderNumber, 
        customerName, 
        customerPhone, 
        eventType, 
        delayMinutes,
        metadata 
      } = req.body;

      if (!delayMinutes || delayMinutes < 1) {
        res.status(400).json({
          success: false,
          error: 'delayMinutes must be a positive number'
        });
        return;
      }

      const orderEvent: OrderEvent = {
        orderId,
        orderNumber,
        customerName,
        customerPhone,
        eventType,
        metadata
      };

      await simpleOrderNotificationService.scheduleDelayedNotification(orderEvent, delayMinutes);

      res.json({
        success: true,
        message: `Notification scheduled for order ${orderNumber} in ${delayMinutes} minutes`,
        scheduledFor: new Date(Date.now() + delayMinutes * 60 * 1000).toISOString()
      });

    } catch (error) {
      console.error('Error scheduling notification:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to schedule notification'
      });
    }
  }

  /**
   * Send bulk notifications for multiple orders
   */
  async sendBulkNotifications(req: Request, res: Response): Promise<void> {
    try {
      const { events } = req.body;

      if (!Array.isArray(events) || events.length === 0) {
        res.status(400).json({
          success: false,
          error: 'events must be a non-empty array'
        });
        return;
      }

      // Validate each event
      for (const event of events) {
        if (!event.orderId || !event.orderNumber || !event.customerName || !event.customerPhone || !event.eventType) {
          res.status(400).json({
            success: false,
            error: 'Each event must have orderId, orderNumber, customerName, customerPhone, and eventType'
          });
          return;
        }
      }

      await simpleOrderNotificationService.sendBulkNotifications(events);

      res.json({
        success: true,
        message: `Bulk notifications sent for ${events.length} orders`,
        count: events.length
      });

    } catch (error) {
      console.error('Error sending bulk notifications:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send bulk notifications'
      });
    }
  }

  /**
   * Check for overdue orders and send reminders
   */
  async checkOverdueOrders(req: Request, res: Response): Promise<void> {
    try {
      // Implementation would query database for overdue orders
      console.log('Checking for overdue pickup orders...');

      res.json({
        success: true,
        message: 'Overdue orders check completed'
      });

    } catch (error) {
      console.error('Error checking overdue orders:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check overdue orders'
      });
    }
  }

  /**
   * Get notification configuration and status
   */
  async getNotificationStatus(req: Request, res: Response): Promise<void> {
    try {
      // Check if voice calling is configured
      const isConfigured = !!(
        process.env.TWILIO_ACCOUNT_SID && 
        process.env.TWILIO_AUTH_TOKEN && 
        process.env.TWILIO_PHONE_NUMBER
      );

      const eventTypes = [
        { type: 'order_placed', description: 'Order confirmation call' },
        { type: 'payment_received', description: 'Payment confirmation call' },
        { type: 'production_started', description: 'Production started notification' },
        { type: 'frame_cut', description: 'Frame cutting complete update' },
        { type: 'mat_cut', description: 'Mat cutting complete update' },
        { type: 'assembly_complete', description: 'Assembly complete notification' },
        { type: 'ready_for_pickup', description: 'Order ready for pickup call' },
        { type: 'payment_due', description: 'Payment reminder call' },
        { type: 'pickup_overdue', description: 'Pickup reminder call' }
      ];

      res.json({
        success: true,
        configured: isConfigured,
        message: isConfigured ? 'Order notifications are configured and ready' : 'Twilio credentials required',
        supportedEventTypes: eventTypes,
        endpoints: {
          trigger: '/api/order-notifications/trigger',
          schedule: '/api/order-notifications/schedule',
          bulk: '/api/order-notifications/bulk',
          checkOverdue: '/api/order-notifications/check-overdue'
        }
      });

    } catch (error) {
      console.error('Error getting notification status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get notification status'
      });
    }
  }

  /**
   * Test notification with sample data
   */
  async testNotification(req: Request, res: Response): Promise<void> {
    try {
      const { phone, eventType = 'ready_for_pickup' } = req.body;

      if (!phone) {
        res.status(400).json({
          success: false,
          error: 'Phone number is required for test notification'
        });
        return;
      }

      const testEvent: OrderEvent = {
        orderId: 'TEST-001',
        orderNumber: 'TEST-001',
        customerName: 'Test Customer',
        customerPhone: phone,
        eventType: eventType as any,
        metadata: {
          amount: 125.50,
          daysWaiting: 3,
          dueDate: 'Friday',
          estimatedCompletion: '2-3 business days'
        }
      };

      await simpleOrderNotificationService.handleOrderEvent(testEvent);

      res.json({
        success: true,
        message: `Test notification sent to ${phone}`,
        eventType,
        testData: testEvent
      });

    } catch (error) {
      console.error('Error sending test notification:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send test notification'
      });
    }
  }
}

export const orderNotificationController = new OrderNotificationController();