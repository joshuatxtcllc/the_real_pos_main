import { Request, Response } from 'express';
import { db } from '../db';
import { customers, paymentLinks } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { storage } from '../storage';
import { 
  createPaymentLink, 
  sendPaymentLinkViaEmail, 
  sendPaymentLinkViaSmsWithId, 
  validatePaymentLink, 
  createPaymentIntentForLink, 
  markPaymentLinkAsUsed 
} from '../services/paymentLinkService';

/**
 * Create a new payment link
 */
export async function createNewPaymentLink(req: Request, res: Response) {
  try {
    // Set content type header first
    res.setHeader('Content-Type', 'application/json');
    
    const { amount, customerId, description, expiresInDays = 7, email, phone, sendNotification } = req.body;
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Valid payment amount is required' 
      });
    }
    
    // Validate customer if provided
    if (customerId) {
      const [customer] = await db.select().from(customers).where(eq(customers.id, customerId));
      if (!customer) {
        return res.status(404).json({ 
          success: false,
          message: 'Customer not found' 
        });
      }
    }
    
    // Create the payment link
    const paymentLink = await createPaymentLink(
      Number(amount),
      customerId,
      description,
      expiresInDays
    );
    
    // Send notifications if requested
    const notifications: { email?: boolean, sms?: boolean } = { email: false, sms: false };
    
    if (sendNotification && email) {
      notifications.email = await sendPaymentLinkViaEmail(paymentLink.id, email);
    }
    
    if (sendNotification && phone) {
      notifications.sms = await sendPaymentLinkViaSmsWithId(paymentLink.id, phone);
    }
    
    // Create payment URL for response
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const paymentUrl = `${baseUrl}/payment/${paymentLink.token}`;
    
    return res.status(201).json({ 
      success: true,
      paymentLink: {
        ...paymentLink,
        paymentUrl
      },
      notifications 
    });
  } catch (error: any) {
    console.error('Error creating payment link:', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      success: false,
      message: `Failed to create payment link: ${error.message}` 
    });
  }
}

/**
 * Get all payment links
 */
export async function getAllPaymentLinks(req: Request, res: Response) {
  try {
    res.setHeader('Content-Type', 'application/json');
    const allLinks = await db.select().from(paymentLinks).orderBy(paymentLinks.createdAt, 'desc');
    return res.json({
      success: true,
      paymentLinks: allLinks
    });
  } catch (error: any) {
    console.error('Error fetching payment links:', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      success: false,
      message: `Failed to fetch payment links: ${error.message}` 
    });
  }
}

/**
 * Get a payment link by ID
 */
export async function getPaymentLinkById(req: Request, res: Response) {
  try {
    res.setHeader('Content-Type', 'application/json');
    const id = parseInt(req.params.id);
    
    const [paymentLink] = await db.select().from(paymentLinks).where(eq(paymentLinks.id, id));
    
    if (!paymentLink) {
      return res.status(404).json({ 
        success: false,
        message: 'Payment link not found' 
      });
    }
    
    return res.json({
      success: true,
      paymentLink
    });
  } catch (error: any) {
    console.error('Error fetching payment link:', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      success: false,
      message: `Failed to fetch payment link: ${error.message}` 
    });
  }
}

/**
 * Send a payment link notification
 */
export async function sendPaymentLinkNotification(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const { email, phone, notificationType = 'both' } = req.body;
    
    const [paymentLink] = await db.select().from(paymentLinks).where(eq(paymentLinks.id, id));
    
    if (!paymentLink) {
      return res.status(404).json({ message: 'Payment link not found' });
    }
    
    if (paymentLink.used) {
      return res.status(400).json({ message: 'Payment link has already been used' });
    }
    
    const now = new Date();
    if (paymentLink.expiresAt < now) {
      return res.status(400).json({ message: 'Payment link has expired' });
    }
    
    // Send notifications based on type
    const result: { email?: boolean, sms?: boolean } = {};
    
    if ((notificationType === 'email' || notificationType === 'both') && email) {
      result.email = await sendPaymentLinkViaEmail(id, email);
    }
    
    if ((notificationType === 'sms' || notificationType === 'both') && phone) {
      result.sms = await sendPaymentLinkViaSmsWithId(id, phone);
    }
    
    res.json({ 
      success: true,
      notifications: result 
    });
  } catch (error: any) {
    console.error('Error sending payment link notification:', error);
    res.status(500).json({ 
      success: false,
      message: `Failed to send notification: ${error.message}` 
    });
  }
}

