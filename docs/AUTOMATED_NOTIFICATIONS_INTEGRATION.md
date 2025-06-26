# Automated Notifications Integration Guide

## Overview
Your automated notification system is now fully integrated into the order workflow and triggers voice calls at key points in the order lifecycle.

## Integration Points

### 1. Order Creation (ACTIVE)
**Location**: `server/controllers/ordersController.ts` - `createOrder` function
**Trigger**: When a new order is successfully created
**Notification Type**: `order_placed`
**Customer Message**: Professional voice call confirming order placement with estimated completion time

```typescript
// Automatically triggered when order is created
await orderNotificationService.handleOrderEvent({
  orderId: order.id.toString(),
  orderNumber: `ORD-${order.id}`,
  customerName: customer.name,
  customerPhone: customer.phone,
  eventType: 'order_placed',
  metadata: {
    estimatedCompletion: '7-10 days'
  }
});
```

### 2. Order Status Updates (ACTIVE)
**Location**: `server/controllers/ordersController.ts` - `updateOrderStatus` function
**Trigger**: When order production status changes
**Notification Types**: 
- `production_started` - When order moves to 'in_production'
- `frame_cut` - When frame cutting is complete
- `mat_cut` - When mat cutting is complete  
- `assembly_complete` - When assembly is finished
- `ready_for_pickup` - When order is ready for customer pickup

```typescript
// Status mapping for automated notifications
switch (status) {
  case 'in_production': eventType = 'production_started'; break;
  case 'frame_cut': eventType = 'frame_cut'; break;
  case 'mat_cut': eventType = 'mat_cut'; break;
  case 'assembly_complete': eventType = 'assembly_complete'; break;
  case 'ready_for_pickup': eventType = 'ready_for_pickup'; break;
}
```

## How to Use

### Automatic Triggers
The system automatically sends notifications when:

1. **New Order Created**: Customer receives confirmation call
2. **Status Changes**: Customer gets progress updates
3. **Order Ready**: Customer notified when pickup is available

### Manual Triggers
Access `/automated-notifications` to:
- Send immediate notifications for any order
- Schedule delayed notifications
- Send bulk notifications to multiple orders
- Test the system with your phone number

### API Integration
Any system can trigger notifications via REST API:

```bash
# Trigger immediate notification
curl -X POST http://localhost:5000/api/order-notifications/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "123",
    "orderNumber": "ORD-123", 
    "customerName": "John Doe",
    "customerPhone": "+1234567890",
    "eventType": "ready_for_pickup"
  }'

# Schedule delayed notification
curl -X POST http://localhost:5000/api/order-notifications/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "123",
    "orderNumber": "ORD-123",
    "customerName": "John Doe", 
    "customerPhone": "+1234567890",
    "eventType": "payment_due",
    "delayMinutes": 1440
  }'
```

## Voice Messages

### Order Placed
"Hello [CustomerName], this is Jay's Frames calling to confirm we received your custom framing order [OrderNumber]. Your order is now in our system and we estimate completion in [EstimatedCompletion]. We'll keep you updated on progress. Thank you for choosing Jay's Frames!"

### Production Started  
"Hello [CustomerName], this is Jay's Frames with an update on order [OrderNumber]. We've started production on your custom frame and are making great progress. We'll notify you when it's ready for pickup. Thank you!"

### Ready for Pickup
"Hello [CustomerName], great news! Your custom framing order [OrderNumber] is now complete and ready for pickup at Jay's Frames. Please call us to schedule your pickup time. Thank you!"

### Payment Reminders
"Hello [CustomerName], this is Jay's Frames calling about order [OrderNumber]. We wanted to remind you that payment is due for your custom framing order. Please contact us at your earliest convenience. Thank you!"

## Configuration

### Required Environment Variables
- `TWILIO_ACCOUNT_SID`: Your Twilio account identifier
- `TWILIO_AUTH_TOKEN`: Your Twilio authentication token  
- `TWILIO_PHONE_NUMBER`: Your Twilio phone number for outbound calls

### Phone Number Format
The system automatically formats phone numbers to E.164 format:
- Input: "(555) 123-4567" → Output: "+15551234567"
- Input: "555.123.4567" → Output: "+15551234567"
- Input: "5551234567" → Output: "+15551234567"

## Error Handling

The notification system is designed to never interrupt your core business operations:

1. **Graceful Degradation**: If notifications fail, orders still process normally
2. **Retry Logic**: Failed calls are logged but don't block order workflow
3. **Validation**: Invalid phone numbers are detected and skipped
4. **Logging**: All notification attempts are logged for debugging

## Monitoring

Check notification status:
- Visit `/automated-notifications` for system status
- Check server logs for notification attempts
- Use the test functionality to verify Twilio integration

## Next Steps

To add payment notifications, integrate with your payment system:

```typescript
// After payment received
await orderNotificationService.handleOrderEvent({
  orderId: order.id.toString(),
  orderNumber: `ORD-${order.id}`,
  customerName: customer.name,
  customerPhone: customer.phone,
  eventType: 'payment_received',
  metadata: {
    amount: paymentAmount
  }
});
```

## Troubleshooting

### No Notifications Sent
1. Check Twilio credentials in environment variables
2. Verify customer has valid phone number
3. Check server logs for error messages
4. Test with `/automated-notifications` interface

### Call Quality Issues  
1. Ensure stable internet connection
2. Check Twilio account status
3. Verify phone number format
4. Test with different phone numbers

The automated notification system is now fully operational and integrated into your order workflow. Customers will automatically receive professional voice notifications at key points in their order journey.