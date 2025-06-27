import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useStripe } from '@stripe/react-stripe-js';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

/**
 * PaymentStatus component to handle payment success/failure status
 * This page is typically accessed after a Stripe redirect
 */
const PaymentStatus = () => {
  const stripe = useStripe();
  const [location, setLocation] = useLocation();
  const [status, setStatus] = React.useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = React.useState<string>('');

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Extract the client secret from URL query parameters
    const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret');
    const token = new URLSearchParams(window.location.search).get('token');

    if (clientSecret) {
      // Handle Stripe payment status
      stripe.retrievePaymentIntent(clientSecret)
        .then(({ paymentIntent, error }) => {
          if (error) {
            console.error('Error retrieving payment intent:', error);
            setStatus('failed');
            setMessage(`Unable to retrieve payment information: ${error.message}`);
            return;
          }

          if (!paymentIntent) {
            setStatus('failed');
            setMessage('Unable to retrieve payment information.');
            return;
          }

          switch (paymentIntent.status) {
            case 'succeeded':
              setStatus('success');
              setMessage('Your payment was successful! Your framing order has been submitted.');
              // Verify payment completion on server side
              verifyPaymentCompletion(paymentIntent.id, token);
              break;
            case 'processing':
              setStatus('loading');
              setMessage('Your payment is processing. We will notify you when it is complete.');
              // Poll for status updates
              pollPaymentStatus(clientSecret);
              break;
            case 'requires_payment_method':
              setStatus('failed');
              setMessage('Your payment was not successful, please try again.');
              break;
            case 'requires_action':
              setStatus('failed');
              setMessage('Your payment requires additional authentication. Please try again.');
              break;
            case 'requires_confirmation':
              setStatus('loading');
              setMessage('Confirming your payment...');
              break;
            case 'canceled':
              setStatus('failed');
              setMessage('Your payment was canceled.');
              break;
            default:
              setStatus('failed');
              setMessage('Something went wrong with your payment.');
              break;
          }
        })
        .catch((error) => {
          console.error('Error retrieving payment intent:', error);
          setStatus('failed');
          setMessage('Network error. Please check your connection and try again.');
        });
    } else {
      // No client secret in URL, likely direct navigation to this page
      setStatus('failed');
      setMessage('No payment information found.');
    }
  }, [stripe]);

  // Verify payment completion on server side
  const verifyPaymentCompletion = async (paymentIntentId: string, token: string | null) => {
    if (!token) return;
    
    try {
      const response = await fetch(`/api/payment/${token}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId }),
      });
      
      if (!response.ok) {
        console.warn('Payment verification failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  // Poll payment status for processing payments
  const pollPaymentStatus = (clientSecret: string) => {
    const pollInterval = setInterval(() => {
      if (!stripe) return;
      
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        if (paymentIntent && paymentIntent.status !== 'processing') {
          clearInterval(pollInterval);
          
          if (paymentIntent.status === 'succeeded') {
            setStatus('success');
            setMessage('Your payment was successful! Your framing order has been submitted.');
          } else {
            setStatus('failed');
            setMessage('Your payment could not be completed. Please try again.');
          }
        }
      });
    }, 3000); // Poll every 3 seconds

    // Clear polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (status === 'loading') {
        setStatus('failed');
        setMessage('Payment verification timed out. Please contact support.');
      }
    }, 300000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              {status === 'loading' && 'Processing Payment'}
              {status === 'success' && 'Payment Successful'}
              {status === 'failed' && 'Payment Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            {status === 'loading' && (
              <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            )}
            {status === 'failed' && (
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
            )}
            <p className="text-center">{message}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            {status === 'success' && (
              <Button onClick={() => setLocation('/orders')}>
                View Your Orders
              </Button>
            )}
            {status === 'failed' && (
              <Button onClick={() => window.history.back()}>
                Try Again
              </Button>
            )}
            {status === 'loading' && (
              <Button variant="outline" disabled>
                Please Wait...
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PaymentStatus;