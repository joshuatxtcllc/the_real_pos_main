import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { apiRequest } from '../lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  subtotal: string;
  status: string;
  artworkDescription: string;
  frameId?: number;
  matColorId?: number;
  glassOptionId?: number;
  orderGroupId?: number;
  quantity?: number;
}

interface OrderGroup {
  id: number;
  customerId: number;
  total: string;
  status: string;
}

export default function Orders() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isWholesaleDialogOpen, setIsWholesaleDialogOpen] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<Order | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch orders
  const { data: ordersData, isLoading: ordersLoading, isError: ordersError } = useQuery({
    queryKey: ['/api/orders'],
  });

  // Fetch customers
  const { data: customers } = useQuery({
    queryKey: ['/api/customers'],
  });

  // Fetch order groups
  const { data: orderGroupsData } = useQuery({
    queryKey: ['/api/order-groups'],
  });

  const orders = (ordersData as any)?.orders || [];
  const orderGroups = (orderGroupsData as any)?.orderGroups || [];

  // Helper function to get customer name
  const getCustomerName = (customerId: number) => {
    const customer = customers?.find((c: Customer) => c.id === customerId);
    return customer ? customer.name : `Customer ${customerId}`;
  };

  // Filter orders based on search term
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    return orders.filter((order: Order) => 
      getCustomerName(order.customerId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.artworkDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm)
    );
  }, [orders, searchTerm, customers]);

  // Send update mutation
  const sendUpdateMutation = useMutation({
    mutationFn: async (order: Order) => {
      const response = await apiRequest('POST', '/api/send-update', {
        orderId: order.id,
        customerId: order.customerId,
        message: `Order #${order.id} update: Your order is ready for payment.`,
        includeQR: true
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Update Sent",
        description: "Customer notification sent successfully",
      });
      setSelectedOrderForPayment(null);
    },
    onError: (error: any) => {
      toast({
        title: "Send Failed",
        description: error.message || "Failed to send customer update",
        variant: "destructive",
      });
    },
  });

  const handleSendUpdate = (order: Order) => {
    sendUpdateMutation.mutate(order);
  };

  const openWholesaleDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsWholesaleDialogOpen(true);
  };

  if (ordersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading orders. Please try again.</p>
        <Button 
          className="mt-4"
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
            queryClient.invalidateQueries({ queryKey: ['/api/order-groups'] });
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <Button variant="outline" onClick={() => setLocation('/')}>
          Create New Order
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Artwork</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order: Order) => {
                    const orderGroup = orderGroups.find((og: OrderGroup) => og.id === order.orderGroupId);
                    
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>{getCustomerName(order.customerId)}</TableCell>
                        <TableCell className="max-w-xs truncate">{order.artworkDescription}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(parseFloat(order.total))}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={order.status === 'completed' ? 'default' : 'secondary'}
                            className={`font-bold text-white ${
                              order.status === 'completed' ? 'bg-green-600' :
                              order.status === 'in_production' ? 'bg-blue-600' :
                              order.status === 'pending' ? 'bg-yellow-600' :
                              'bg-gray-600'
                            }`}
                          >
                            {order.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="default" 
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white font-bold"
                              onClick={() => {
                                const amount = parseFloat(order.total);
                                const checkoutUrl = `/checkout?amount=${amount}&orderId=${order.id}&description=Order Payment for Order #${order.id}`;
                                setLocation(checkoutUrl);
                              }}
                            >
                              💳 Checkout
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => setLocation(`/payment-link-manager?orderId=${order.id}`)}
                            >
                              Create Payment Link
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wholesale Dialog */}
      <Dialog open={isWholesaleDialogOpen} onOpenChange={setIsWholesaleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Wholesale Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Customer</label>
                  <p>{getCustomerName(selectedOrder.customerId)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Order Total</label>
                  <p className="text-lg font-semibold">{formatCurrency(parseFloat(selectedOrder.total))}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Artwork Description</label>
                <p>{selectedOrder.artworkDescription}</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsWholesaleDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={!!selectedOrderForPayment} onOpenChange={() => setSelectedOrderForPayment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Payment Link</DialogTitle>
          </DialogHeader>
          {selectedOrderForPayment && (
            <div className="space-y-4">
              <p>Send payment link to {getCustomerName(selectedOrderForPayment.customerId)}?</p>
              <p className="text-sm text-gray-600">
                Order #{selectedOrderForPayment.id} - {formatCurrency(parseFloat(selectedOrderForPayment.total))}
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedOrderForPayment(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleSendUpdate(selectedOrderForPayment)}
                  disabled={sendUpdateMutation.isPending}
                >
                  {sendUpdateMutation.isPending ? "Sending..." : "Send Payment Link"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}