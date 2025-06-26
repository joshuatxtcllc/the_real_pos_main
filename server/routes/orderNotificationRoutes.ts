import { Router } from 'express';
import { orderNotificationController } from '../controllers/orderNotificationController';

const router = Router();

// Trigger a notification for a specific order event
router.post('/trigger', orderNotificationController.triggerNotification.bind(orderNotificationController));

// Schedule a delayed notification
router.post('/schedule', orderNotificationController.scheduleNotification.bind(orderNotificationController));

// Send bulk notifications for multiple orders
router.post('/bulk', orderNotificationController.sendBulkNotifications.bind(orderNotificationController));

// Check for overdue orders and send reminders
router.post('/check-overdue', orderNotificationController.checkOverdueOrders.bind(orderNotificationController));

// Get notification configuration and status
router.get('/status', orderNotificationController.getNotificationStatus.bind(orderNotificationController));

// Test notification with sample data
router.post('/test', orderNotificationController.testNotification.bind(orderNotificationController));

export default router;