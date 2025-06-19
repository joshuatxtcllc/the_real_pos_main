import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'wouter';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ amount, orderId }: { amount: number, orderId?: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your payment!",
      });
      // Redirect to orders page
      setLocation('/orders');
    }

    setIsProcessing(false);
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <p className="text-lg font-semibold">Amount: ${amount.toFixed(2)}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />
          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={!stripe || !elements || isProcessing}
          >
            {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);
  const [orderId, setOrderId] = useState<string>("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Get order details from URL or local storage
    const urlParams = new URLSearchParams(window.location.search);
    const orderGroupId = urlParams.get('orderGroupId');
    const orderAmount = urlParams.get('amount');
    const orderIdParam = urlParams.get('orderId');

    if (orderAmount) {
      setAmount(parseFloat(orderAmount));
    }
    if (orderIdParam) {
      setOrderId(orderIdParam);
    }

    // Create PaymentIntent
    const createPaymentIntent = async () => {
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", { 
          amount: orderAmount ? parseFloat(orderAmount) : 100,
          orderId: orderIdParam,
          orderGroupId: orderGroupId
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        // Fallback to orders page if payment setup fails
        setLocation('/orders');
      }
    };

    createPaymentIntent();
  }, [setLocation]);

  if (!clientSecret) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p>Setting up payment...</p>
        </div>
      </div>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 text-center">
        <Button 
          variant="outline" 
          onClick={() => setLocation('/orders')}
          className="mb-4"
        >
          ← Back to Orders
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>
      
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm amount={amount} orderId={orderId} />
      </Elements>
    </div>
  );
};