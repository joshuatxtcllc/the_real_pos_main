
import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getAllOrderGroups,
  createOrderGroup,
  testKanbanSync,
  getKanbanStatus
} from '../controllers/ordersController';
import { storage } from '../storage';

const router = Router();

// Order routes
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.post('/orders', createOrder);
router.patch('/orders/:id', updateOrder);
router.patch('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

// Customer notification route
router.post('/orders/:id/send-update', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await storage.getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (!order.customerId) {
      return res.status(400).json({ success: false, error: 'Order has no customer' });
    }
    
    const customer = await storage.getCustomer(order.customerId);
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    // Create notification record
    await storage.createCustomerNotification({
      customerId: customer.id,
      orderId: order.id,
      notificationType: 'status_update',
      channel: 'email',
      subject: `Order #${order.id} Update`,
      message: `Your order is currently ${order.productionStatus.replace('_', ' ')}. We'll keep you updated on the progress.`,
      successful: true
    });

    res.json({ 
      success: true, 
      message: 'Customer notification sent successfully' 
    });
  } catch (error: any) {
    console.error('Error sending customer update:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to send customer update' 
    });
  }
});

// Kanban integration routes
router.post('/orders/:orderId/test-kanban-sync', testKanbanSync);
router.get('/kanban/status', getKanbanStatus);

// Order group routes
router.get('/order-groups', getAllOrderGroups);
router.post('/order-groups', createOrderGroup);

export default router;
