import { makeVoiceCall, callOrderComplete, callPaymentReminder, callPickupReminder } from './voiceCallService';

export interface OrderEvent {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  eventType: 'order_placed' | 'payment_received' | 'production_started' | 'frame_cut' | 'mat_cut' | 'assembly_complete' | 'ready_for_pickup' | 'payment_due' | 'pickup_overdue';
  metadata?: {
    amount?: number;
    daysWaiting?: number;
    dueDate?: string;
    estimatedCompletion?: string;
  };
}

/**
 * Simplified automated notification service for order events
 */
export class SimpleOrderNotificationService {
  
  /**
   * Handle order events and trigger appropriate voice notifications
   */
  async handleOrderEvent(event: OrderEvent): Promise<void> {
    try {
      if (!event.customerPhone || event.customerPhone.length < 10) {
        console.log(`Skipping notification for order ${event.orderNumber}: No valid phone number`);
        return;
      }

      const phone = this.formatPhoneNumber(event.customerPhone);
      console.log(`Processing notification for order ${event.orderNumber}, event: ${event.eventType}`);

      switch (event.eventType) {
        case 'order_placed':
          await this.sendOrderConfirmation(event, phone);
          break;
        
        case 'payment_received':
          await this.sendPaymentConfirmation(event, phone);
          break;
        
        case 'production_started':
          await this.sendProductionStarted(event, phone);
          break;
        
        case 'frame_cut':
        case 'mat_cut':
          await this.sendProgressUpdate(event, phone);
          break;
        
        case 'assembly_complete':
          await this.sendAssemblyComplete(event, phone);
          break;
        
        case 'ready_for_pickup':
          await this.sendPickupReady(event, phone);
          break;
        
        case 'payment_due':
          await this.sendPaymentReminder(event, phone);
          break;
        
        case 'pickup_overdue':
          await this.sendPickupReminder(event, phone);
          break;
        
        default:
          console.log(`Unknown event type: ${event.eventType}`);
      }
    } catch (error) {
      console.error(`Error handling order event for ${event.orderNumber}:`, error);
    }
  }

  private async sendOrderConfirmation(event: OrderEvent, phone: string): Promise<void> {
    const message = `Hello ${event.customerName}! This is Jay's Frames calling to confirm your order ${event.orderNumber} has been received and is being processed. Thank you for choosing us for your custom framing needs!`;
    
    await makeVoiceCall({
      to: phone,
      message,
      voice: 'Polly.Amy'
    });
    console.log(`Order confirmation call sent for ${event.orderNumber}`);
  }

  private async sendPaymentConfirmation(event: OrderEvent, phone: string): Promise<void> {
    const message = `Hello ${event.customerName}! This is Jay's Frames calling to confirm we've received your payment for order ${event.orderNumber}. Your custom framing project will now begin production. Thank you for your business!`;
    
    await makeVoiceCall({
      to: phone,
      message,
      voice: 'Polly.Amy'
    });
    console.log(`Payment confirmation call sent for ${event.orderNumber}`);
  }

  private async sendProductionStarted(event: OrderEvent, phone: string): Promise<void> {
    const estimatedCompletion = event.metadata?.estimatedCompletion || '5-7 business days';
    const message = `Hello ${event.customerName}! This is Jay's Frames calling with an update on your order ${event.orderNumber}. We're excited to let you know that production has started on your custom framing project. Estimated completion time is ${estimatedCompletion}. Thank you for your patience!`;
    
    await makeVoiceCall({
      to: phone,
      message,
      voice: 'Polly.Amy'
    });
    console.log(`Production started call sent for ${event.orderNumber}`);
  }

  private async sendProgressUpdate(event: OrderEvent, phone: string): Promise<void> {
    const statusMap = {
      frame_cut: 'frame cutting is complete',
      mat_cut: 'mat cutting is complete'
    };
    
    const status = statusMap[event.eventType as keyof typeof statusMap] || event.eventType;
    const message = `Hello ${event.customerName}! This is Jay's Frames with an update on your order ${event.orderNumber}. We're happy to report that ${status} and your project is progressing well. Thank you for your patience!`;
    
    await makeVoiceCall({
      to: phone,
      message,
      voice: 'Polly.Amy'
    });
    console.log(`Progress update call sent for ${event.orderNumber}`);
  }

  private async sendAssemblyComplete(event: OrderEvent, phone: string): Promise<void> {
    const message = `Hello ${event.customerName}! This is Jay's Frames with exciting news. Your custom framing order ${event.orderNumber} has been assembled and is in final quality inspection. We'll call you soon when it's ready for pickup!`;
    
    await makeVoiceCall({
      to: phone,
      message,
      voice: 'Polly.Amy'
    });
    console.log(`Assembly complete call sent for ${event.orderNumber}`);
  }

  private async sendPickupReady(event: OrderEvent, phone: string): Promise<void> {
    await callOrderComplete(event.customerName, phone, event.orderNumber);
    console.log(`Pickup ready call sent for ${event.orderNumber}`);
  }

  private async sendPaymentReminder(event: OrderEvent, phone: string): Promise<void> {
    const amount = event.metadata?.amount || 0;
    const message = `Hello ${event.customerName}, this is Jay's Frames calling about your order ${event.orderNumber}. You have an outstanding balance of $${amount}. Please contact us at your earliest convenience to complete your payment. Thank you for your prompt attention to this matter.`;
    
    await makeVoiceCall({
      to: phone,
      message,
      voice: 'Polly.Brian'
    });
    console.log(`Payment reminder call sent for ${event.orderNumber}`);
  }

  private async sendPickupReminder(event: OrderEvent, phone: string): Promise<void> {
    const daysWaiting = event.metadata?.daysWaiting || 7;
    const message = `Hello ${event.customerName}, this is Jay's Frames calling about your completed order ${event.orderNumber}. Your custom framing has been ready for pickup for ${daysWaiting} days. Please come by during our business hours to collect your order. Thank you!`;
    
    await makeVoiceCall({
      to: phone,
      message,
      voice: 'Polly.Brian'
    });
    console.log(`Pickup reminder call sent for ${event.orderNumber}`);
  }

  private formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    return phone.startsWith('+') ? phone : `+${cleaned}`;
  }

  /**
   * Schedule a delayed notification
   */
  async scheduleDelayedNotification(event: OrderEvent, delayMinutes: number): Promise<void> {
    setTimeout(async () => {
      await this.handleOrderEvent(event);
    }, delayMinutes * 60 * 1000);
    
    console.log(`Scheduled notification for order ${event.orderNumber} in ${delayMinutes} minutes`);
  }

  /**
   * Send bulk notifications for multiple orders
   */
  async sendBulkNotifications(events: OrderEvent[]): Promise<void> {
    console.log(`Processing ${events.length} bulk notifications`);
    
    for (const event of events) {
      try {
        await this.handleOrderEvent(event);
        // Add small delay between calls to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to send notification for order ${event.orderNumber}:`, error);
      }
    }
  }
}

// Export a singleton instance
export const simpleOrderNotificationService = new SimpleOrderNotificationService();