import React, { useState } from 'react';
import { Order, ProductionStatus, productionStatuses } from '@shared/schema';
import { useProduction } from '@/hooks/use-production';
import { Link } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, AlertCircle, Clock, Truck, Scissors, Box, CheckCheck, AlertTriangle, Calendar, QrCode, Send, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function OrderProgress({ 
  order, 
  showHistory = true 
}: { 
  order: Order, 
  showHistory?: boolean 
}) {
  const { toast } = useToast();
  const { toggleNotificationsMutation } = useProduction({
    orderId: order.id,
    customerId: order.customerId || undefined
  });

  // Calculate the progress percentage based on the production status
  const getProgressPercentage = (): number => {
    const statusIndex = productionStatuses.indexOf(order.productionStatus as ProductionStatus);
    
    // If status is "scheduled", it's just the beginning
    if (order.productionStatus === "scheduled") {
      return 10;
    }
    
    // For delayed status, indicate caution with 50% unless we have a previous status
    if (order.productionStatus === "delayed") {
      // If we know what the previous status was before delay, use that position minus a bit
      if (order.previousStatus) {
        const prevIndex = productionStatuses.indexOf(order.previousStatus as ProductionStatus);
        return Math.max(prevIndex * 100 / (productionStatuses.length - 1) - 10, 10);
      }
      return 50;
    }
    
    // Regular progress calculation
    if (statusIndex >= 0) {
      return statusIndex * 100 / (productionStatuses.length - 1);
    }
    
    return 0;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'order_processed':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'scheduled':
        return <Calendar className="h-5 w-5" />;
      case 'materials_ordered':
        return <Truck className="h-5 w-5" />;
      case 'materials_arrived':
        return <Box className="h-5 w-5" />;
      case 'frame_cut':
      case 'mat_cut':
        return <Scissors className="h-5 w-5" />;
      case 'in_production':
        return <Scissors className="h-5 w-5" />;
      case 'prepped':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'completed':
        return <CheckCheck className="h-5 w-5" />;
      case 'delayed':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'order_processed':
        return {
          title: 'Order Processed',
          description: 'Your order has been received and is being processed.'
        };
      case 'scheduled':
        return {
          title: 'Order Scheduled',
          description: 'Your order has been scheduled for production.'
        };
      case 'materials_ordered':
        return {
          title: 'Materials Ordered',
          description: 'Materials for your frame have been ordered from our suppliers.'
        };
      case 'materials_arrived':
        return {
          title: 'Materials Arrived',
          description: 'All materials for your frame have arrived and are ready for assembly.'
        };
      case 'frame_cut':
        return {
          title: 'Frame Cutting',
          description: 'The frame moulding is being cut to size for your artwork.'
        };
      case 'mat_cut':
        return {
          title: 'Mat Cutting',
          description: 'The mat board is being cut to size for your artwork.'
        };
      case 'in_production':
        return {
          title: 'In Production',
          description: 'Your frame is currently being assembled and finished.'
        };
      case 'prepped':
        return {
          title: 'Assembly Preparation',
          description: 'Your frame components are prepared and ready for final assembly.'
        };
      case 'completed':
        return {
          title: 'Order Completed',
          description: 'Your custom frame is complete and ready for pickup or delivery.'
        };
      case 'delayed':
        return {
          title: 'Order Delayed',
          description: 'There is a delay with your order. We will provide updates as soon as possible.'
        };
      default:
        return {
          title: 'Processing',
          description: 'Your order is being processed.'
        };
    }
  };

  const statusDetails = getStatusDetails(order.productionStatus);

  // Handle notification toggle
  const handleNotificationToggle = (enabled: boolean) => {
    toggleNotificationsMutation.mutate({ 
      id: order.id, 
      enabled 
    }, {
      onSuccess: () => {
        toast({
          title: 'Notification preferences updated',
          description: `Email notifications have been ${enabled ? 'enabled' : 'disabled'} for this order`,
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Order Progress</CardTitle>
            <CardDescription>
              Current status: {statusDetails.title}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Email notifications</span>
            <Switch 
              checked={!!order.notificationsEnabled} 
              onCheckedChange={handleNotificationToggle}
              disabled={toggleNotificationsMutation.isPending}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Order Received</span>
            <span>Completed</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        <div className="bg-muted/50 p-4 rounded-md flex items-start gap-3">
          {getStatusIcon(order.productionStatus)}
          <div>
            <h4 className="font-medium">{statusDetails.title}</h4>
            <p className="text-sm text-muted-foreground">{statusDetails.description}</p>
            
            {order.dueDate && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Expected completion: {format(new Date(order.dueDate), 'PPP')}</span>
              </div>
            )}
          </div>
        </div>

        {order.estimatedCompletionDays && order.estimatedCompletionDays > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              Estimated time to completion: {order.estimatedCompletionDays} {order.estimatedCompletionDays === 1 ? 'day' : 'days'}
            </span>
          </div>
        )}

        {/* QR Code and Locations Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Material Location */}
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Materials Location</p>
                <p className="text-xs text-muted-foreground">
                  {order.artworkLocation || 'Workshop - Bay A'}
                </p>
              </div>
            </div>

            {/* Artwork Location */}
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Artwork Location</p>
                <p className="text-xs text-muted-foreground">
                  Shelf #{order.id}-ART
                </p>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div className="flex items-center gap-3">
              <QrCode className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Order QR Code</p>
                <p className="text-xs text-muted-foreground">
                  Quick access to order #{order.id}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const qrUrl = `${window.location.origin}/order-progress/${order.id}`;
                // Create QR code data and show it
                const qrData = {
                  orderId: order.id,
                  status: order.productionStatus,
                  materials: order.artworkLocation || 'Workshop - Bay A',
                  artwork: `Shelf #${order.id}-ART`,
                  url: qrUrl
                };
                
                // Create and display QR code using Google Charts API
                const modal = document.createElement('div');
                modal.style.cssText = `
                  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                  background: rgba(0,0,0,0.8); display: flex; align-items: center;
                  justify-content: center; z-index: 9999;
                `;
                
                const content = document.createElement('div');
                content.style.cssText = `
                  background: white; padding: 30px; border-radius: 10px;
                  text-align: center; max-width: 400px;
                `;
                
                // Use Google Charts API for QR code generation (no external dependencies)
                const qrImageUrl = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(qrUrl)}`;
                
                content.innerHTML = `
                  <h3 style="margin: 0 0 20px 0;">Order #${order.id} QR Code</h3>
                  <div style="margin: 20px 0; padding: 10px; background: #f5f5f5;">
                    <img src="${qrImageUrl}" alt="QR Code" style="max-width: 200px; height: auto;" />
                  </div>
                  <p style="font-size: 12px; color: #666; margin: 15px 0;">
                    Materials: ${qrData.materials}<br>
                    Artwork: ${qrData.artwork}<br>
                    <strong>URL:</strong> ${qrUrl}
                  </p>
                  <button onclick="this.closest('.qr-modal').remove()" style="
                    padding: 8px 16px; background: #007bff; color: white;
                    border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;
                  ">Close</button>
                  <button onclick="window.print()" style="
                    padding: 8px 16px; background: #28a745; color: white;
                    border: none; border-radius: 4px; cursor: pointer;
                  ">Print</button>
                `;
                
                modal.className = 'qr-modal';
                modal.appendChild(content);
                document.body.appendChild(modal);
                
                // Close on background click
                modal.addEventListener('click', (e) => {
                  if (e.target === modal) modal.remove();
                });
              }}
            >
              <QrCode className="h-4 w-4 mr-1" />
              View QR
            </Button>
          </div>
        </div>

        {/* Notification Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm"
            onClick={async () => {
              try {
                // First get customer details
                const customerResponse = await fetch(`/api/customers/${order.customerId}`);
                const customerData = await customerResponse.json();
                
                if (!customerResponse.ok || !customerData.customer) {
                  throw new Error('Customer not found');
                }
                
                const customer = customerData.customer;
                
                // Send notification with customer email/phone
                const notificationResponse = await fetch(`/api/notifications/send`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    orderId: order.id,
                    customerEmail: customer.email,
                    customerPhone: customer.phone,
                    type: 'status_update',
                    message: `Your order #${order.id} status has been updated to: ${statusDetails.title}`
                  })
                });
                
                const result = await notificationResponse.json();
                
                if (notificationResponse.ok) {
                  toast({
                    title: 'Notification Sent',
                    description: `Customer ${customer.name} has been notified of the order status update.`,
                  });
                } else {
                  throw new Error(result.error || 'Failed to send notification');
                }
              } catch (error) {
                console.error('Notification error:', error);
                toast({
                  title: 'Notification Failed',
                  description: error.message || 'Failed to send notification. Please try again.',
                  variant: 'destructive'
                });
              }
            }}
          >
            <Send className="h-4 w-4 mr-1" />
            Send Update
          </Button>
        </div>
      </CardContent>

      {showHistory && (
        <CardFooter className="flex justify-end border-t pt-4">
          <Button variant="ghost" asChild>
            <Link href={`/order-progress/${order.id}`}>View detailed progress</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}