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
import { Loader2 } from 'lucide-react';

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
        <span className="text-sm font-bold text-red-800 dark:text-red-400">${total}</span>
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
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white border-2 border-red-700 animate-pulse">
          🚨 PAYMENT REQUIRED
        </span>
        <span className="text-sm font-bold text-red-800 dark:text-red-400">${totalAmount.toFixed(2)}</span>
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
    staleTime: 30000, // 30 seconds,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Fetch order groups
  const { data: orderGroups, isLoading: orderGroupsLoading, isError: orderGroupsError } = useQuery({
    queryKey: ['/api/order-groups'],
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Debug logging for order groups
  console.log('Order groups response:', orderGroups);

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
    onError: (error: any) => {
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
    onError: (error: any) => {
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
    onError: (error: any) => {
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

  // Helper function to find order group for an order
  const findOrderGroupForOrder = (orderId: number) => {
    if (!orderGroups) return null;

    // Get ordersArray in this function scope
    let currentOrdersArray: Order[] = [];
    try {
      if (Array.isArray(orders)) {
        currentOrdersArray = orders;
      } else if (orders && typeof orders === 'object' && 'orders' in orders) {
        currentOrdersArray = (orders as any).orders || [];
      }
    } catch (error) {
      console.error('Error parsing orders in findOrderGroupForOrder:', error);
      return null;
    }

    if (!currentOrdersArray.length) return null;

    // Extract orderGroups array properly with better error handling
    let orderGroupArray: any[] = [];
    try {
      if (Array.isArray(orderGroups)) {
        orderGroupArray = orderGroups;
      } else if (orderGroups && typeof orderGroups === 'object') {
        // Handle different response structures
        if ('orderGroups' in orderGroups) {
          const groups = (orderGroups as any).orderGroups;
          orderGroupArray = Array.isArray(groups) ? groups : [];
        } else if ('data' in orderGroups && Array.isArray((orderGroups as any).data)) {
          orderGroupArray = (orderGroups as any).data;
        } else {
          // If it's an object but not recognizable structure, try to convert
          console.warn('Unrecognized orderGroups structure:', orderGroups);
          orderGroupArray = [];
        }
      } else {
        orderGroupArray = [];
      }
    } catch (error) {
      console.error('Error parsing order groups in findOrderGroupForOrder:', error);
      orderGroupArray = [];
    }

    // Double-check it's an array and has find method
    if (!Array.isArray(orderGroupArray) || typeof orderGroupArray.find !== 'function') {
      console.warn('orderGroupArray is not a proper array, setting to empty array:', orderGroupArray);
      orderGroupArray = [];
    }

    // Find the order group by matching orders with the given order ID
    const targetOrders = currentOrdersArray.filter((order: Order) => 
      order.id === orderId && order.orderGroupId !== null
    );

    if (targetOrders.length > 0 && orderGroupArray.length > 0) {
      const orderGroupId = targetOrders[0].orderGroupId;
      try {
        return orderGroupArray.find(group => group && group.id === orderGroupId) || null;
      } catch (error) {
        console.error('Error finding order group:', error);
        return null;
      }
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
                className="max-w-md text-black dark:text-white placeholder-gray-700 dark:placeholder-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-auto">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px] text-black dark:text-white bg-white dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="text-black dark:text-white bg-white dark:bg-gray-800">
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
              <div className="text-black dark:text-white text-xl mb-2 font-bold">No orders found</div>
              <p className="text-black dark:text-white text-lg">
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
                    <TableHead className="text-black dark:text-white font-bold text-base bg-gray-100 dark:bg-gray-800">Order #</TableHead>
                    <TableHead className="text-black dark:text-white font-bold text-base bg-gray-100 dark:bg-gray-800">Customer</TableHead>
                    <TableHead className="text-black dark:text-white font-bold text-base bg-gray-100 dark:bg-gray-800">Payment Status</TableHead>
                    <TableHead className="text-black dark:text-white font-bold text-base bg-gray-100 dark:bg-gray-800">Frame</TableHead>
                    <TableHead className="text-black dark:text-white font-bold text-base bg-gray-100 dark:bg-gray-800">Size</TableHead>
                    <TableHead className="text-black dark:text-white font-bold text-base bg-gray-100 dark:bg-gray-800">Qty</TableHead>
                    <TableHead className="text-black dark:text-white font-bold text-base bg-gray-100 dark:bg-gray-800">Location</TableHead>
                    <TableHead className="text-black dark:text-white font-bold text-base bg-gray-100 dark:bg-gray-800">Status</TableHead>
                    <TableHead className="text-black dark:text-white font-bold text-base bg-gray-100 dark:bg-gray-800">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order: Order) => {
                    const orderGroup = findOrderGroupForOrder(order.id);
                    return (
                      <TableRow key={order.id} className={!orderGroup || orderGroup.status !== 'paid' ? 'bg-red-50 dark:bg-red-900/30 border-l-4 border-l-red-500' : 'bg-white dark:bg-gray-900'}>
                        <TableCell className="font-bold text-black dark:text-white text-base">{order.id}</TableCell>
                        <TableCell className="font-bold text-black dark:text-white text-base">{getCustomerName(order.customerId)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {(() => {
                              // Calculate correct totals
                              const quantity = order.quantity || 1;
                              const unitPrice = parseFloat(order.subtotal) || 0;
                              const calculatedTotal = unitPrice * quantity;
                              const taxAmount = calculatedTotal * 0.08; // 8% tax
                              const finalTotal = calculatedTotal + taxAmount;

                              return (
                                <>
                                  <PaymentStatusBadge orderGroup={orderGroup} total={finalTotal.toFixed(2)} />
                                  <div className="text-sm text-black dark:text-white">
                                    <div className="font-bold">Unit: ${unitPrice.toFixed(2)}</div>
                                    <div className="font-bold text-red-600 dark:text-red-400">Subtotal: ${calculatedTotal.toFixed(2)} (×{quantity})</div>
                                    <div className="font-bold text-black dark:text-white">Total w/Tax: ${finalTotal.toFixed(2)}</div>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </TableCell>
                        <TableCell className="text-black dark:text-white font-semibold">{getFrameName(order.frameId)}</TableCell>
                        <TableCell className="text-black dark:text-white font-semibold">{`${order.artworkWidth}" × ${order.artworkHeight}"`}</TableCell>
                        <TableCell className="text-center font-bold text-xl bg-yellow-200 dark:bg-yellow-800 border-2 border-yellow-400 dark:border-yellow-600 text-black dark:text-white">{order.quantity || 1}</TableCell>
                        <TableCell className="text-sm">
                          <div className="text-black dark:text-white">
                            <div><strong className="text-black dark:text-white">Art:</strong> {order.artworkLocation || 'Not specified'}</div>
                            <div><strong className="text-black dark:text-white">Materials:</strong> Workshop - Bay A</div>
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
                                  onClick={async () => {
                                    try {
                                      // Check if order already has a group
                                      if (order.orderGroupId) {
                                        console.log(`Order ${order.id} already has orderGroupId: ${order.orderGroupId}`);
                                        setLocation(`/checkout/${order.orderGroupId}`);
                                        return;
                                      }

                                      // Create order group for checkout
                                      toast({
                                        title: "Creating checkout session...",
                                        description: "Setting up payment for this order.",
                                      });

                                      console.log('Creating order group for order:', order.id);

                                      // Calculate proper totals
                                      const quantity = order.quantity || 1;
                                      const unitPrice = parseFloat(order.subtotal) || 0;
                                      const calculatedSubtotal = unitPrice * quantity;
                                      const taxAmount = calculatedSubtotal * 0.08; // 8% tax
                                      const finalTotal = calculatedSubtotal + taxAmount;

                                      const response = await fetch('/api/order-groups', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                          customerId: order.customerId,
                                          subtotal: calculatedSubtotal.toFixed(2),
                                          tax: taxAmount.toFixed(2),
                                          total: finalTotal.toFixed(2),
                                          status: 'open',
                                          notes: `Order group for Order #${order.id}`
                                        }),
                                      });

                                      if (!response.ok) {
                                        const errorData = await response.text();
                                        console.error('Order group creation failed:', errorData);
                                        throw new Error(`Failed to create order group: ${response.status}`);
                                      }

                                      const responseData = await response.json();
                                      console.log('Order group created:', responseData);

                                      const newOrderGroup = responseData.orderGroup || responseData;

                                      // Update the order with the new orderGroupId
                                      const updateResponse = await fetch(`/api/orders/${order.id}`, {
                                        method: 'PATCH',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                          orderGroupId: newOrderGroup.id
                                        }),
                                      });

                                      if (!updateResponse.ok) {
                                        const updateErrorData = await updateResponse.text();
                                        console.error('Order update failed:', updateErrorData);
                                        throw new Error(`Failed to update order: ${updateResponse.status}`);
                                      }

                                      console.log(`Order ${order.id} updated with orderGroupId: ${newOrderGroup.id}`);

                                      // Refresh the orders data
                                      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
                                      queryClient.invalidateQueries({ queryKey: ['/api/order-groups'] });

                                      // Navigate to checkout
                                      setLocation(`/checkout/${newOrderGroup.id}`);

                                    } catch (error) {
                                      console.error('Detailed checkout error:', error);
                                      toast({
                                        title: "Checkout Error",
                                        description: `Failed to create checkout session: ${error instanceof Error ? error.message : 'Unknown error'}`,
                                        variant: "destructive",
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