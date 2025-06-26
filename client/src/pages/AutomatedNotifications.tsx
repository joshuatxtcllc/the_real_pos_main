import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bell, Phone, CheckCircle, XCircle, Clock, AlertCircle, Play, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationEvent {
  type: string;
  description: string;
  example: string;
}

export default function AutomatedNotifications() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [eventType, setEventType] = useState('');
  const [customerName, setCustomerName] = useState('Test Customer');
  const [orderNumber, setOrderNumber] = useState('AUTO-001');
  const [amount, setAmount] = useState('125.50');
  const [daysWaiting, setDaysWaiting] = useState('3');
  const [delayMinutes, setDelayMinutes] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get notification system status
  const { data: systemStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/order-notifications/status'],
    queryFn: async () => {
      const response = await fetch('/api/order-notifications/status');
      if (!response.ok) {
        throw new Error('Failed to fetch notification status');
      }
      return response.json();
    }
  });

  // Trigger immediate notification
  const triggerNotification = useMutation({
    mutationFn: async (notificationData: any) => {
      const response = await fetch('/api/order-notifications/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      });
      if (!response.ok) {
        throw new Error('Failed to trigger notification');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Notification Sent",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Notification Failed",
        description: error.message || "Failed to send notification",
        variant: "destructive"
      });
    }
  });

  // Schedule delayed notification
  const scheduleNotification = useMutation({
    mutationFn: async (notificationData: any) => {
      const response = await fetch('/api/order-notifications/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      });
      if (!response.ok) {
        throw new Error('Failed to schedule notification');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Notification Scheduled",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Scheduling Failed",
        description: error.message || "Failed to schedule notification",
        variant: "destructive"
      });
    }
  });

  // Test notification
  const testNotification = useMutation({
    mutationFn: async (testData: any) => {
      const response = await fetch('/api/order-notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      if (!response.ok) {
        throw new Error('Failed to send test notification');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Test Notification Sent",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Test Failed",
        description: error.message || "Failed to send test notification",
        variant: "destructive"
      });
    }
  });

  const handleTriggerNotification = () => {
    if (!phoneNumber || !eventType) {
      toast({
        title: "Missing Information",
        description: "Please fill in phone number and select event type",
        variant: "destructive"
      });
      return;
    }

    const notificationData = {
      orderId: 'AUTO-001',
      orderNumber,
      customerName,
      customerPhone: phoneNumber,
      eventType,
      metadata: {
        amount: parseFloat(amount),
        daysWaiting: parseInt(daysWaiting),
        dueDate: 'Friday',
        estimatedCompletion: '2-3 business days'
      }
    };

    triggerNotification.mutate(notificationData);
  };

  const handleScheduleNotification = () => {
    if (!phoneNumber || !eventType || !delayMinutes) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields for scheduling",
        variant: "destructive"
      });
      return;
    }

    const notificationData = {
      orderId: 'AUTO-001',
      orderNumber,
      customerName,
      customerPhone: phoneNumber,
      eventType,
      delayMinutes: parseInt(delayMinutes),
      metadata: {
        amount: parseFloat(amount),
        daysWaiting: parseInt(daysWaiting),
        dueDate: 'Friday',
        estimatedCompletion: '2-3 business days'
      }
    };

    scheduleNotification.mutate(notificationData);
  };

  const handleTestNotification = () => {
    if (!phoneNumber) {
      toast({
        title: "Missing Phone Number",
        description: "Please enter a phone number for testing",
        variant: "destructive"
      });
      return;
    }

    testNotification.mutate({
      phone: phoneNumber,
      eventType: eventType || 'ready_for_pickup'
    });
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    return phone.startsWith('+') ? phone : `+${cleaned}`;
  };

  const getStatusIcon = () => {
    if (statusLoading) return <Clock className="h-5 w-5 text-yellow-500" />;
    if (systemStatus?.configured) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusText = () => {
    if (statusLoading) return 'Checking status...';
    if (systemStatus?.configured) return 'System Ready';
    return 'Configuration Required';
  };

  if (statusLoading) {
    return <div className="p-4">Loading automated notification system...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Automated Order Notifications
          </h1>
          <p className="text-muted-foreground mt-2">
            Set up voice calls for order events like completion, payment reminders, and pickup notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="font-medium">{getStatusText()}</span>
        </div>
      </div>

      <Tabs defaultValue="trigger" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trigger">Trigger Now</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Later</TabsTrigger>
          <TabsTrigger value="events">Event Types</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="trigger" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Trigger Immediate Notification
              </CardTitle>
              <CardDescription>
                Send a voice call notification immediately for testing or urgent notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type</Label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {systemStatus?.supportedEventTypes?.map((event: NotificationEvent) => (
                        <SelectItem key={event.type} value={event.type}>
                          {event.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Order Number</Label>
                  <Input
                    id="orderNumber"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (for payment reminders)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="daysWaiting">Days Waiting (for pickup reminders)</Label>
                  <Input
                    id="daysWaiting"
                    type="number"
                    value={daysWaiting}
                    onChange={(e) => setDaysWaiting(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleTriggerNotification}
                  disabled={triggerNotification.isPending}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  {triggerNotification.isPending ? 'Sending...' : 'Send Notification'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleTestNotification}
                  disabled={testNotification.isPending}
                >
                  {testNotification.isPending ? 'Testing...' : 'Quick Test'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Schedule Delayed Notification
              </CardTitle>
              <CardDescription>
                Schedule notifications for future delivery (useful for pickup reminders, follow-ups)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="delayMinutes">Delay (minutes)</Label>
                <Input
                  id="delayMinutes"
                  type="number"
                  placeholder="5"
                  value={delayMinutes}
                  onChange={(e) => setDelayMinutes(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleScheduleNotification}
                disabled={scheduleNotification.isPending}
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                {scheduleNotification.isPending ? 'Scheduling...' : 'Schedule Notification'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supported Event Types</CardTitle>
              <CardDescription>
                These events can trigger automated voice notifications to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {systemStatus?.supportedEventTypes?.map((event: NotificationEvent) => (
                  <div key={event.type} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{event.description}</h3>
                      <p className="text-sm text-muted-foreground">{event.example}</p>
                    </div>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Integration Guide
              </CardTitle>
              <CardDescription>
                How to integrate automated notifications into your order workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">API Endpoints</h3>
                  <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                    <div>POST /api/order-notifications/trigger</div>
                    <div>POST /api/order-notifications/schedule</div>
                    <div>POST /api/order-notifications/bulk</div>
                    <div>GET /api/order-notifications/status</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Example Integration</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Add this to your order status update functions:
                  </p>
                  <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                    {`// When order status changes to "ready_for_pickup"
await fetch('/api/order-notifications/trigger', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    eventType: 'ready_for_pickup'
  })
});`}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Automated Workflows</h3>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Order confirmation calls when orders are placed</li>
                    <li>• Payment confirmation when payments are received</li>
                    <li>• Progress updates during production phases</li>
                    <li>• Pickup notifications when orders are complete</li>
                    <li>• Payment reminders for outstanding balances</li>
                    <li>• Pickup reminders for completed orders</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {phoneNumber && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Phone number: <Badge variant="outline">{formatPhoneNumber(phoneNumber)}</Badge>
            </p>
            {eventType && (
              <p className="text-sm mt-2">
                Selected event: <Badge>{systemStatus?.supportedEventTypes?.find((e: NotificationEvent) => e.type === eventType)?.description}</Badge>
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}