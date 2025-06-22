import { Router, Request, Response } from 'express';

const router = Router();

/**
 * TwiML endpoint for order completion calls
 * Returns dynamic TwiML based on order details
 */
router.post('/order-complete/:orderNumber', (req: Request, res: Response) => {
  const { orderNumber } = req.params;
  const { customerName } = req.query;

  // Set proper content type for TwiML
  res.set('Content-Type', 'text/xml');

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Amy">Hello ${customerName || 'valued customer'}! This is Jay's Frames calling with great news.</Say>
    <Pause length="1"/>
    <Say voice="Polly.Amy">Your custom framing order number ${orderNumber} is now complete and ready for pickup.</Say>
    <Pause length="1"/>
    <Play>https://demo.twilio.com/docs/classic.mp3</Play>
    <Say voice="Polly.Amy">We're excited for you to see the beautiful result. Please come by during our business hours to collect your order.</Say>
    <Pause length="1"/>
    <Say voice="Polly.Amy">Thank you for choosing Jay's Frames. Have a wonderful day!</Say>
</Response>`;

  res.send(twiml);
});

/**
 * TwiML endpoint for payment reminders
 * Returns dynamic TwiML with payment amount and due date
 */
router.post('/payment-reminder/:orderNumber', (req: Request, res: Response) => {
  const { orderNumber } = req.params;
  const { customerName, amount, dueDate } = req.query;

  res.set('Content-Type', 'text/xml');

  const dueDateText = dueDate ? ` Payment is due by ${dueDate}.` : '';
  
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Brian">Hello ${customerName || 'valued customer'}, this is Jay's Frames calling about your order number ${orderNumber}.</Say>
    <Pause length="1"/>
    <Say voice="Polly.Brian">You have an outstanding balance of ${amount || 'your order total'}.${dueDateText}</Say>
    <Pause length="1"/>
    <Say voice="Polly.Brian">Please contact us at your earliest convenience to complete your payment.</Say>
    <Pause length="1"/>
    <Say voice="Polly.Brian">Thank you for your prompt attention to this matter.</Say>
</Response>`;

  res.send(twiml);
});

/**
 * TwiML endpoint for pickup reminders
 * Returns dynamic TwiML with days waiting information
 */
router.post('/pickup-reminder/:orderNumber', (req: Request, res: Response) => {
  const { orderNumber } = req.params;
  const { customerName, daysWaiting } = req.query;

  res.set('Content-Type', 'text/xml');

  const days = parseInt(daysWaiting as string || '1');
  const dayText = days === 1 ? 'day' : 'days';
  
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Emma">Hello ${customerName || 'valued customer'}, this is Jay's Frames.</Say>
    <Pause length="1"/>
    <Say voice="Polly.Emma">Your custom framing order number ${orderNumber} has been ready for pickup for ${days} ${dayText}.</Say>
    <Pause length="1"/>
    <Say voice="Polly.Emma">Please come by during our business hours to collect your beautiful framed artwork.</Say>
    <Pause length="1"/>
    <Say voice="Polly.Emma">We look forward to seeing you soon. Thank you!</Say>
</Response>`;

  res.send(twiml);
});

/**
 * TwiML endpoint for custom promotional messages
 * Can include music and complex messaging
 */
router.post('/promotional/:campaignId', (req: Request, res: Response) => {
  const { campaignId } = req.params;
  const { customerName } = req.query;

  res.set('Content-Type', 'text/xml');

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Amy">Hello ${customerName || 'valued customer'}! Thank you for being a loyal customer of Jay's Frames.</Say>
    <Pause length="1"/>
    <Play>https://demo.twilio.com/docs/classic.mp3</Play>
    <Say voice="Polly.Amy">We have an exciting special offer just for you! Visit our shop this week for twenty percent off all custom matting services.</Say>
    <Pause length="1"/>
    <Say voice="Polly.Amy">This exclusive offer expires soon, so don't miss out on transforming your favorite artwork.</Say>
    <Pause length="1"/>
    <Say voice="Polly.Amy">Thank you for choosing Jay's Frames. We can't wait to help you create something beautiful!</Say>
</Response>`;

  res.send(twiml);
});

/**
 * Interactive TwiML endpoint that can gather user input
 * Demonstrates <Gather> verb for interactive calls
 */
router.post('/interactive-survey/:orderNumber', (req: Request, res: Response) => {
  const { orderNumber } = req.params;
  const { customerName } = req.query;

  res.set('Content-Type', 'text/xml');

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Amy">Hello ${customerName || 'valued customer'}! This is Jay's Frames calling about your recent order number ${orderNumber}.</Say>
    <Pause length="1"/>
    <Gather numDigits="1" action="/api/twiml/survey-response" method="POST" timeout="10">
        <Say voice="Polly.Amy">We'd love to hear about your experience. Please press 1 if you're extremely satisfied, 2 for satisfied, or 3 if you have concerns.</Say>
    </Gather>
    <Say voice="Polly.Amy">Thank you for your time. Have a wonderful day!</Say>
</Response>`;

  res.send(twiml);
});

/**
 * Handle survey response
 */
router.post('/survey-response', (req: Request, res: Response) => {
  const { Digits } = req.body;

  res.set('Content-Type', 'text/xml');

  let responseMessage = '';
  switch (Digits) {
    case '1':
      responseMessage = 'Thank you for rating us as extremely satisfied! We appreciate your business and look forward to serving you again.';
      break;
    case '2':
      responseMessage = 'Thank you for your positive feedback! We appreciate your business.';
      break;
    case '3':
      responseMessage = 'Thank you for your feedback. We will have a manager contact you shortly to address your concerns.';
      break;
    default:
      responseMessage = 'Thank you for your time. Have a wonderful day!';
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Amy">${responseMessage}</Say>
</Response>`;

  res.send(twiml);
});

export default router;