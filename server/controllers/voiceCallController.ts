import { Request, Response } from 'express';
import { 
  makeVoiceCall, 
  callOrderStatusUpdate, 
  callPaymentReminder as serviceCallPaymentReminder, 
  callPickupReminder as serviceCallPickupReminder, 
  callOrderComplete as serviceCallOrderComplete,
  getCallStatus,
  formatPhoneNumber,
  isVoiceCallingConfigured
} from '../services/voiceCallService.js';

/**
 * Make a custom voice call
 */
export const makeCustomVoiceCall = async (req: Request, res: Response) => {
  try {
    const { to, message, voice, language, twiml, url, recordCall } = req.body;

    if (!to) {
      return res.status(400).json({ 
        error: 'Phone number is required' 
      });
    }

    if (!message && !twiml && !url) {
      return res.status(400).json({ 
        error: 'Must provide either message, twiml, or url parameter' 
      });
    }

    if (!isVoiceCallingConfigured()) {
      return res.status(503).json({ 
        error: 'Voice calling is not configured. Please check Twilio credentials.' 
      });
    }

    const result = await makeVoiceCall({
      to: formatPhoneNumber(to),
      message,
      voice,
      language,
      twiml,
      url,
      recordCall
    });

    if (result.success) {
      res.json({ 
        success: true, 
        callSid: result.sid,
        message: 'Voice call initiated successfully' 
      });
    } else {
      res.status(400).json({ 
        error: result.error 
      });
    }
  } catch (error: any) {
    console.error('Error making voice call:', error);
    res.status(500).json({ 
      error: 'Failed to make voice call' 
    });
  }
};

/**
 * Call customer with order status update
 */
export const callOrderStatus = async (req: Request, res: Response) => {
  try {
    const { to, orderNumber, status, estimatedCompletion } = req.body;

    if (!to || !orderNumber || !status) {
      return res.status(400).json({ 
        error: 'Phone number, order number, and status are required' 
      });
    }

    if (!isVoiceCallingConfigured()) {
      return res.status(503).json({ 
        error: 'Voice calling is not configured. Please check Twilio credentials.' 
      });
    }

    const result = await callOrderStatusUpdate({
      to: formatPhoneNumber(to),
      orderNumber,
      status,
      estimatedCompletion
    });

    if (result.success) {
      res.json({ 
        success: true, 
        callSid: result.sid,
        message: 'Order status call initiated successfully' 
      });
    } else {
      res.status(400).json({ 
        error: result.error 
      });
    }
  } catch (error: any) {
    console.error('Error making order status call:', error);
    res.status(500).json({ 
      error: 'Failed to make order status call' 
    });
  }
};

/**
 * Call customer with payment reminder
 */
export const callPaymentReminderController = async (req: Request, res: Response) => {
  try {
    const { to, customerName, amount, orderNumber, dueDate } = req.body;

    if (!to || !customerName || !amount || !orderNumber) {
      return res.status(400).json({ 
        error: 'Phone number, customer name, amount, and order number are required' 
      });
    }

    if (!isVoiceCallingConfigured()) {
      return res.status(503).json({ 
        error: 'Voice calling is not configured. Please check Twilio credentials.' 
      });
    }

    const result = await serviceCallPaymentReminder({
      to: formatPhoneNumber(to),
      customerName,
      amount: parseFloat(amount),
      orderNumber,
      dueDate
    });

    if (result.success) {
      res.json({ 
        success: true, 
        callSid: result.sid,
        message: 'Payment reminder call initiated successfully' 
      });
    } else {
      res.status(400).json({ 
        error: result.error 
      });
    }
  } catch (error: any) {
    console.error('Error making payment reminder call:', error);
    res.status(500).json({ 
      error: 'Failed to make payment reminder call' 
    });
  }
};

/**
 * Call customer with pickup reminder
 */
export const callPickupReminderController = async (req: Request, res: Response) => {
  try {
    const { to, customerName, orderNumber, daysWaiting } = req.body;

    if (!to || !customerName || !orderNumber || daysWaiting === undefined) {
      return res.status(400).json({ 
        error: 'Phone number, customer name, order number, and days waiting are required' 
      });
    }

    if (!isVoiceCallingConfigured()) {
      return res.status(503).json({ 
        error: 'Voice calling is not configured. Please check Twilio credentials.' 
      });
    }

    const result = await serviceCallPickupReminder(
      customerName,
      formatPhoneNumber(to),
      orderNumber,
      parseInt(daysWaiting)
    );

    if (result.success) {
      res.json({ 
        success: true, 
        callSid: result.sid,
        message: 'Pickup reminder call initiated successfully' 
      });
    } else {
      res.status(400).json({ 
        error: result.error 
      });
    }
  } catch (error: any) {
    console.error('Error making pickup reminder call:', error);
    res.status(500).json({ 
      error: 'Failed to make pickup reminder call' 
    });
  }
};

/**
 * Call customer when order is complete
 */
export const callOrderCompleteController = async (req: Request, res: Response) => {
  try {
    const { to, customerName, orderNumber } = req.body;

    if (!to || !customerName || !orderNumber) {
      return res.status(400).json({ 
        error: 'Phone number, customer name, and order number are required' 
      });
    }

    if (!isVoiceCallingConfigured()) {
      return res.status(503).json({ 
        error: 'Voice calling is not configured. Please check Twilio credentials.' 
      });
    }

    const result = await serviceCallOrderComplete(
      customerName,
      formatPhoneNumber(to),
      orderNumber
    );

    if (result.success) {
      res.json({ 
        success: true, 
        callSid: result.sid,
        message: 'Order completion call initiated successfully' 
      });
    } else {
      res.status(400).json({ 
        error: result.error 
      });
    }
  } catch (error: any) {
    console.error('Error making order completion call:', error);
    res.status(500).json({ 
      error: 'Failed to make order completion call' 
    });
  }
};

/**
 * Get status of a voice call
 */
export const getVoiceCallStatus = async (req: Request, res: Response) => {
  try {
    const { callSid } = req.params;

    if (!callSid) {
      return res.status(400).json({ 
        error: 'Call SID is required' 
      });
    }

    if (!isVoiceCallingConfigured()) {
      return res.status(503).json({ 
        error: 'Voice calling is not configured. Please check Twilio credentials.' 
      });
    }

    const result = await getCallStatus(callSid);

    if (result.success) {
      res.json({ 
        success: true, 
        status: result.status 
      });
    } else {
      res.status(400).json({ 
        error: result.error 
      });
    }
  } catch (error: any) {
    console.error('Error getting call status:', error);
    res.status(500).json({ 
      error: 'Failed to get call status' 
    });
  }
};

/**
 * Check if voice calling is configured
 */
export const checkVoiceCallConfiguration = async (req: Request, res: Response) => {
  try {
    const configured = isVoiceCallingConfigured();
    
    res.json({
      configured,
      message: configured 
        ? 'Voice calling is properly configured' 
        : 'Voice calling requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER'
    });
  } catch (error: any) {
    console.error('Error checking voice call configuration:', error);
    res.status(500).json({ 
      error: 'Failed to check voice call configuration' 
    });
  }
};