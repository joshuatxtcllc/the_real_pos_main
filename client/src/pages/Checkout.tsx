import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ amount, orderId, description }: { amount: number; orderId?: string; description?: string }) => {
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
        return_url: `${window.location.origin}/payment-status?success=true&orderId=${orderId}`,
      },
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase!",
      });
      // Redirect will happen automatically via return_url
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
        {description && <p className="text-sm text-gray-600">{description}</p>}
        <p className="text-lg font-semibold">${amount.toFixed(2)}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />
          <Button 
            type="submit" 
            disabled={!stripe || isProcessing}
            className="w-full"
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
  const [, setLocation] = useLocation();
  
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const amount = parseFloat(urlParams.get('amount') || '0');
  const orderId = urlParams.get('orderId') || undefined;
  const description = urlParams.get('description') || undefined;

  useEffect(() => {
    if (amount <= 0) {
      setLocation('/orders');
      return;
    }

    // Create PaymentIntent for the specific amount
    apiRequest("POST", "/api/create-payment-intent", { amount })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error('Payment intent creation failed:', error);
        setLocation('/orders');
      });
  }, [amount, setLocation]);

  if (amount <= 0) {
    return (
      <div className="text-center py-8">
        <p>Invalid payment amount. Redirecting...</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <div className="container mx-auto py-8">
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm amount={amount} orderId={orderId} description={description} />
      </Elements>
    </div>
  );
};