
import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const PaymentStatus = () => {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'processing'>('loading');
  const [message, setMessage] = useState<string>('');
  const [orderGroupId, setOrderGroupId] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentClientSecret = urlParams.get('payment_intent_client_secret');
    const redirectStatus = urlParams.get('redirect_status');

    if (!paymentIntentClientSecret) {
      setStatus('failed');
      setMessage('No payment information found.');
      return;
    }

    // Extract payment intent ID from client secret
    const paymentIntentId = paymentIntentClientSecret.split('_secret_')[0];

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch('/api/payment-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_intent_id: paymentIntentId,
            client_secret: paymentIntentClientSecret,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setOrderGroupId(data.orderGroupId);
          
          switch (data.status) {
            case 'succeeded':
              setStatus('success');
              setMessage('Your payment has been processed successfully!');
              break;
            case 'processing':
              setStatus('processing');
              setMessage('Your payment is being processed. We\'ll notify you when it\'s complete.');
              break;
            case 'requires_payment_method':
              setStatus('failed');
              setMessage('Your payment was not successful. Please try again with a different payment method.');
              break;
            default:
              setStatus('failed');
              setMessage('There was an issue with your payment. Please contact support.');
          }
        } else {
          setStatus('failed');
          setMessage(data.message || 'Failed to verify payment status.');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus('failed');
        setMessage('Unable to verify payment status. Please contact support.');
      }
    };

    checkPaymentStatus();
  }, []);

  const renderStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-12 w-12 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'processing':
        return <AlertCircle className="h-12 w-12 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-12 w-12 text-red-500" />;
      default:
        return <Loader2 className="h-12 w-12 animate-spin text-blue-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'loading':
        return 'Processing Payment...';
      case 'success':
        return 'Payment Successful!';
      case 'processing':
        return 'Payment Processing';
      case 'failed':
        return 'Payment Failed';
      default:
        return 'Processing Payment...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'processing':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {renderStatusIcon()}
            </div>
            <CardTitle className={getStatusColor()}>
              {getStatusTitle()}
            </CardTitle>
            <CardDescription>
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {status === 'success' && orderGroupId && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  Order #{orderGroupId} has been confirmed and will be processed shortly.
                </p>
              </div>
            )}
            
            {status === 'processing' && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">
                  We'll send you an email confirmation once the payment is complete.
                </p>
              </div>
            )}
            
            {status === 'failed' && (
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700">
                  No charges have been made to your account.
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {status === 'success' && orderGroupId ? (
                <>
                  <Button onClick={() => setLocation('/orders')}>
                    View My Orders
                  </Button>
                  <Button variant="outline" onClick={() => setLocation('/')}>
                    Return Home
                  </Button>
                </>
              ) : status === 'failed' ? (
                <>
                  <Button onClick={() => window.history.back()}>
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={() => setLocation('/')}>
                    Return Home
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setLocation('/')}>
                  Return Home
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentStatus;
