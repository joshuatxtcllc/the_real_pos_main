import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLocation, Link } from 'wouter';
import { Edit, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Order, Customer, Frame, MatColor, GlassOption, WholesaleOrder, OrderGroup } from '@shared/schema';
import { generateOrderQrCode, generateMaterialQrCode } from '@/services/qrCodeService';
import { IntuitivePerformanceMonitor } from '@/components/IntuitivePerformanceMonitor';

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600 text-white shadow-md';
      case 'in_progress':
        return 'bg-blue-600 text-white shadow-md';
      case 'completed':
        return 'bg-green-600 text-white shadow-md';
      case 'cancelled':
        return 'bg-red-600 text-white shadow-md';
      default:
        return 'bg-gray-600 text-white shadow-md';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Payment status badge with urgent alerts
const PaymentStatusBadge = ({ orderGroup, total }: { orderGroup: OrderGroup | null, total: string }) => {
  if (!orderGroup) {
    return (
      <div className="flex items-center space-x-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white border-2 border-red-700 animate-pulse shadow-lg">
          🚨 PAYMENT REQUIRED
        </span>
        <span className="text-sm font-bold text-red-700">${total}</span>
      </div>
    );
  }

  const getPaymentBadge = () => {
    const totalAmount = parseFloat(orderGroup.total || '0');
    const paidAmount = parseFloat(orderGroup.cashAmount || '0');
    
    if (orderGroup.status === 'paid') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-600 text-white shadow-md">
          ✅ PAID
        </span>
      );
    }
    
    if (paidAmount > 0 && paidAmount < totalAmount) {
      const remaining = totalAmount - paidAmount;
      return (
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-600 text-white border-2 border-orange-700 animate-pulse shadow-lg">
            🔔 PARTIAL: ${remaining.toFixed(2)} DUE
          </span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-2">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border-2 border-red-300 animate-pulse">
          🚨 PAYMENT REQUIRED
        </span>
        <span className="text-sm font-medium text-red-600">${totalAmount.toFixed(2)}</span>
      </div>
    );
  };

  return getPaymentBadge();
};

