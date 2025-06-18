import axios from 'axios';

// SMS Hub configuration
const SMS_HUB_URL = 'https://telitel-sms-hub-JayFrames.replit.app';
const SMS_HUB_API_KEY = process.env.SMS_HUB_API_KEY || 'jays_frames_api_2025';

interface NotificationParams {
  to: string;
  from?: string;
  subject: string;
  message: string;
  orderId?: string;
  customerName?: string;
  type?: string;
}

/**
 * Send notification using the SMS Hub with email option
 * @param params Notification parameters
 * @returns Promise that resolves when notification is sent
 */
export async function sendNotificationViaSmsHub(params: NotificationParams): Promise<void> {
  try {
    const response = await axios.post(`${SMS_HUB_URL}/api/notifications/send`, {
      to: params.to,
      subject: params.subject,
      message: params.message,
      orderId: params.orderId,
      customerName: params.customerName,
      type: params.type || 'order_update',
      source: 'Jays Frames POS',
      method: 'email', // Use email delivery method
      deliveryType: 'email' // Specify email as the delivery type
    }, {
      headers: {
        'Authorization': `Bearer ${SMS_HUB_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (response.data && response.data.success) {
      console.log(`Email notification sent successfully to ${params.to} via SMS Hub`);
    } else {
      throw new Error(response.data?.error || 'SMS Hub returned error response');
    }
  } catch (error: any) {
    console.error('SMS Hub Error:', error.message);
    
    if (error.response) {
      console.error('SMS Hub Response:', error.response.data);
    }
    
    throw new Error(`Failed to send email notification via SMS Hub: ${error.message}`);
  }
}

/**
 * Send order status update notification via email through SMS Hub
 * @param customerEmail Customer email address
 * @param customerPhone Customer phone number (unused - using email delivery)
 * @param customerName Customer name
 * @param orderId Order ID
 * @param status New order status
 * @returns Promise that resolves when notification is sent
 */
export async function sendOrderStatusUpdate(
  customerEmail: string,
  customerPhone: string,
  customerName: string,
  orderId: string,
  status: string
): Promise<void> {
  const message = `Hi ${customerName}, your order #${orderId} status has been updated to: ${status}. Thank you for choosing Jay's Frames!`;
  
  await sendNotificationViaSmsHub({
    to: customerEmail, // Always use email address for delivery
    subject: `Order #${orderId} Update`,
    message,
    orderId,
    customerName,
    type: 'status_update'
  });
}

/**
 * Test SMS Hub connection
 * @returns Promise that resolves with connection status
 */
export async function testSmsHubConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.get(`${SMS_HUB_URL}/api/health`, {
      headers: {
        'Authorization': `Bearer ${SMS_HUB_API_KEY}`
      },
      timeout: 5000
    });

    return {
      success: true,
      message: `SMS Hub connected successfully: ${response.data?.status || 'OK'}`
    };
  } catch (error: any) {
    return {
      success: false,
      message: `SMS Hub connection failed: ${error.message}`
    };
  }
}