
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

const router = Router();

// Order routes
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.post('/orders', createOrder);
router.patch('/orders/:id', updateOrder);
router.patch('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

// Kanban integration routes
router.post('/orders/:orderId/test-kanban-sync', testKanbanSync);
router.get('/kanban/status', getKanbanStatus);

// Order group routes
router.get('/order-groups', getAllOrderGroups);
router.post('/order-groups', createOrderGroup);

export default router;
