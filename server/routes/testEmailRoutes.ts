
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

  try {
    await sendEmailWithSendGrid({
      to,
      from: process.env.FROM_EMAIL || 'noreply@jaysframes.com',
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
    res.status(500).json({ 
      error: 'Failed to send test email', 
      details: error.message 
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