/**
 * Validate a payment link by token and create payment intent
 */
export async function validatePaymentLinkByToken(req: Request, res: Response) {
  try {
    const { token } = req.params;
    
    const paymentLink = await validatePaymentLink(token);
    
    if (!paymentLink) {
      return res.status(404).json({ 
        valid: false,
        message: 'Payment link is invalid, expired, or has already been used' 
      });
    }
    
    // Create a payment intent for this payment link
    const clientSecret = await createPaymentIntentForLink(paymentLink.id);
    
    if (!clientSecret) {
      return res.status(500).json({ 
        valid: true,
        canProcess: false,
        message: 'Failed to create payment intent' 
      });
    }
    
    res.json({ 
      valid: true,
      canProcess: true,
      paymentLink: {
        amount: paymentLink.amount,
        description: paymentLink.description,
        expiresAt: paymentLink.expiresAt
      },
      clientSecret 
    });
  } catch (error: any) {
    console.error('Error validating payment link:', error);
    res.status(500).json({ 
      valid: false,
      message: `Failed to validate payment link: ${error.message}` 
    });
  }
}

/**
 * Complete a payment for a payment link
 */
export async function completePaymentForLink(req: Request, res: Response) {
  try {
    const { token } = req.params;
    const { paymentIntentId, status = 'succeeded' } = req.body;
    
    const paymentLink = await validatePaymentLink(token);
    
    if (!paymentLink) {
      return res.status(404).json({ 
        success: false,
        message: 'Payment link is invalid, expired, or has already been used' 
      });
    }
    
    // Mark the payment link as used
    const updatedLink = await markPaymentLinkAsUsed(paymentLink.id, status);
    
    if (!updatedLink) {
      return res.status(500).json({ 
        success: false,
        message: 'Failed to mark payment link as used' 
      });
    }

    res.json({ 
      success: true,
      message: 'Payment completed successfully',
      paymentLink: {
        id: updatedLink.id,
        used: updatedLink.used,
        usedAt: updatedLink.usedAt
      }
    });

  } catch (error: any) {
    console.error('Complete payment error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to complete payment' 
    });
  }
}

/**
 * Verify payment completion (additional security check)
 */
export async function verifyPaymentCompletion(req: Request, res: Response) {
  try {
    const { token } = req.params;
    const { paymentIntentId } = req.body;
    
    if (!paymentIntentId) {
      return res.status(400).json({ 
        success: false,
        message: 'Payment intent ID is required' 
      });
    }

    const paymentLink = await validatePaymentLink(token);
    
    if (!paymentLink) {
      return res.status(404).json({ 
        success: false,
        message: 'Payment link not found or expired' 
      });
    }

    // Verify with Stripe that the payment actually succeeded
    if (process.env.STRIPE_SECRET_KEY) {
      // @ts-ignore
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status === 'succeeded' && !paymentLink.used) {
          // Mark payment link as used only if Stripe confirms success
          await markPaymentLinkAsUsed(paymentLink.id, 'succeeded');
          
          return res.json({ 
            success: true,
            verified: true,
            message: 'Payment verified successfully' 
          });
        }
      } catch (stripeError: any) {
        console.error('Stripe verification error:', stripeError);
        return res.status(400).json({ 
          success: false,
          message: 'Payment verification failed' 
        });
      }
    }

    res.json({ 
      success: true,
      verified: false,
      message: 'Could not verify payment with Stripe' 
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      success: false,
      message: `Payment verification error: ${error.message}` 
    });
  }
}