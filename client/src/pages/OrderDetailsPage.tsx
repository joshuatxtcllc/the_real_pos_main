import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { useProduction } from '@/hooks/use-production';
import { useOrders } from '@/hooks/use-orders';
import OrderProgress from '@/components/OrderProgress';
import NotificationHistory from '@/components/NotificationHistory';
import { OrderEditDialog } from '@/components/OrderEditDialog';
import { OrderStatusHistory } from '@/components/OrderStatusHistory';
import OrderFiles from '@/components/OrderFiles';
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, ArrowLeft, Clock, Edit, ShoppingBag } from 'lucide-react';
import { getQrCodeByEntity } from '@/services/qrCodeService';
import ArtworkLocationTracker from '@/components/ArtworkLocationTracker';
import QRCode from 'react-qr-code';


export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null); // Added state for QR code data

  const {
    order,
    isLoadingOrder,
    orderError,
    orderNotifications,
    isLoadingOrderNotifications,
  } = useProduction({
    orderId: orderId ? parseInt(orderId) : undefined
  });

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest('PATCH', `/api/orders/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: [`/api/production/orders/${orderId}`] });
      toast({
        title: "Status Updated",
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

  useEffect(() => {
    if (orderError) {
      toast({
        title: 'Error',
        description: 'Failed to load order details. Please try again.',
        variant: 'destructive',
      });
    }
  }, [orderError, toast]);

  const handleEditDialogOpenChange = (open: boolean) => {
    setIsEditDialogOpen(open);
  };

  const handleStatusChange = (newStatus: string) => {
    if (order) {
      updateOrderStatusMutation.mutate({ id: order.id, status: newStatus });
    }
  };

  useEffect(() => {
    const loadQrCode = async () => {
      if (orderId && order) {
        try {
          const qrCode = await getQrCodeByEntity('order', orderId);
          setQrCodeData(qrCode?.code || null);
        } catch (error) {
          console.error('Error loading QR code:', error);
        }
      }
    };
    loadQrCode();
  }, [orderId, order]);


  if (isLoadingOrder) {
    return (
      <div className="container mx-auto py-10 space-y-6">
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto py-10 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
            <CardDescription>
              We couldn't find the order you're looking for.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-center mb-6">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button asChild>
              <Link href="/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Orders
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          <p className="text-muted-foreground">
            Customer: {order.customerName || 'Unknown'} | Created: {new Date(order.createdAt || '').toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
          <Button 
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>
              Specifications and pricing information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1 text-foreground">Frame</h4>
                <p className="text-sm text-muted-foreground">{order.frameName || order.frameId || 'None'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1 text-foreground">Material</h4>
                <p className="text-sm text-muted-foreground">{order.frameMaterial || 'Standard'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1 text-foreground">Mat</h4>
                <p className="text-sm text-muted-foreground">{order.matColorName || order.matColorId || 'None'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1 text-foreground">Glass</h4>
                <p className="text-sm text-muted-foreground">{order.glassOptionName || order.glassOptionId || 'None'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1 text-foreground">Image Size</h4>
                <p className="text-sm text-muted-foreground">{order.artworkWidth}" × {order.artworkHeight}"</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1 text-foreground">Mat Width</h4>
                <p className="text-sm text-muted-foreground">{order.matWidth}" all around</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1 text-foreground">Quantity</h4>
                <p className="text-sm text-muted-foreground">{order.quantity || 1}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium mb-1 text-foreground">Description</h4>
                <p className="text-sm text-muted-foreground">{order.artworkDescription || 'No description'}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium mb-1 text-foreground">Art Type</h4>
                <p className="text-sm text-muted-foreground">{order.artworkType || 'Not specified'}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium mb-1 text-foreground">Status</h4>
                <div className="flex items-center gap-2">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'}`}
                  >
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1).replace('_', ' ')}
                  </div>
                  <Select
                    value={order.status || 'pending'}
                    onValueChange={handleStatusChange}
                    disabled={updateOrderStatusMutation.isPending}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {qrCodeData && (
                <div className="col-span-2">
                  <h4 className="text-sm font-medium mb-1 text-foreground">QR Code</h4>
                  <div className="bg-white p-2 rounded inline-block">
                    <QRCode value={qrCodeData} size={128} level="H" />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p className="text-sm font-medium text-foreground">${parseFloat(order.subtotal || '0').toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Tax</p>
                <p className="text-sm font-medium text-foreground">${parseFloat(order.tax || '0').toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center font-medium mt-2">
                <p className="text-foreground">Total</p>
                <p className="text-foreground">${parseFloat(order.total || '0').toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/order-progress/${order.id}`}>
                <Clock className="mr-2 h-4 w-4" />
                Track Progress
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Order Progress */}
        <div className="md:col-span-2">
          <OrderProgress order={order} showHistory={false} />

          <div className="mt-6">
            <NotificationHistory orderId={order.id} />
            {/* Order Status History */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Status History</h3>
              <OrderStatusHistory orderId={order.id} />
            </div>
            {/* Order Files */}
            <div className="mt-6">
              <OrderFiles orderId={order.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <OrderEditDialog 
        isOpen={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)}
        order={order}
      />
    </div>
  );
}