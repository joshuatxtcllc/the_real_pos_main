import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

export default function PaymentStatus() {
  const [, setLocation] = useLocation();
  
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success') === 'true';
  const orderId = urlParams.get('orderId');

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      setLocation('/orders');
    }, 5000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {success ? (
              <CheckCircle className="w-16 h-16 text-green-600" />
            ) : (
              <XCircle className="w-16 h-16 text-red-600" />
            )}
          </div>
          <CardTitle className={success ? 'text-green-600' : 'text-red-600'}>
            {success ? 'Payment Successful!' : 'Payment Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            {success 
              ? `Your payment has been processed successfully${orderId ? ` for Order #${orderId}` : ''}.`
              : 'There was an issue processing your payment. Please try again.'
            }
          </p>
          
          <div className="space-y-2">
            <Button 
              onClick={() => setLocation('/orders')}
              className="w-full"
            >
              View Orders
            </Button>
            
            {!success && (
              <Button 
                variant="outline"
                onClick={() => window.history.back()}
                className="w-full"
              >
                Try Again
              </Button>
            )}
          </div>
          
          <p className="text-xs text-gray-500">
            You will be redirected to orders in 5 seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}