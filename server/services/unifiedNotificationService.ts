import { EmailService } from './emailService.js';
import { SmsService } from './smsService.js';

export interface CustomerContact {
  id: number;
  email: string;
  phone?: string;
  discordUserId?: string;
  preferences: {
    email: boolean;
    sms: boolean;
    discord: boolean;
    inApp: boolean;
  };
}

export interface NotificationMessage {
  title: string;
  message: string;
  type: 'order_update' | 'completion' | 'estimate' | 'payment' | 'custom';
  urgency: 'low' | 'normal' | 'high';
  metadata?: Record<string, any>;
}

class UnifiedNotificationService {
  private emailService: EmailService;
  private smsService: SmsService;

  constructor() {
    this.emailService = new EmailService();
    this.smsService = new SmsService();
  }

  public async notifyCustomer(customer: CustomerContact, notification: NotificationMessage) {
    const results: any[] = [];

    try {
      // Email notification
      if (customer.preferences.email && customer.email) {
        try {
          const emailResult = await this.emailService.sendNotification(
            customer.email,
            notification.title,
            notification.message
          );
          results.push({ channel: 'email', success: true, result: emailResult });
        } catch (error) {
          results.push({ channel: 'email', success: false, error: error });
        }
      }

      // SMS notification
      if (customer.preferences.sms && customer.phone) {
        try {
          const smsResult = await this.smsService.sendNotification(
            customer.phone,
            `${notification.title}: ${notification.message}`
          );
          results.push({ channel: 'sms', success: true, result: smsResult });
        } catch (error) {
          results.push({ channel: 'sms', success: false, error: error });
        }
      }

      // In-app notification (just logging for now)
      if (customer.preferences.inApp) {
        console.log(`In-app notification for customer ${customer.id}: ${notification.title}`);
        results.push({ channel: 'inApp', success: true, result: 'logged' });
      }

      return {
        success: true,
        customer: customer.id,
        notification: notification.type,
        results: results,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error in unified notification service:', error);
      return {
        success: false,
        customer: customer.id,
        notification: notification.type,
        error: error instanceof Error ? error.message : 'Unknown error',
        results: results,
        timestamp: new Date().toISOString()
      };
    }
  }

  public async sendOrderStatusUpdate(customer: CustomerContact, orderId: number, status: string, details?: string) {
    const notification: NotificationMessage = {
      title: 'Order Status Update',
      message: `Your order #${orderId} status has been updated to: ${status}${details ? `\n\n${details}` : ''}`,
      type: 'order_update',
      urgency: 'normal',
      metadata: { orderId, status }
    };

    return await this.notifyCustomer(customer, notification);
  }

  public async sendCompletionNotice(customer: CustomerContact, orderId: number, pickupInfo?: string) {
    const notification: NotificationMessage = {
      title: 'Your Frame is Ready!',
      message: `Great news! Your order #${orderId} is complete and ready for pickup.${pickupInfo ? `\n\nPickup Details:\n${pickupInfo}` : ''}`,
      type: 'completion',
      urgency: 'high',
      metadata: { orderId }
    };

    return await this.notifyCustomer(customer, notification);
  }

  public async sendEstimateUpdate(customer: CustomerContact, orderId: number, estimatedDays: number) {
    const notification: NotificationMessage = {
      title: 'Timeline Update',
      message: `Your order #${orderId} estimated completion has been updated to ${estimatedDays} days.`,
      type: 'estimate',
      urgency: 'normal',
      metadata: { orderId, estimatedDays }
    };

    return await this.notifyCustomer(customer, notification);
  }
}

export default UnifiedNotificationService;