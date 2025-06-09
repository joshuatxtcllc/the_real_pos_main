import { Request, Response } from 'express';
import crypto from 'crypto';
import { storage } from '../storage';

/**
 * Generate API key for hub integration
 */
export async function generateHubApiKey(req: Request, res: Response) {
  try {
    // Set content type header to ensure JSON response
    res.setHeader('Content-Type', 'application/json');

    // Generate a unique API key
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const apiKey = `hub_${timestamp}_${randomString}`;

    console.log('Hub API Key generated:', apiKey);

    const response = {
      success: true,
      apiKey,
      createdAt: new Date().toISOString(),
      permissions: ['hub:read', 'hub:write', 'orders:sync'],
      message: 'Hub API key generated successfully'
    };

    return res.status(200).json(response);
  } catch (error: any) {
    console.error('Error generating Hub API key:', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate API key'
    });
  }
}

/**
 * Get hub connection information
 */
export async function getHubConnectionInfo(req: Request, res: Response) {
  try {
    const baseUrl = process.env.REPL_URL || 'https://your-repl-url.replit.dev';

    res.json({
      success: true,
      connectionInfo: {
        baseUrl: baseUrl,
        endpoints: {
          getAllOrders: `${baseUrl}/api/hub/orders`,
          getOrder: `${baseUrl}/api/hub/orders/:id`,
          updateOrderStatus: `${baseUrl}/api/hub/orders/:id/status`,
          getMaterialOrders: `${baseUrl}/api/hub/materials`,
          webhook: `${baseUrl}/api/hub/webhook`,
          status: `${baseUrl}/api/hub/status`
        },
        authentication: {
          method: 'Bearer Token',
          header: 'Authorization',
          note: 'Use the API key generated from /api/admin/generate-hub-key'
        },
        webhookEvents: [
          'order.status_changed',
          'material.status_changed'
        ]
      }
    });
  } catch (error: any) {
    console.error('Error getting hub connection info:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to get connection info' 
    });
  }
}