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
                
                // Open QR code in new window with the data
                const qrWindow = window.open('', '_blank', 'width=400,height=500');
                if (qrWindow) {
                  qrWindow.document.write(`
                    <html>
                      <head><title>Order QR Code</title></head>
                      <body style="padding: 20px; text-align: center; font-family: Arial;">
                        <h3>Order #${order.id} QR Code</h3>
                        <div id="qrcode"></div>
                        <p style="margin-top: 20px; font-size: 12px;">
                          Materials: ${qrData.materials}<br>
                          Artwork: ${qrData.artwork}
                        </p>
                        <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
                        <script>
                          QRCode.toCanvas(document.getElementById('qrcode'), '${qrUrl}', {width: 200});
                        </script>
                      </body>
                    </html>
                  `);
                }
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
            onClick={() => {
              // Send notification logic
              fetch(`/api/notifications/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: order.id,
                  customerId: order.customerId,
                  type: 'status_update',
                  message: `Your order #${order.id} status has been updated to: ${statusDetails.title}`
                })
              }).then(() => {
                toast({
                  title: 'Notification Sent',
                  description: 'Customer has been notified of the order status update.',
                });
              }).catch(() => {
                toast({
                  title: 'Notification Failed',
                  description: 'Failed to send notification. Please try again.',
                  variant: 'destructive'
                });
              });
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