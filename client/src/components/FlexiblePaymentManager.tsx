
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, CreditCard, Clock, CheckCircle } from 'lucide-react';

interface FlexiblePaymentManagerProps {
  orderGroup: {
    id: number;
    total: string;
    amountPaid?: string;
    balanceDue?: string;
    paymentStatus?: string;
    depositAmount?: string;
  };
  onPaymentUpdate?: () => void;
}

export function FlexiblePaymentManager({ orderGroup, onPaymentUpdate }: FlexiblePaymentManagerProps) {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [deferPayment, setDeferPayment] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const recordPaymentMutation = useMutation({
    mutationFn: async (data: { amount: string; paymentMethod: string; notes?: string }) => {
      const response = await apiRequest('POST', `/api/invoices/${orderGroup.id}/record-payment`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Payment Recorded',
        description: 'Payment has been successfully recorded.',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/order-groups/${orderGroup.id}`] });
      if (onPaymentUpdate) onPaymentUpdate();
      setPaymentAmount('');
      setPaymentNotes('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to record payment.',
        variant: 'destructive',
      });
    },
  });

  const setPaymentTermsMutation = useMutation({
    mutationFn: async (data: { paymentTerms?: string; depositAmount?: string; deferPayment?: boolean }) => {
      const response = await apiRequest('PATCH', `/api/invoices/${orderGroup.id}/payment-terms`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Payment Terms Set',
        description: 'Payment terms have been successfully updated.',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/order-groups/${orderGroup.id}`] });
      if (onPaymentUpdate) onPaymentUpdate();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to set payment terms.',
        variant: 'destructive',
      });
    },
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid payment amount.',
        variant: 'destructive',
      });
      return;
    }

    recordPaymentMutation.mutate({
      amount: paymentAmount,
      paymentMethod,
      notes: paymentNotes,
    });
  };

  const handleSetPaymentTerms = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentTermsMutation.mutate({
      paymentTerms,
      depositAmount: depositAmount || undefined,
      deferPayment,
    });
  };

  const getPaymentStatusBadge = () => {
    switch (orderGroup.paymentStatus) {
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case 'partial':
        return <Badge variant="secondary"><CreditCard className="w-3 h-3 mr-1" />Partial</Badge>;
      case 'deferred':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Deferred</Badge>;
      default:
        return <Badge variant="destructive"><DollarSign className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Payment Management
          {getPaymentStatusBadge()}
        </CardTitle>
        <CardDescription>
          Manage flexible payment options for this order
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Payment Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{formatCurrency(parseFloat(orderGroup.total))}</div>
            <div className="text-sm text-gray-600">Total Amount</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(parseFloat(orderGroup.amountPaid || '0'))}
            </div>
            <div className="text-sm text-gray-600">Amount Paid</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(parseFloat(orderGroup.balanceDue || orderGroup.total))}
            </div>
            <div className="text-sm text-gray-600">Balance Due</div>
          </div>
        </div>

        <Tabs defaultValue="record-payment" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="record-payment">Record Payment</TabsTrigger>
            <TabsTrigger value="payment-terms">Set Payment Terms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="record-payment" className="space-y-4">
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-amount">Payment Amount</Label>
                  <Input
                    id="payment-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment-notes">Payment Notes (Optional)</Label>
                <Textarea
                  id="payment-notes"
                  placeholder="Add any notes about this payment..."
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={recordPaymentMutation.isPending}
                className="w-full"
              >
                {recordPaymentMutation.isPending ? 'Recording...' : 'Record Payment'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="payment-terms" className="space-y-4">
            <form onSubmit={handleSetPaymentTerms} className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="defer-payment"
                    checked={deferPayment}
                    onChange={(e) => setDeferPayment(e.target.checked)}
                  />
                  <Label htmlFor="defer-payment">Defer payment until job completion</Label>
                </div>
                
                {!deferPayment && (
                  <div className="space-y-2">
                    <Label htmlFor="deposit-amount">Required Deposit Amount (Optional)</Label>
                    <Input
                      id="deposit-amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="payment-terms">Payment Terms</Label>
                  <Textarea
                    id="payment-terms"
                    placeholder="e.g., 50% deposit required, balance due upon completion..."
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={setPaymentTermsMutation.isPending}
                className="w-full"
              >
                {setPaymentTermsMutation.isPending ? 'Updating...' : 'Set Payment Terms'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
