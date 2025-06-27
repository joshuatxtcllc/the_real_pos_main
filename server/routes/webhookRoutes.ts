import { Router } from 'express';
import { handleKanbanWebhook, handleOrderUpdateWebhook, webhookHealthCheck, handleStripeWebhook } from '../controllers/webhookController';
import express from 'express';

const router = Router();

// Stripe webhook endpoint (needs raw body for signature verification)
router.post('/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Webhook endpoint for Kanban app status updates
router.post('/kanban', handleKanbanWebhook);

// General webhook endpoint for any external system
router.post('/order-update', handleOrderUpdateWebhook);

// Health check endpoint
router.get('/health', webhookHealthCheck);

export default router;