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
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Payment status badge with urgent alerts
const PaymentStatusBadge = ({ orderGroup, total }: { orderGroup: OrderGroup | null, total: string }) => {
  if (!orderGroup) {
    return (
      <div className="flex items-center space-x-2">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border-2 border-red-300 animate-pulse">
          🚨 PAYMENT REQUIRED
        </span>
        <span className="text-sm font-medium text-red-600">${total}</span>
      </div>
    );
  }

  const getPaymentBadge = () => {
    const totalAmount = parseFloat(orderGroup.total || '0');
    const paidAmount = parseFloat(orderGroup.cashAmount || '0');
    
    if (orderGroup.status === 'paid') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ✅ PAID
        </span>
      );
    }
    
    if (paidAmount > 0 && paidAmount < totalAmount) {
      const remaining = totalAmount - paidAmount;
      return (
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border-2 border-orange-300 animate-pulse">
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

  // Print invoice mutation
  const printInvoiceMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const orderGroupId = findOrderGroupForOrder(orderId)?.id;
      if (!orderGroupId) {
        throw new Error('No invoice found for this order');
      }
      
      const response = await fetch(`/api/invoices/${orderGroupId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch invoice data');
      }
      return response.json();
    },
    onSuccess: (invoiceData) => {
      // Open invoice in new window and print
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(generateInvoiceHTML(invoiceData));
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    },
    onError: (error) => {
      toast({
        title: "Print Failed",
        description: error.message || "Failed to print invoice",
        variant: "destructive",
      });
    },
  });

  // Print work order mutation
  const printWorkOrderMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order data');
      }
      return response.json();
    },
    onSuccess: (orderData) => {
      // Open work order in new window and print
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(generateWorkOrderHTML(orderData.order));
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    },
    onError: (error) => {
      toast({
        title: "Print Failed",
        description: error.message || "Failed to print work order",
        variant: "destructive",
      });
    },
  });

  // Generate invoice HTML for printing
  const generateInvoiceHTML = (invoiceData: any) => {
    const { orderGroup, orders, customer } = invoiceData;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #${orderGroup.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
          .company-info { text-align: center; margin-bottom: 20px; }
          .invoice-details { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .customer-info { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .totals { text-align: right; margin-top: 20px; }
          .total-line { display: flex; justify-content: space-between; padding: 5px 0; }
          .total-final { font-weight: bold; font-size: 18px; border-top: 2px solid #000; padding-top: 10px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="company-info">
          <h1>Jay's Frames</h1>
          <p>Professional Custom Framing</p>
          <p>Phone: (555) 123-4567 | Email: info@jaysframes.com</p>
        </div>
        
        <div class="header">
          <h2>INVOICE #${orderGroup.id}</h2>
        </div>
        
        <div class="invoice-details">
          <div>
            <strong>Invoice Date:</strong> ${new Date(orderGroup.createdAt).toLocaleDateString()}<br>
            <strong>Due Date:</strong> On Receipt<br>
            <strong>Status:</strong> ${orderGroup.status || 'Pending'}
          </div>
          <div>
            <strong>Customer:</strong><br>
            ${customer.name}<br>
            ${customer.email || ''}<br>
            ${customer.phone || ''}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map((order: any) => `
              <tr>
                <td>
                  Custom Framing #${order.id}<br>
                  <small>${order.artworkDescription || 'Custom Frame'}</small><br>
                  <small>Size: ${order.artworkWidth}" × ${order.artworkHeight}"</small>
                </td>
                <td>${order.quantity}</td>
                <td>$${parseFloat(order.subtotal).toFixed(2)}</td>
                <td>$${parseFloat(order.total).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-line">
            <span>Subtotal:</span>
            <span>$${parseFloat(orderGroup.subtotal).toFixed(2)}</span>
          </div>
          <div class="total-line">
            <span>Tax:</span>
            <span>$${parseFloat(orderGroup.tax).toFixed(2)}</span>
          </div>
          <div class="total-line total-final">
            <span>Total:</span>
            <span>$${parseFloat(orderGroup.total).toFixed(2)}</span>
          </div>
        </div>

        <div style="margin-top: 40px; font-size: 12px; color: #666;">
          <p>Thank you for your business! All custom framing sales are final.</p>
        </div>
      </body>
      </html>
    `;
  };

  // Generate work order HTML for printing
  const generateWorkOrderHTML = (order: any) => {
    const customer = customers?.find((c: Customer) => c.id === order.customerId);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Work Order #${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
          .work-order-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
          .section { margin-bottom: 15px; }
          .label { font-weight: bold; margin-bottom: 5px; }
          .checklist { margin-top: 30px; }
          .checklist-item { display: flex; align-items: center; margin-bottom: 10px; }
          .checklist-item input { margin-right: 10px; }
          .notes-section { margin-top: 30px; }
          .notes-box { border: 1px solid #ccc; min-height: 100px; padding: 10px; margin-top: 10px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>JAY'S FRAMES - WORK ORDER</h1>
          <h2>Order #${order.id}</h2>
        </div>
        
        <div class="work-order-info">
          <div>
            <div class="section">
              <div class="label">Customer:</div>
              <div>${customer?.name || 'Unknown Customer'}</div>
            </div>
            <div class="section">
              <div class="label">Artwork Dimensions:</div>
              <div>${order.artworkWidth}" × ${order.artworkHeight}"</div>
            </div>
            <div class="section">
              <div class="label">Artwork Description:</div>
              <div>${order.artworkDescription || 'N/A'}</div>
            </div>
            <div class="section">
              <div class="label">Artwork Type:</div>
              <div>${order.artworkType || 'N/A'}</div>
            </div>
            <div class="section">
              <div class="label">Artwork Location:</div>
              <div>${order.artworkLocation || 'Not specified'}</div>
            </div>
          </div>
          
          <div>
            <div class="section">
              <div class="label">Frame:</div>
              <div>${getFrameName(order.frameId)}</div>
            </div>
            <div class="section">
              <div class="label">Mat:</div>
              <div>${getMatColorName(order.matColorId)}</div>
            </div>
            <div class="section">
              <div class="label">Glass:</div>
              <div>${getGlassOptionName(order.glassOptionId)}</div>
            </div>
            <div class="section">
              <div class="label">Due Date:</div>
              <div>${order.dueDate ? new Date(order.dueDate).toLocaleDateString() : 'Not set'}</div>
            </div>
            <div class="section">
              <div class="label">Order Total:</div>
              <div style="font-size: 18px; font-weight: bold;">$${parseFloat(order.total).toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div class="checklist">
          <div class="label">Production Checklist:</div>
          <div class="checklist-item">
            <input type="checkbox" id="frame-cut">
            <label for="frame-cut">Frame cut and assembled</label>
          </div>
          <div class="checklist-item">
            <input type="checkbox" id="mat-cut">
            <label for="mat-cut">Mat cut and beveled</label>
          </div>
          <div class="checklist-item">
            <input type="checkbox" id="glass-cut">
            <label for="glass-cut">Glass cut and cleaned</label>
          </div>
          <div class="checklist-item">
            <input type="checkbox" id="artwork-mounted">
            <label for="artwork-mounted">Artwork mounted</label>
          </div>
          <div class="checklist-item">
            <input type="checkbox" id="hardware">
            <label for="hardware">Hardware attached</label>
          </div>
          <div class="checklist-item">
            <input type="checkbox" id="inspection">
            <label for="inspection">Final inspection</label>
          </div>
          <div class="checklist-item">
            <input type="checkbox" id="ready">
            <label for="ready">Ready for pickup</label>
          </div>
        </div>

        <div class="notes-section">
          <div class="label">Production Notes:</div>
          <div class="notes-box"></div>
        </div>
      </body>
      </html>
    `;
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
    if (!orderGroups) return null;

    // Extract orderGroups array from API response with better error handling
    let orderGroupArray: any[] = [];
    
    try {
      if (Array.isArray(orderGroups)) {
        orderGroupArray = orderGroups;
      } else if (orderGroups && typeof orderGroups === 'object' && Array.isArray((orderGroups as any).orderGroups)) {
        orderGroupArray = (orderGroups as any).orderGroups;
      } else {
        console.warn('orderGroups is not in expected format:', orderGroups);
        return null;
      }
    } catch (error) {
      console.error('Error processing orderGroups:', error);
      return null;
    }

    if (!Array.isArray(orderGroupArray) || orderGroupArray.length === 0) {
      return null;
    }

    // Find the order group by matching orders with the given order ID
    const targetOrders = Array.isArray(ordersArray) ? ordersArray.filter((order: Order) => 
      order.id === orderId && order.orderGroupId !== null
    ) : [];

    if (targetOrders.length > 0) {
      const orderGroupId = targetOrders[0].orderGroupId;
      try {
        return orderGroupArray.find((group: any) => group && group.id === orderGroupId);
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
  const ordersArray = Array.isArray(orders) ? orders : ((orders as any)?.orders || []);
  
  console.log('Orders response:', orders);
  console.log('Orders array:', ordersArray);
  
  const filteredOrders = Array.isArray(ordersArray) ? ordersArray.filter((order: Order) => {
    const matchesSearch = 
      getCustomerName(order.customerId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
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
                                onClick={() => openWholesaleDialog(order)}
                              >
                                📦 Materials
                              </Button>
                              <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => setLocation(`/order-progress/${order.id}`)}
                              >
                                📊 Progress
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => setLocation(`/orders/${order.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-1" /> Details
                              </Button>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => printInvoiceMutation.mutate(order.id)}
                                disabled={printInvoiceMutation.isPending}
                              >
                                🧾 Print Invoice
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => printWorkOrderMutation.mutate(order.id)}
                                disabled={printWorkOrderMutation.isPending}
                              >
                                📋 Print Work Order
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