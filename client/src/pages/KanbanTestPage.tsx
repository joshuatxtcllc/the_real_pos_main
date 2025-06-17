import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { Link2, TestTube, RefreshCw, CheckCircle, XCircle, Info } from 'lucide-react';

interface KanbanStatus {
  configured: boolean;
  apiUrl: string;
  hasApiKey: boolean;
  endpoints: {
    orders: string;
    statusUpdate: string;
  };
}

interface Order {
  id: number;
  customerId: number;
  productionStatus: string;
  artworkDescription: string;
  artworkWidth: string;
  artworkHeight: string;
}

export default function KanbanTestPage() {
  const { toast } = useToast();
  const [kanbanStatus, setKanbanStatus] = useState<KanbanStatus | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [testStatus, setTestStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchKanbanStatus();
    fetchOrders();
  }, []);

  const fetchKanbanStatus = async () => {
    try {
      const response = await fetch('/api/kanban/status');
      const data = await response.json();
      if (data.success) {
        setKanbanStatus(data.status);
      }
    } catch (error) {
      console.error('Error fetching Kanban status:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const testOrderSync = async () => {
    if (!selectedOrderId) {
      toast({
        title: 'Order Required',
        description: 'Please select an order to test synchronization.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    setTestStatus('');

    try {
      const response = await fetch(`/api/orders/${selectedOrderId}/test-kanban-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setTestStatus('success');
        toast({
          title: 'Sync Successful',
          description: `Order ${selectedOrderId} synced to Kanban successfully`,
        });
      } else {
        setTestStatus('error');
        toast({
          title: 'Sync Failed',
          description: data.error || 'Failed to sync order to Kanban',
          variant: 'destructive'
        });
      }
    } catch (error) {
      setTestStatus('error');
      toast({
        title: 'Sync Error',
        description: 'Network error occurred during sync test',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          notes: `Status updated via Kanban test interface to ${newStatus}`
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Status Updated',
          description: `Order ${orderId} status updated to ${newStatus} and synced to Kanban`,
        });
        fetchOrders(); // Refresh orders list
      } else {
        toast({
          title: 'Update Failed',
          description: data.error || 'Failed to update order status',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Update Error',
        description: 'Failed to update order status',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-2">
        <Link2 className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Kanban Integration Test</h1>
      </div>

      {/* Kanban Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Kanban Connection Status
          </CardTitle>
          <CardDescription>
            Current status of the Kanban app integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {kanbanStatus ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Connection Status</Label>
                <Badge variant={kanbanStatus.configured ? "default" : "destructive"}>
                  {kanbanStatus.configured ? "Configured" : "Not Configured"}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label>API Key Status</Label>
                <Badge variant={kanbanStatus.hasApiKey ? "default" : "destructive"}>
                  {kanbanStatus.hasApiKey ? "Present" : "Missing"}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label>API URL</Label>
                <p className="text-sm text-muted-foreground font-mono">
                  {kanbanStatus.apiUrl || 'Not configured'}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Orders Endpoint</Label>
                <p className="text-sm text-muted-foreground font-mono">
                  {kanbanStatus.endpoints?.orders || 'Not available'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Loading Kanban status...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Sync Test Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test Order Synchronization
          </CardTitle>
          <CardDescription>
            Test syncing a specific order to the Kanban app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="order-select">Select Order to Test</Label>
            <select
              id="order-select"
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Choose an order...</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  Order #{order.id} - {order.artworkDescription} ({order.productionStatus})
                </option>
              ))}
            </select>
          </div>

          <Button 
            onClick={testOrderSync}
            disabled={!selectedOrderId || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testing Sync...
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4 mr-2" />
                Test Order Sync
              </>
            )}
          </Button>

          {testStatus && (
            <Alert>
              {testStatus === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {testStatus === 'success' ? 'Sync Successful' : 'Sync Failed'}
              </AlertTitle>
              <AlertDescription>
                {testStatus === 'success' 
                  ? 'Order has been successfully synced to the Kanban app.'
                  : 'Failed to sync order to Kanban app. Check the connection settings.'
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Order Status Update Test */}
      <Card>
        <CardHeader>
          <CardTitle>Test Status Updates</CardTitle>
          <CardDescription>
            Update order status and test Kanban synchronization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.artworkDescription} - {order.artworkWidth}x{order.artworkHeight}
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {order.productionStatus}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateOrderStatus(order.id.toString(), 'in_production')}
                  >
                    Set In Production
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateOrderStatus(order.id.toString(), 'completed')}
                  >
                    Set Completed
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}