import twilio from 'twilio';

// Initialize Twilio client with API credentials
let twilioClient: twilio.Twilio | null = null;

// Check if Twilio is configured
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

interface VoiceCallParams {
  to: string;
  message?: string;
  voice?: 'man' | 'woman' | 'alice' | 'Polly.Amy' | 'Polly.Brian' | 'Polly.Emma';
  language?: string;
  twiml?: string;
  url?: string;
  recordCall?: boolean;
}

interface CallStatusParams {
  to: string;
  orderNumber: string;
  status: string;
  estimatedCompletion?: string;
}

interface PaymentReminderParams {
  to: string;
  customerName: string;
  amount: number;
  orderNumber: string;
  dueDate?: string;
}

/**
 * Make a voice call using Twilio with TwiML or URL
 * @param params Voice call parameters including to, message, twiml, or url
 * @returns A promise that resolves when the call is initiated
 */
export async function makeVoiceCall(params: VoiceCallParams): Promise<{success: boolean, sid?: string, error?: string}> {
  // Check if Twilio is configured
  if (!twilioClient) {
    console.warn('Twilio is not configured. Voice calling is disabled.');
    return { 
      success: false, 
      error: 'Twilio is not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables.' 
    };
  }

  // Check if phone number is valid
  if (!params.to || !params.to.match(/^\+?[1-9]\d{1,14}$/)) {
    return { 
      success: false, 
      error: 'Invalid phone number format. Must be E.164 format (e.g., +12125551234).' 
    };
  }

  // Validate that we have either message, twiml, or url
  if (!params.message && !params.twiml && !params.url) {
    return { 
      success: false, 
      error: 'Must provide either message, twiml, or url parameter.' 
    };
  }

  try {
    // Normalize phone number to E.164 format
    let phoneNumber = params.to;
    if (!phoneNumber.startsWith('+')) {
      // Assuming US phone number if no country code
      phoneNumber = '+1' + phoneNumber.replace(/\D/g, '');
    }

    // Prepare call options
    const callOptions: any = {
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER || '',
    };

    // Add recording if requested
    if (params.recordCall) {
      callOptions.record = true;
    }

    // Use custom TwiML if provided
    if (params.twiml) {
      callOptions.twiml = params.twiml;
    }
    // Use URL if provided (takes precedence over message)
    else if (params.url) {
      callOptions.url = params.url;
    }
    // Create TwiML from message
    else if (params.message) {
      const voice = params.voice || 'alice';
      const language = params.language || 'en-US';
      
      // Create proper TwiML XML
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="${voice}" language="${language}">${escapeXml(params.message)}</Say>
</Response>`;
      
      callOptions.twiml = twiml;
    }

    // Make the call
    const call = await twilioClient.calls.create(callOptions);
    
    console.log(`Voice call initiated successfully to ${params.to}, SID: ${call.sid}`);
    return { 
      success: true, 
      sid: call.sid 
    };
  } catch (error: any) {
    console.error('Twilio Voice Call Error:', error);
    return { 
      success: false, 
      error: `Failed to make voice call: ${error.message}` 
    };
  }
}

/**
 * Escape XML special characters for TwiML
 * @param text Text to escape
 * @returns Escaped text safe for XML
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Make a voice call for order status update
 * @param params Order status parameters
 * @returns A promise that resolves with the result of making the call
 */
export async function callOrderStatusUpdate(params: CallStatusParams): Promise<{success: boolean, sid?: string, error?: string}> {
  const completionText = params.estimatedCompletion 
    ? ` Your order is expected to be ready ${params.estimatedCompletion}.`
    : '';
    
  const message = `Hello from Jay's Frames. This is an automated update about your order number ${params.orderNumber}. Your order status has been updated to ${params.status}.${completionText} Thank you for choosing Jay's Frames.`;
  
  return await makeVoiceCall({
    to: params.to,
    message,
    voice: 'alice'
  });
}

/**
 * Make a voice call for payment reminder
 * @param params Payment reminder parameters
 * @returns A promise that resolves with the result of making the call
 */
export async function callPaymentReminder(params: PaymentReminderParams): Promise<{success: boolean, sid?: string, error?: string}> {
  const formattedAmount = params.amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  const dueDateText = params.dueDate 
    ? ` Payment is due by ${params.dueDate}.`
    : '';
    
  const message = `Hello ${params.customerName}, this is Jay's Frames calling about your order number ${params.orderNumber}. You have an outstanding balance of ${formattedAmount}.${dueDateText} Please contact us at your earliest convenience to complete your payment. Thank you.`;
  
  return await makeVoiceCall({
    to: params.to,
    message,
    voice: 'alice'
  });
}

/**
 * Make a voice call for order pickup reminder
 * @param customerName Customer's name
 * @param phoneNumber Customer's phone number
 * @param orderNumber Order number
 * @param daysWaiting Number of days the order has been ready
 * @returns A promise that resolves with the result of making the call
 */
export async function callPickupReminder(
  customerName: string,
  phoneNumber: string, 
  orderNumber: string,
  daysWaiting: number
): Promise<{success: boolean, sid?: string, error?: string}> {
  const dayText = daysWaiting === 1 ? 'day' : 'days';
  const message = `Hello ${customerName}, this is Jay's Frames. Your custom framing order number ${orderNumber} has been ready for pickup for ${daysWaiting} ${dayText}. Please come by during our business hours to collect your beautiful framed artwork. Thank you.`;
  
  return await makeVoiceCall({
    to: phoneNumber,
    message,
    voice: 'alice'
  });
}

/**
 * Make a voice call for order completion notification
 * @param customerName Customer's name
 * @param phoneNumber Customer's phone number
 * @param orderNumber Order number
 * @returns A promise that resolves with the result of making the call
 */
export async function callOrderComplete(
  customerName: string,
  phoneNumber: string, 
  orderNumber: string
): Promise<{success: boolean, sid?: string, error?: string}> {
  const message = `Hello ${customerName}, this is Jay's Frames with great news! Your custom framing order number ${orderNumber} is now complete and ready for pickup. We're excited for you to see the beautiful result. Please come by during our business hours to collect your order. Thank you for choosing Jay's Frames.`;
  
  return await makeVoiceCall({
    to: phoneNumber,
    message,
    voice: 'alice'
  });
}

/**
 * Get call status from Twilio
 * @param callSid The call SID to check
 * @returns A promise that resolves with the call status
 */
export async function getCallStatus(callSid: string): Promise<{success: boolean, status?: string, error?: string}> {
  if (!twilioClient) {
    return { 
      success: false, 
      error: 'Twilio is not configured.' 
    };
  }

  try {
    const call = await twilioClient.calls(callSid).fetch();
    return { 
      success: true, 
      status: call.status 
    };
  } catch (error: any) {
    console.error('Error fetching call status:', error);
    return { 
      success: false, 
      error: `Failed to get call status: ${error.message}` 
    };
  }
}

/**
 * Formats a phone number to E.164 format
 * @param phoneNumber The phone number to format
 * @returns The formatted phone number
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // Check if the number already has a country code
  if (digitsOnly.length === 10) {
    // Assuming US number without country code
    return `+1${digitsOnly}`;
  } else if (digitsOnly.length > 10 && !phoneNumber.startsWith('+')) {
    // Has country code but missing + prefix
    return `+${digitsOnly}`;
  } else if (phoneNumber.startsWith('+')) {
    // Already in E.164 format
    return phoneNumber;
  }
  
  // Return as-is if we can't format it
  return phoneNumber;
}

/**
 * Check if Twilio voice calling is configured
 * @returns Boolean indicating if voice calling is available
 */
export function isVoiceCallingConfigured(): boolean {
  return twilioClient !== null && !!process.env.TWILIO_PHONE_NUMBER;
}