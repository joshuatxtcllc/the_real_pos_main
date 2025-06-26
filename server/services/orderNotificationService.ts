import * as voiceCallService from './voiceCallService';

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

export class OrderNotificationService {
  constructor() {
    // Using the exported functions from voiceCallService
  }

  /**
   * Main method to handle order events and trigger appropriate notifications
   */
  async handleOrderEvent(event: OrderEvent): Promise<void> {
    try {
      // Validate phone number exists
      if (!event.customerPhone || event.customerPhone.length < 10) {
        console.log(`Skipping notification for order ${event.orderNumber}: No valid phone number`);
        return;
      }

      console.log(`Processing notification for order ${event.orderNumber}, event: ${event.eventType}`);

      switch (event.eventType) {
        case 'order_placed':
          await this.sendOrderConfirmation(event);
          break;
        
        case 'payment_received':
          await this.sendPaymentConfirmation(event);
          break;
        
        case 'production_started':
          await this.sendProductionStarted(event);
          break;
        
        case 'frame_cut':
        case 'mat_cut':
          await this.sendProgressUpdate(event);
          break;
        
        case 'assembly_complete':
          await this.sendAssemblyComplete(event);
          break;
        
        case 'ready_for_pickup':
          await this.sendPickupReady(event);
          break;
        
        case 'payment_due':
          await this.sendPaymentReminder(event);
          break;
        
        case 'pickup_overdue':
          await this.sendPickupReminder(event);
          break;
        
        default:
          console.log(`Unknown event type: ${event.eventType}`);
      }
    } catch (error) {
      console.error(`Error handling order event for ${event.orderNumber}:`, error);
    }
  }

  /**
   * Send order confirmation call
   */
  private async sendOrderConfirmation(event: OrderEvent): Promise<void> {
    const callData = {
      to: this.formatPhoneNumber(event.customerPhone),
      customerName: event.customerName,
      orderNumber: event.orderNumber
    };

    await this.voiceCallService.makeOrderStatusCall(callData);
    console.log(`Order confirmation call sent for ${event.orderNumber}`);
  }

  /**
   * Send payment confirmation call
   */
  private async sendPaymentConfirmation(event: OrderEvent): Promise<void> {
    const message = `Hello ${event.customerName}! This is Jay's Frames calling to confirm we've received your payment for order ${event.orderNumber}. Your custom framing project will now begin production. Thank you for your business!`;
    
    const callData = {
      to: this.formatPhoneNumber(event.customerPhone),
      message,
      voice: 'Polly.Amy'
    };

    await this.voiceCallService.makeCustomCall(callData);
    console.log(`Payment confirmation call sent for ${event.orderNumber}`);
  }

  /**
   * Send production started notification
   */
  private async sendProductionStarted(event: OrderEvent): Promise<void> {
    const estimatedCompletion = event.metadata?.estimatedCompletion || '5-7 business days';
    
    const callData = {
      to: this.formatPhoneNumber(event.customerPhone),
      orderNumber: event.orderNumber,
      status: 'production_started',
      estimatedCompletion
    };

    await this.voiceCallService.makeOrderStatusCall(callData);
    console.log(`Production started call sent for ${event.orderNumber}`);
  }

  /**
   * Send progress update (frame cut, mat cut, etc.)
   */
  private async sendProgressUpdate(event: OrderEvent): Promise<void> {
    const statusMap = {
      frame_cut: 'frame cutting is complete',
      mat_cut: 'mat cutting is complete'
    };
    
    const status = statusMap[event.eventType as keyof typeof statusMap] || event.eventType;
    const message = `Hello ${event.customerName}! This is Jay's Frames with an update on your order ${event.orderNumber}. We're happy to report that ${status} and your project is progressing well. Thank you for your patience!`;
    
    const callData = {
      to: this.formatPhoneNumber(event.customerPhone),
      message,
      voice: 'Polly.Amy'
    };

    await this.voiceCallService.makeCustomCall(callData);
    console.log(`Progress update call sent for ${event.orderNumber}`);
  }

  /**
   * Send assembly complete notification
   */
  private async sendAssemblyComplete(event: OrderEvent): Promise<void> {
    const message = `Hello ${event.customerName}! This is Jay's Frames with exciting news. Your custom framing order ${event.orderNumber} has been assembled and is in final quality inspection. We'll call you soon when it's ready for pickup!`;
    
    const callData = {
      to: this.formatPhoneNumber(event.customerPhone),
      message,
      voice: 'Polly.Amy'
    };

    await this.voiceCallService.makeCustomCall(callData);
    console.log(`Assembly complete call sent for ${event.orderNumber}`);
  }

  /**
   * Send pickup ready notification
   */
  private async sendPickupReady(event: OrderEvent): Promise<void> {
    const callData = {
      to: this.formatPhoneNumber(event.customerPhone),
      customerName: event.customerName,
      orderNumber: event.orderNumber
    };

    await this.voiceCallService.makeOrderCompleteCall(callData);
    console.log(`Pickup ready call sent for ${event.orderNumber}`);
  }

  /**
   * Send payment reminder
   */
  private async sendPaymentReminder(event: OrderEvent): Promise<void> {
    const amount = event.metadata?.amount || 0;
    const dueDate = event.metadata?.dueDate || 'as soon as possible';
    
    const callData = {
      to: this.formatPhoneNumber(event.customerPhone),
      customerName: event.customerName,
      amount,
      orderNumber: event.orderNumber,
      dueDate
    };

    await this.voiceCallService.makePaymentReminderCall(callData);
    console.log(`Payment reminder call sent for ${event.orderNumber}`);
  }

  /**
   * Send pickup reminder for overdue orders
   */
  private async sendPickupReminder(event: OrderEvent): Promise<void> {
    const daysWaiting = event.metadata?.daysWaiting || 7;
    
    const callData = {
      to: this.formatPhoneNumber(event.customerPhone),
      customerName: event.customerName,
      orderNumber: event.orderNumber,
      daysWaiting
    };

    await this.voiceCallService.makePickupReminderCall(callData);
    console.log(`Pickup reminder call sent for ${event.orderNumber}`);
  }

  /**
   * Format phone number to E.164 format
   */
  private formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    return phone.startsWith('+') ? phone : `+${cleaned}`;
  }

  /**
   * Schedule a delayed notification (for pickup reminders, payment due dates, etc.)
   */
  async scheduleDelayedNotification(event: OrderEvent, delayMinutes: number): Promise<void> {
    setTimeout(async () => {
      await this.handleOrderEvent(event);
    }, delayMinutes * 60 * 1000);
    
    console.log(`Scheduled notification for order ${event.orderNumber} in ${delayMinutes} minutes`);
  }

  /**
   * Bulk notification for multiple orders (useful for daily reminders)
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

  /**
   * Check for overdue orders and send pickup reminders
   */
  async checkOverdueOrders(): Promise<void> {
    // This would typically query your database for orders ready for pickup > X days
    // For now, this is a placeholder that can be integrated with your order storage
    console.log('Checking for overdue pickup orders...');
    
    // Example implementation:
    // const overdueOrders = await storage.getOverdueOrders(7); // 7 days overdue
    // const notifications = overdueOrders.map(order => ({
    //   orderId: order.id,
    //   orderNumber: order.orderNumber,
    //   customerName: order.customerName,
    //   customerPhone: order.customerPhone,
    //   eventType: 'pickup_overdue' as const,
    //   metadata: { daysWaiting: order.daysOverdue }
    // }));
    // await this.sendBulkNotifications(notifications);
  }
}

// Export a singleton instance
export const orderNotificationService = new OrderNotificationService();