const Orders = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isWholesaleDialogOpen, setIsWholesaleDialogOpen] = useState(false);
  const [_, setLocation] = useLocation();

  // Fetch orders
  const { data: orders, isLoading: ordersLoading, isError: ordersError } = useQuery({
    queryKey: ['/api/orders'],
    staleTime: 30000, // 30 seconds
  });

  // Fetch order groups
  const { data: orderGroups, isLoading: orderGroupsLoading, isError: orderGroupsError } = useQuery({
    queryKey: ['/api/order-groups'],
    staleTime: 30000, // 30 seconds
  });

  // Fetch customers for reference
  const { data: customers } = useQuery({
    queryKey: ['/api/customers'],
  });

  // Fetch frames for reference
  const { data: frames } = useQuery({
    queryKey: ['/api/frames'],
  });

  // Fetch mat colors for reference
  const { data: matColors } = useQuery({
    queryKey: ['/api/mat-colors'],
  });

  // Fetch glass options for reference
  const { data: glassOptions } = useQuery({
    queryKey: ['/api/glass-options'],
  });

  // Update order status mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest('PATCH', `/api/orders/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Order Updated",
        description: "Order status has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update order status",
        variant: "destructive",
      });
    },
  });

  // Create wholesale order mutation
  const createWholesaleOrderMutation = useMutation({
    mutationFn: async (orderId: number) => {
      return apiRequest('POST', '/api/wholesale-orders', { orderId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wholesale-orders'] });
      setIsWholesaleDialogOpen(false);
      toast({
        title: "Wholesale Order Created",
        description: "Wholesale order has been created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create wholesale order",
        variant: "destructive",
      });
    },
  });

  // Get customer name
  const getCustomerName = (customerId: number | null) => {
    if (!customerId || !customers) return 'Unknown';
    const customerArray = customers as Customer[];
    const customer = customerArray.find((c) => c.id === customerId);
    return customer ? customer.name : 'Unknown';
  };

  // Get frame name
  const getFrameName = (frameId: string | null) => {
    if (!frameId || !frames) return 'Unknown';
    const frameArray = frames as Frame[];
    const frame = frameArray.find((f) => f.id === frameId);
    return frame ? frame.name : 'Unknown';
  };

  // Get mat color name
  const getMatColorName = (matColorId: string | null) => {
    if (!matColorId || !matColors) return 'Unknown';
    const matColorArray = matColors as MatColor[];
    const matColor = matColorArray.find((m) => m.id === matColorId);
    return matColor ? matColor.name : 'Unknown';
  };

  // Get glass option name
  const getGlassOptionName = (glassOptionId: string | null) => {
    if (!glassOptionId || !glassOptions) return 'Unknown';
    const glassOptionArray = glassOptions as GlassOption[];
    const glassOption = glassOptionArray.find((g) => g.id === glassOptionId);
    return glassOption ? glassOption.name : 'Unknown';
  };

  // Update order status
  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateOrderMutation.mutate({ id: orderId, status: newStatus });
  };

  // Create wholesale order
  const handleCreateWholesaleOrder = () => {
    if (selectedOrder) {
      createWholesaleOrderMutation.mutate(selectedOrder.id);
    }
  };

  // Send customer update mutation
  const sendUpdateMutation = useMutation({
    mutationFn: async (orderId: number) => {
      return apiRequest('POST', `/api/orders/${orderId}/send-update`, {});
    },
    onSuccess: () => {
      toast({
        title: "Update Sent",
        description: "Customer has been notified of the current order status",
      });
    },
    onError: (error) => {
      toast({
        title: "Send Failed",
        description: error.message || "Failed to send customer update",
        variant: "destructive",
      });
    },
  });

  // Handle sending customer update
  const handleSendUpdate = (orderId: number) => {
    sendUpdateMutation.mutate(orderId);
  };

  // Open wholesale order dialog
  const openWholesaleDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsWholesaleDialogOpen(true);
  };

  // Check if any order has orderGroupId that matches
  const findOrderGroupForOrder = (orderId: number) => {
    if (!orderGroups || !ordersArray) return null;

    // Extract orderGroups array properly
    let orderGroupArray: any[] = [];
    try {
      if (Array.isArray(orderGroups)) {
        orderGroupArray = orderGroups;
      } else if (orderGroups && typeof orderGroups === 'object') {
        // Handle different response structures
        if ('orderGroups' in orderGroups) {
          orderGroupArray = (orderGroups as any).orderGroups || [];
        } else if ('data' in orderGroups && Array.isArray((orderGroups as any).data)) {
          orderGroupArray = (orderGroups as any).data;
        } else {
          // If it's an object but not recognizable structure, return null
          console.warn('Unrecognized orderGroups structure:', orderGroups);
          return null;
        }
      }
    } catch (error) {
      console.error('Error parsing orderGroups:', error);
      return null;
    }

    // Ensure orderGroupArray is actually an array before proceeding
    if (!Array.isArray(orderGroupArray)) {
      console.warn('orderGroupArray is not an array:', orderGroupArray);
      return null;
    }

    // Find the order group by matching orders with the given order ID
    const targetOrders = ordersArray.filter((order: Order) => 
      order.id === orderId && order.orderGroupId !== null
    );

    if (targetOrders.length > 0) {
      const orderGroupId = targetOrders[0].orderGroupId;
      return orderGroupArray.find(group => group.id === orderGroupId);
    }

    return null;
  };

  // Handle proceeding to checkout for an order
  const handleProceedToCheckout = (orderGroupId: number) => {
    setLocation(`/checkout/${orderGroupId}`);
  };

  // Extract orders array from API response and filter based on search term and status
  let ordersArray: Order[] = [];
  
  try {
    if (Array.isArray(orders)) {
      ordersArray = orders;
    } else if (orders && typeof orders === 'object' && 'orders' in orders) {
      ordersArray = (orders as any).orders || [];
    }
  } catch (error) {
    console.error('Error parsing orders:', error);
    ordersArray = [];
  }
  
  console.log('Orders response:', orders);
  console.log('Orders array:', ordersArray);
  
  const filteredOrders = Array.isArray(ordersArray) ? ordersArray.filter((order: Order) => {
    try {
      const customerName = getCustomerName(order.customerId);
      const matchesSearch = 
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    } catch (error) {
      console.error('Error filtering order:', order, error);
      return false;
    }
  }) : [];

  const isLoading = ordersLoading || orderGroupsLoading;
  const isError = ordersError || orderGroupsError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <div className="text-red-500 dark:text-red-400 text-xl mb-2">Error Loading Orders</div>
        <p className="text-gray-600 dark:text-gray-400">
          There was a problem fetching the orders. Please try again later.
        </p>
        <Button 
          variant="outline" 
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
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Create New Order
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="w-full sm:w-auto">
              <Input
                placeholder="Search by customer or order #"
                className="max-w-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-auto">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">No orders found</div>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || statusFilter !== 'all' ? 
                  'Try changing your search filters' : 
                  'Start by creating your first order'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Frame</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order: Order) => {
                    const orderGroup = findOrderGroupForOrder(order.id);
                    return (
                      <TableRow key={order.id} className={!orderGroup || orderGroup.status !== 'paid' ? 'bg-red-50 border-l-4 border-l-red-500' : ''}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell className="font-medium">{getCustomerName(order.customerId)}</TableCell>
                        <TableCell>
                          <PaymentStatusBadge orderGroup={orderGroup} total={order.total} />
                        </TableCell>
                        <TableCell>{getFrameName(order.frameId)}</TableCell>
                        <TableCell>{`${order.artworkWidth}" × ${order.artworkHeight}"`}</TableCell>
                        <TableCell className="text-center font-medium">{order.quantity || 1}</TableCell>
                        <TableCell className="text-sm">
                          <div>
                            <div><strong>Art:</strong> {order.artworkLocation || 'Not specified'}</div>
                            <div><strong>Materials:</strong> Workshop - Bay A</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={order.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-2">
                            <div className="flex gap-2">
                              {(!orderGroup || orderGroup.status !== 'paid') && (
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => {
                                    if (orderGroup) {
                                      handleProceedToCheckout(orderGroup.id);
                                    } else {
                                      // Create order group for checkout
                                      toast({
                                        title: "Creating checkout session...",
                                        description: "Setting up payment for this order.",
                                      });
                                    }
                                  }}
                                >
                                  💳 Checkout
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-2 border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold"
                                onClick={() => handleSendUpdate(order.id)}
                                disabled={sendUpdateMutation.isPending}
                              >
                                📧 Send Update
                              </Button>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-2 border-purple-600 text-purple-700 hover:bg-purple-600 hover:text-white font-semibold"
                                onClick={() => openWholesaleDialog(order)}
                              >
                                📦 Materials
                              </Button>
                              <Button 
                                variant="secondary" 
                                size="sm"
                                className="bg-gray-700 text-white hover:bg-gray-800 font-semibold"
                                onClick={() => setLocation(`/order-progress/${order.id}`)}
                              >
                                📊 Progress
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                                onClick={() => setLocation(`/orders/${order.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-1" /> Details
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wholesale Order Dialog */}
      <Dialog open={isWholesaleDialogOpen} onOpenChange={setIsWholesaleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Wholesale Order</DialogTitle>
            <DialogDescription>
              Order materials needed for Order #{selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Frame</h4>
                  <p className="text-sm">{getFrameName(selectedOrder.frameId)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Mat</h4>
                  <p className="text-sm">{getMatColorName(selectedOrder.matColorId)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Glass</h4>
                  <p className="text-sm">{getGlassOptionName(selectedOrder.glassOptionId)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Size</h4>
                  <p className="text-sm">{`${selectedOrder.artworkWidth}" × ${selectedOrder.artworkHeight}"`}</p>
                </div>
              </div>

              <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-900">
                <h4 className="text-sm font-medium mb-2">Materials to Order</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span>Frame length needed:</span>
                    <span className="font-medium">
                      {Math.ceil((2 * (Number(selectedOrder.artworkWidth) + Number(selectedOrder.artworkHeight)) / 12) + 1)} ft
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Mat board needed:</span>
                    <span className="font-medium">
                      {Math.ceil(Number(selectedOrder.artworkWidth) + (Number(selectedOrder.matWidth) * 2) + 4)}" × 
                      {Math.ceil(Number(selectedOrder.artworkHeight) + (Number(selectedOrder.matWidth) * 2) + 4)}"
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Glass needed:</span>
                    <span className="font-medium">
                      {Math.ceil(Number(selectedOrder.artworkWidth) + (Number(selectedOrder.matWidth) * 2))}" × 
                      {Math.ceil(Number(selectedOrder.artworkHeight) + (Number(selectedOrder.matWidth) * 2))}"
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsWholesaleDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateWholesaleOrder}
                  disabled={createWholesaleOrderMutation.isPending}
                >
                  {createWholesaleOrderMutation.isPending ? "Creating..." : "Create Wholesale Order"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Intuitive Performance Monitor Overlay */}
      <IntuitivePerformanceMonitor compact={true} updateInterval={4000} />
    </div>
  );
};

export default Orders;