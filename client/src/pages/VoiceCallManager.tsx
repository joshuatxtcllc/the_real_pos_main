import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Phone, PhoneCall, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface CallLog {
  id: string;
  to: string;
  callSid: string;
  type: string;
  status: string;
  timestamp: string;
  message?: string;
}

export default function VoiceCallManager() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [voice, setVoice] = useState('alice');
  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [daysWaiting, setDaysWaiting] = useState('');
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if voice calling is configured
  const { data: configStatus, isLoading: configLoading } = useQuery({
    queryKey: ['/api/voice-calls/configuration'],
    queryFn: () => apiRequest('/api/voice-calls/configuration')
  });

  // Make custom voice call
  const makeCustomCall = useMutation({
    mutationFn: (data: { to: string; message: string; voice?: string }) =>
      apiRequest('/api/voice-calls/make-call', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: (data) => {
      toast({
        title: "Call Initiated",
        description: `Voice call to ${phoneNumber} started successfully`,
      });
      addToCallLog('custom', phoneNumber, data.callSid, 'initiated');
      setPhoneNumber('');
      setCustomMessage('');
    },
    onError: (error: any) => {
      toast({
        title: "Call Failed",
        description: error.message || "Failed to initiate voice call",
        variant: "destructive"
      });
    }
  });

  // Order status call
  const orderStatusCall = useMutation({
    mutationFn: (data: { to: string; orderNumber: string; status: string; estimatedCompletion?: string }) =>
      apiRequest('/api/voice-calls/order-status', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: (data) => {
      toast({
        title: "Order Status Call Initiated",
        description: `Called customer about order ${orderNumber}`,
      });
      addToCallLog('order-status', phoneNumber, data.callSid, 'initiated');
    },
    onError: (error: any) => {
      toast({
        title: "Call Failed",
        description: error.message || "Failed to make order status call",
        variant: "destructive"
      });
    }
  });

  // Payment reminder call
  const paymentReminderCall = useMutation({
    mutationFn: (data: { to: string; customerName: string; amount: number; orderNumber: string; dueDate?: string }) =>
      apiRequest('/api/voice-calls/payment-reminder', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: (data) => {
      toast({
        title: "Payment Reminder Call Initiated",
        description: `Called ${customerName} about payment`,
      });
      addToCallLog('payment-reminder', phoneNumber, data.callSid, 'initiated');
    },
    onError: (error: any) => {
      toast({
        title: "Call Failed",
        description: error.message || "Failed to make payment reminder call",
        variant: "destructive"
      });
    }
  });

  // Pickup reminder call
  const pickupReminderCall = useMutation({
    mutationFn: (data: { to: string; customerName: string; orderNumber: string; daysWaiting: number }) =>
      apiRequest('/api/voice-calls/pickup-reminder', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: (data) => {
      toast({
        title: "Pickup Reminder Call Initiated",
        description: `Called ${customerName} about pickup`,
      });
      addToCallLog('pickup-reminder', phoneNumber, data.callSid, 'initiated');
    },
    onError: (error: any) => {
      toast({
        title: "Call Failed",
        description: error.message || "Failed to make pickup reminder call",
        variant: "destructive"
      });
    }
  });

  // Order complete call
  const orderCompleteCall = useMutation({
    mutationFn: (data: { to: string; customerName: string; orderNumber: string }) =>
      apiRequest('/api/voice-calls/order-complete', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: (data) => {
      toast({
        title: "Order Complete Call Initiated",
        description: `Called ${customerName} about order completion`,
      });
      addToCallLog('order-complete', phoneNumber, data.callSid, 'initiated');
    },
    onError: (error: any) => {
      toast({
        title: "Call Failed",
        description: error.message || "Failed to make order complete call",
        variant: "destructive"
      });
    }
  });

  const addToCallLog = (type: string, phone: string, callSid: string, status: string) => {
    const newLog: CallLog = {
      id: Date.now().toString(),
      to: phone,
      callSid,
      type,
      status,
      timestamp: new Date().toISOString()
    };
    setCallLogs(prev => [newLog, ...prev.slice(0, 9)]);
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    return phone.startsWith('+') ? phone : `+${cleaned}`;
  };

  const handleCustomCall = () => {
    if (!phoneNumber || !customMessage) {
      toast({
        title: "Missing Information",
        description: "Please enter both phone number and message",
        variant: "destructive"
      });
      return;
    }

    makeCustomCall.mutate({
      to: formatPhoneNumber(phoneNumber),
      message: customMessage,
      voice
    });
  };

  const handleOrderStatusCall = () => {
    if (!phoneNumber || !orderNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter phone number and order number",
        variant: "destructive"
      });
      return;
    }

    orderStatusCall.mutate({
      to: formatPhoneNumber(phoneNumber),
      orderNumber,
      status: 'ready for pickup'
    });
  };

  const handlePaymentReminder = () => {
    if (!phoneNumber || !customerName || !amount || !orderNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all payment reminder fields",
        variant: "destructive"
      });
      return;
    }

    paymentReminderCall.mutate({
      to: formatPhoneNumber(phoneNumber),
      customerName,
      amount: parseFloat(amount),
      orderNumber
    });
  };

  const handlePickupReminder = () => {
    if (!phoneNumber || !customerName || !orderNumber || !daysWaiting) {
      toast({
        title: "Missing Information",
        description: "Please fill in all pickup reminder fields",
        variant: "destructive"
      });
      return;
    }

    pickupReminderCall.mutate({
      to: formatPhoneNumber(phoneNumber),
      customerName,
      orderNumber,
      daysWaiting: parseInt(daysWaiting)
    });
  };

  const handleOrderComplete = () => {
    if (!phoneNumber || !customerName || !orderNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all order complete fields",
        variant: "destructive"
      });
      return;
    }

    orderCompleteCall.mutate({
      to: formatPhoneNumber(phoneNumber),
      customerName,
      orderNumber
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'initiated':
      case 'queued':
      case 'ringing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in-progress':
        return <PhoneCall className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
      case 'busy':
      case 'no-answer':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'failed':
      case 'busy':
      case 'no-answer':
        return 'destructive';
      case 'initiated':
      case 'queued':
      case 'ringing':
      case 'in-progress':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (configLoading) {
    return <div className="p-4">Loading voice call configuration...</div>;
  }

  if (!configStatus?.configured) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Voice Call System
            </CardTitle>
            <CardDescription>
              Twilio voice calling is not configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-yellow-50">
                <p className="text-sm text-yellow-800">
                  {configStatus?.message || 'Voice calling requires Twilio credentials to be configured.'}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Contact your administrator to set up Twilio credentials for voice calling functionality.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Voice Call Manager</h1>
          <p className="text-gray-600">Make automated voice calls to customers</p>
        </div>
        <Badge variant="default" className="bg-green-100 text-green-800">
          <Phone className="h-3 w-3 mr-1" />
          Twilio Connected
        </Badge>
      </div>

      <Tabs defaultValue="custom" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="custom">Custom Call</TabsTrigger>
          <TabsTrigger value="order-status">Order Status</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="pickup">Pickup</TabsTrigger>
          <TabsTrigger value="complete">Order Complete</TabsTrigger>
        </TabsList>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Voice Call</CardTitle>
              <CardDescription>Make a personalized voice call with your own message</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="voice">Voice</Label>
                  <Select value={voice} onValueChange={setVoice}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alice">Alice (Default)</SelectItem>
                      <SelectItem value="man">Man</SelectItem>
                      <SelectItem value="woman">Woman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your custom message here..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                />
              </div>
              <Button 
                onClick={handleCustomCall} 
                disabled={makeCustomCall.isPending}
                className="w-full"
              >
                <Phone className="h-4 w-4 mr-2" />
                {makeCustomCall.isPending ? 'Making Call...' : 'Make Voice Call'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="order-status">
          <Card>
            <CardHeader>
              <CardTitle>Order Status Update Call</CardTitle>
              <CardDescription>Call customer with order status update</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone-order">Phone Number</Label>
                  <Input
                    id="phone-order"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="order-number">Order Number</Label>
                  <Input
                    id="order-number"
                    placeholder="ORD-001"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handleOrderStatusCall} 
                disabled={orderStatusCall.isPending}
                className="w-full"
              >
                <Phone className="h-4 w-4 mr-2" />
                {orderStatusCall.isPending ? 'Making Call...' : 'Call Order Status'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Reminder Call</CardTitle>
              <CardDescription>Call customer about outstanding payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone-payment">Phone Number</Label>
                  <Input
                    id="phone-payment"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="customer-name">Customer Name</Label>
                  <Input
                    id="customer-name"
                    placeholder="John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount Due</Label>
                  <Input
                    id="amount"
                    placeholder="125.00"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="order-number-payment">Order Number</Label>
                  <Input
                    id="order-number-payment"
                    placeholder="ORD-001"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handlePaymentReminder} 
                disabled={paymentReminderCall.isPending}
                className="w-full"
              >
                <Phone className="h-4 w-4 mr-2" />
                {paymentReminderCall.isPending ? 'Making Call...' : 'Call Payment Reminder'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pickup">
          <Card>
            <CardHeader>
              <CardTitle>Pickup Reminder Call</CardTitle>
              <CardDescription>Call customer about ready order pickup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone-pickup">Phone Number</Label>
                  <Input
                    id="phone-pickup"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="customer-name-pickup">Customer Name</Label>
                  <Input
                    id="customer-name-pickup"
                    placeholder="John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="order-number-pickup">Order Number</Label>
                  <Input
                    id="order-number-pickup"
                    placeholder="ORD-001"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="days-waiting">Days Waiting</Label>
                  <Input
                    id="days-waiting"
                    placeholder="3"
                    type="number"
                    value={daysWaiting}
                    onChange={(e) => setDaysWaiting(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handlePickupReminder} 
                disabled={pickupReminderCall.isPending}
                className="w-full"
              >
                <Phone className="h-4 w-4 mr-2" />
                {pickupReminderCall.isPending ? 'Making Call...' : 'Call Pickup Reminder'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complete">
          <Card>
            <CardHeader>
              <CardTitle>Order Complete Call</CardTitle>
              <CardDescription>Call customer when order is ready for pickup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone-complete">Phone Number</Label>
                  <Input
                    id="phone-complete"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="customer-name-complete">Customer Name</Label>
                  <Input
                    id="customer-name-complete"
                    placeholder="John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="order-number-complete">Order Number</Label>
                  <Input
                    id="order-number-complete"
                    placeholder="ORD-001"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handleOrderComplete} 
                disabled={orderCompleteCall.isPending}
                className="w-full"
              >
                <Phone className="h-4 w-4 mr-2" />
                {orderCompleteCall.isPending ? 'Making Call...' : 'Call Order Complete'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {callLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Call Log</CardTitle>
            <CardDescription>Last 10 voice calls made</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {callLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(log.status)}
                    <div>
                      <p className="font-medium">{log.to}</p>
                      <p className="text-sm text-gray-600 capitalize">{log.type.replace('-', ' ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusBadgeVariant(log.status)}>
                      {log.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}