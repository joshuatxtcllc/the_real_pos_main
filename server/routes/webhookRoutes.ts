import { Router } from 'express';
import { handleKanbanWebhook, handleOrderUpdateWebhook, webhookHealthCheck } from '../controllers/webhookController';

const router = Router();

// Webhook endpoint for Kanban app status updates
router.post('/kanban', handleKanbanWebhook);

// General webhook endpoint for any external system
router.post('/order-update', handleOrderUpdateWebhook);

// Health check endpoint
router.get('/health', webhookHealthCheck);

export default router;