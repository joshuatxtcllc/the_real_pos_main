import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Order {
  id: number;
  customerId: number;
  total: string;
  status: string;
  artworkDescription: string;
}

export default function PaymentLinkManager() {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string>('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch customers
  const { data: customers } = useQuery({
    queryKey: ['/api/customers'],
  });

  // Fetch orders
  const { data: ordersData } = useQuery({
    queryKey: ['/api/orders'],
  });

  const orders = Array.isArray((ordersData as any)?.orders) ? (ordersData as any).orders : [];

  // Create payment link mutation
  const createPaymentLinkMutation = useMutation({
    mutationFn: async (data: {
      amount: number;
      description: string;
      customerEmail?: string;
      orderId?: number;
    }) => {
      const response = await apiRequest('POST', '/api/create-payment-link', data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedLink(data.paymentLink);
      toast({
        title: "Payment Link Created",
        description: "Payment link has been generated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create payment link",
        variant: "destructive",
      });
    },
  });

  const handleCreatePaymentLink = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const selectedCustomer = customers?.find((c: Customer) => c.id === selectedCustomerId);
    
    createPaymentLinkMutation.mutate({
      amount: parseFloat(amount),
      description: description || `Payment Request - $${amount}`,
      customerEmail: selectedCustomer?.email,
      orderId: selectedOrderId || undefined,
    });
  };

  const handleOrderSelection = (orderId: number) => {
    const order = Array.isArray(orders) ? orders.find((o: Order) => o.id === orderId) : null;
    if (order) {
      setSelectedOrderId(orderId);
      setSelectedCustomerId(order.customerId);
      setAmount(order.total);
      setDescription(`Payment for Order #${orderId} - ${order.artworkDescription}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "Copied",
      description: "Payment link copied to clipboard",
    });
  };

  const sendViaEmail = () => {
    const customersArray = Array.isArray(customers) ? customers : [];
    const selectedCustomer = customersArray.find((c: Customer) => c.id === selectedCustomerId) || null;
    if (selectedCustomer?.email && generatedLink) {
      const subject = encodeURIComponent(`Payment Request - ${description}`);
      const body = encodeURIComponent(`Hi ${selectedCustomer.name},\n\nPlease use the following link to complete your payment:\n\n${generatedLink}\n\nAmount: $${amount}\nDescription: ${description}\n\nThank you!`);
      window.open(`mailto:${selectedCustomer.email}?subject=${subject}&body=${body}`);
      
      toast({
        title: "Email Client Opened",
        description: "Email template opened in your default email client",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Payment Link Manager</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Create Payment Link Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Payment Link</CardTitle>
            <CardDescription>
              Generate a secure payment link to send to customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Order Selection */}
            <div>
              <Label htmlFor="orderSelect">Quick Select from Orders</Label>
              <select
                id="orderSelect"
                className="w-full mt-1 p-2 border rounded-md"
                value={selectedOrderId || ''}
                onChange={(e) => e.target.value && handleOrderSelection(parseInt(e.target.value))}
              >
                <option value="">Select an order...</option>
                {Array.isArray(orders) && orders.map((order: Order) => {
                  const customer = Array.isArray(customers) ? customers.find((c: Customer) => c.id === order.customerId) : null;
                  return (
                    <option key={order.id} value={order.id}>
                      Order #{order.id} - {customer?.name || 'Unknown Customer'} - ${order.total}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="border-t pt-4">
              <Label htmlFor="customerSelect">Customer</Label>
              <select
                id="customerSelect"
                className="w-full mt-1 p-2 border rounded-md"
                value={selectedCustomerId || ''}
                onChange={(e) => setSelectedCustomerId(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">Select customer...</option>
                {Array.isArray(customers) && customers.map((customer: Customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Payment for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleCreatePaymentLink}
              disabled={createPaymentLinkMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {createPaymentLinkMutation.isPending ? "Creating..." : "Create Payment Link"}
            </Button>
          </CardFooter>
        </Card>

        {/* Generated Link Display */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Payment Link</CardTitle>
            <CardDescription>
              Share this link with your customer for secure payment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedLink ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-md break-all">
                  <a 
                    href={generatedLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {generatedLink}
                  </a>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={copyToClipboard}
                    variant="outline"
                    className="flex-1"
                  >
                    📋 Copy Link
                  </Button>
                  
                  {selectedCustomerId && (
                    <Button 
                      onClick={sendViaEmail}
                      variant="outline"
                      className="flex-1"
                    >
                      📧 Send Email
                    </Button>
                  )}
                </div>

                {amount && (
                  <div className="text-center p-4 bg-green-50 rounded-md">
                    <p className="text-lg font-semibold text-green-800">
                      Amount: {formatCurrency(parseFloat(amount))}
                    </p>
                    {description && (
                      <p className="text-sm text-green-600 mt-1">
                        {description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Create a payment link to see it here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};