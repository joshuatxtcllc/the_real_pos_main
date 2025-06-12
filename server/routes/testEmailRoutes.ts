
import express from 'express';
import { sendEmailWithSendGrid, sendOrderStatusUpdate } from '../services/emailService.js';

const router = express.Router();

// Test basic email sending
router.post('/test-basic', async (req, res) => {
  const { to, subject, message } = req.body;
  
  if (!to || !subject || !message) {
    return res.status(400).json({ 
      error: 'Missing required fields: to, subject, message' 
    });
  }

  // Debug info
  console.log('SendGrid API Key exists:', !!process.env.SENDGRID_API_KEY);
  console.log('SendGrid API Key starts with SG.:', process.env.SENDGRID_API_KEY?.startsWith('SG.'));
  console.log('From email:', process.env.FROM_EMAIL || 'noreply@jaysframes.com');

  try {
    // Use your verified sender email from SendGrid dashboard
    const fromEmail = 'noreply@jaysframes.com'; // This should match one of your verified senders
    
    await sendEmailWithSendGrid({
      to,
      from: fromEmail,
      subject,
      text: message,
      html: `<p>${message}</p>`
    });

    res.json({ 
      success: true, 
      message: 'Test email sent successfully!' 
    });
  } catch (error) {
    console.error('Test email error:', error);
    
    // More detailed error information
    const errorDetails = {
      message: error.message,
      hasApiKey: !!process.env.SENDGRID_API_KEY,
      apiKeyFormat: process.env.SENDGRID_API_KEY?.startsWith('SG.') ? 'Valid format' : 'Invalid format',
      fromEmail: process.env.FROM_EMAIL || 'noreply@jaysframes.com'
    };

    res.status(500).json({ 
      error: 'Failed to send test email', 
      details: error.message,
      debug: errorDetails
    });
  }
});

// Test order status email
router.post('/test-order-status', async (req, res) => {
  const { 
    customerEmail, 
    customerName = 'Test Customer',
    orderId = 12345,
    orderStatus = 'order_processed'
  } = req.body;
  
  if (!customerEmail) {
    return res.status(400).json({ 
      error: 'Missing required field: customerEmail' 
    });
  }

  try {
    await sendOrderStatusUpdate(
      customerEmail,
      customerName,
      orderId,
      orderStatus,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    );

    res.json({ 
      success: true, 
      message: 'Order status email sent successfully!' 
    });
  } catch (error) {
    console.error('Order status email error:', error);
    res.status(500).json({ 
      error: 'Failed to send order status email', 
      details: error.message 
    });
  }
});

export default router;
