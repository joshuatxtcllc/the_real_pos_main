import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { Loader2, CreditCard, Banknote, FileCheck, Mail } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import InvoiceViewer from './InvoiceViewer';
import { OrderGroup } from '@shared/schema';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render
let stripePromise: Promise<any> | null = null;

// Initialize Stripe only if we have the public key
if (import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
}

interface CheckoutPaymentProps {
  orderGroupId: number;
  onPaymentComplete?: (orderGroup: OrderGroup) => void;
}

// Component for card payment using Stripe
const CardPaymentForm = ({ clientSecret, onSuccess }: { clientSecret: string, onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage('Payment system not ready. Please refresh the page.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Validate form before submission
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message || 'Please check your payment information.');
        setIsProcessing(false);
        return;
      }

      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-status`,
        },
        redirect: 'if_required',
      });

      if (error) {
        // Handle specific error types
        switch (error.type) {
          case 'card_error':
            setErrorMessage(`Your card was declined: ${error.message}`);
            break;
          case 'validation_error':
            setErrorMessage('Please check your payment information and try again.');
            break;
          case 'rate_limit_error':
            setErrorMessage('Too many payment attempts. Please wait a moment and try again.');
            break;
          default:
            setErrorMessage(error.message || 'An error occurred while processing your payment.');
        }
        setIsProcessing(false);
        return;
      }

      if (paymentIntent) {
        switch (paymentIntent.status) {
          case 'succeeded':
            toast({
              title: 'Payment Successful',
              description: 'Your payment has been processed successfully.',
            });
            window.location.href = `/payment-status?payment_intent_client_secret=${paymentIntent.client_secret}`;
            break;
          case 'processing':
            toast({
              title: 'Payment Processing',
              description: 'Your payment is being processed.',
            });
            window.location.href = `/payment-status?payment_intent_client_secret=${paymentIntent.client_secret}`;
            break;
          case 'requires_action':
            setErrorMessage('Your payment requires additional authentication. Please try again.');
            setIsProcessing(false);
            break;
          default:
            setErrorMessage('Payment could not be completed. Please try again.');
            setIsProcessing(false);
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setErrorMessage('An unexpected error occurred. Please check your connection and try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Pay Now'
        )}
      </Button>
    </form>
  );
};

// Cash payment form
const CashPaymentForm = ({ total, onSubmit }: { total: number, onSubmit: (cashReceived: number, change: number) => void }) => {
  const [cashReceived, setCashReceived] = useState('');
  const [change, setChange] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCashChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCashReceived(value);

    // Calculate change
    const cashAmount = parseFloat(value) || 0;
    setChange(Math.max(0, cashAmount - total));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      onSubmit(parseFloat(cashReceived), change);
      setIsProcessing(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cash-amount">Cash Received</Label>
        <div className="flex items-center">
          <span className="bg-muted px-3 py-2 rounded-l-md border border-r-0 border-input">$</span>
          <Input
            id="cash-amount"
            type="number"
            step="0.01"
            min={total}
            value={cashReceived}
            onChange={handleCashChanged}
            placeholder="0.00"
            className="rounded-l-none"
          />
        </div>
      </div>

      <div className="p-4 bg-muted rounded-md">
        <div className="flex justify-between">
          <span>Total Due:</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between">
          <span>Cash Received:</span>
          <span>{formatCurrency(parseFloat(cashReceived) || 0)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Change Due:</span>
          <span>{formatCurrency(change)}</span>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isProcessing || parseFloat(cashReceived) < total} 
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Complete Cash Payment'
        )}
      </Button>
    </form>
  );
};

// Check payment form
const CheckPaymentForm = ({ total, onSubmit }: { total: number, onSubmit: (checkNumber: string) => void }) => {
  const [checkNumber, setCheckNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      onSubmit(checkNumber);
      setIsProcessing(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="check-number">Check Number</Label>
        <Input
          id="check-number"
          value={checkNumber}
          onChange={(e) => setCheckNumber(e.target.value)}
          placeholder="Enter check number"
          required
        />
      </div>

      <div className="p-4 bg-muted rounded-md">
        <div className="flex justify-between font-semibold">
          <span>Total Due:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isProcessing || !checkNumber} 
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Complete Check Payment'
        )}
      </Button>
    </form>
  );
};

const CheckoutPayment: React.FC<CheckoutPaymentProps> = ({ 
  orderGroupId,
  onPaymentComplete 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'check' | 'partial' | 'deferred'>('card');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch order group
  const { data: orderGroup, isLoading } = useQuery({
    queryKey: [`/api/order-groups/${orderGroupId}`],
    queryFn: async () => {
      const response = await fetch(`/api/order-groups/${orderGroupId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order group');
      }
      return response.json();
    }
  });

  // Create payment intent mutation
  const createPaymentIntentMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderGroupId,
          amount: orderGroup.total,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment intent');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create payment intent',
        variant: 'destructive',
      });
    }
  });

  // Process payment mutation
  const processPaymentMutation = useMutation({
    mutationFn: async ({ 
      method, 
      details = {} 
    }: { 
      method: 'card' | 'cash' | 'check' | 'partial' | 'deferred',
      details?: Record<string, any> 
    }) => {
      const response = await fetch(`/api/order-groups/${orderGroupId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod: method,
          details,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process payment');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Payment Complete',
        description: 'Your payment has been processed successfully',
      });

      setPaymentComplete(true);

      // Update cache with the updated order group
      queryClient.setQueryData([`/api/order-groups/${orderGroupId}`], data);

      // Call the callback if provided
      if (onPaymentComplete) {
        onPaymentComplete(data);
      }
    },
    onError: (error) => {
      toast({
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'An error occurred processing the payment',
        variant: 'destructive',
      });
    }
  });

  // Initialize payment intent when payment method is selected
  useEffect(() => {
    if (paymentMethod === 'card' && orderGroup && !clientSecret && !paymentComplete && !createPaymentIntentMutation.isPending) {
      createPaymentIntentMutation.mutate();
    }
  }, [paymentMethod, orderGroup, clientSecret, paymentComplete, createPaymentIntentMutation.isPending]);

  const handleCardPaymentSuccess = () => {
    processPaymentMutation.mutate({ method: 'card' });
  };

  const handleCashPayment = (cashReceived: number, change: number) => {
    processPaymentMutation.mutate({ 
      method: 'cash', 
      details: { cashReceived, change } 
    });
  };

  const handleCheckPayment = (checkNumber: string) => {
    processPaymentMutation.mutate({ 
      method: 'check', 
      details: { checkNumber } 
    });
  };

  // Add functionality to email the invoice
  const handleEmailInvoice = async () => {
    if (!orderGroup || !orderGroup.customerId) {
      toast({
        title: 'Error',
        description: 'Cannot send email - customer information not found',
        variant: 'destructive'
      });
      return;
    }

    try {
      setEmailSending(true);

      const response = await fetch(`/api/invoices/${orderGroupId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})  // The email will default to customer's email
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Email Sent',
          description: 'Invoice has been emailed to the customer',
        });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to send invoice by email',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error sending invoice email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send invoice by email',
        variant: 'destructive'
      });
    } finally {
      setEmailSending(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Processing Payment</CardTitle>
          <CardDescription>Loading order information...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!orderGroup) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Order information not found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Unable to load order details. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  // If payment is complete, show success and invoice options
  if (paymentComplete) {
    return (
      <>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <div className="bg-green-100 p-2 rounded-full mr-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              Payment Complete
            </CardTitle>
            <CardDescription>
              Thank you for your payment of {formatCurrency(Number(orderGroup.total))}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-medium capitalize">{orderGroup.paymentMethod || paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span>#{orderGroupId}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-2">
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Return to Home
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleEmailInvoice}
                disabled={emailSending}
              >
                {emailSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Email Invoice
                  </>
                )}
              </Button>
              <Button onClick={() => setShowInvoice(true)}>
                View Invoice
              </Button>
            </div>
          </CardFooter>
        </Card>

        {showInvoice && (
          <InvoiceViewer 
            orderGroupId={orderGroupId} 
            onClose={() => setShowInvoice(false)}
          />
        )}
      </>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>
          Complete your payment of {formatCurrency(Number(orderGroup.total))}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose Payment Method</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('card')}
                  className="h-16 flex flex-col items-center justify-center p-2"
                >
                  <CreditCard className="h-5 w-5 mb-1" />
                  <span className="text-xs">Credit Card</span>
                </Button>
                <Button
                  variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('cash')}
                  className="h-16 flex flex-col items-center justify-center p-2"
                >
                  <Banknote className="h-5 w-5 mb-1" />
                  <span className="text-xs">Cash</span>
                </Button>
                <Button
                  variant={paymentMethod === 'check' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('check')}
                  className="h-16 flex flex-col items-center justify-center p-2"
                >
                  <FileCheck className="h-5 w-5 mb-1" />
                  <span className="text-xs">Check</span>
                </Button>
                <Button
                  variant={paymentMethod === 'partial' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('partial')}
                  className="h-16 flex flex-col items-center justify-center p-2"
                >
                  <span className="text-lg mb-1">📊</span>
                  <span className="text-xs">Partial</span>
                </Button>
                <Button
                  variant={paymentMethod === 'deferred' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('deferred')}
                  className="h-16 flex flex-col items-center justify-center p-2"
                >
                  <span className="text-lg mb-1">⏰</span>
                  <span className="text-xs">Pay Later</span>
                </Button>
              </div>
            </div>

        <div className="pt-4 border-t">
          {paymentMethod === 'card' && (
            <>
              {!stripePromise && (
                <div className="p-4 text-amber-600 bg-amber-50 rounded-md mb-4">
                  <p className="font-medium">Credit Card Payment Unavailable</p>
                  <p className="text-sm">Stripe is not configured. Please use cash, check, or other payment methods.</p>
                </div>
              )}

              {stripePromise && clientSecret ? (
                <Elements 
                  stripe={stripePromise} 
                  options={{ clientSecret, appearance: { theme: 'stripe' } }}
                >
                  <CardPaymentForm 
                    clientSecret={clientSecret} 
                    onSuccess={handleCardPaymentSuccess} 
                  />
                </Elements>
              ) : stripePromise && (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </>
          )}

          {paymentMethod === 'cash' && (
            <CashPaymentForm 
              total={Number(orderGroup.total)} 
              onSubmit={handleCashPayment} 
            />
          )}

          {paymentMethod === 'check' && (
            <CheckPaymentForm 
              total={Number(orderGroup.total)} 
              onSubmit={handleCheckPayment} 
            />
          )}

          {paymentMethod === 'partial' && (
            <div className="space-y-4">
              <h4 className="font-medium">Partial Payment</h4>
              <div className="p-4 bg-muted rounded-md">
                <div className="flex justify-between font-semibold">
                  <span>Total Due:</span>
                  <span>{formatCurrency(Number(orderGroup.total))}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  This will mark the order as partially paid. Remaining balance can be collected later.
                </p>
              </div>
              <Button 
                onClick={() => processPaymentMutation.mutate({ method: 'partial' })}
                disabled={processPaymentMutation.isPending}
                className="w-full"
              >
                {processPaymentMutation.isPending ? 'Processing...' : 'Mark as Partial Payment'}
              </Button>
            </div>
          )}

          {paymentMethod === 'deferred' && (
            <div className="space-y-4">
              <h4 className="font-medium">Pay Later</h4>
              <div className="p-4 bg-muted rounded-md">
                <div className="flex justify-between font-semibold">
                  <span>Total Due:</span>
                  <span>{formatCurrency(Number(orderGroup.total))}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  This will save the order and allow payment to be collected later.
                </p>
              </div>
              <Button 
                onClick={() => processPaymentMutation.mutate({ method: 'deferred' })}
                disabled={processPaymentMutation.isPending}
                className="w-full"
              >
                {processPaymentMutation.isPending ? 'Processing...' : 'Save Order for Later Payment'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutPayment;