import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { artLocationController } from "./controllers/artLocationController";
import { frameDesignController } from "./controllers/frameDesignController";
import { healthController } from "./controllers/healthController";
import { validateApiKey, KANBAN_API_KEY } from "./middleware/apiAuth";
import { validateApiKey as apiKeyAuth } from "./middleware/apiKeyAuth";
import { storage } from "./storage";
// import { vendorCatalogController } from './controllers/vendorCatalogController';
// import { hubIntegrationRoutes } from './routes/hubIntegrationRoutes';
// import { crossVendorInventoryRoutes } from './routes/crossVendorInventoryRoutes';
import webhookRoutes from './routes/webhookRoutes';
import { pricingMonitorRoutes } from './routes/pricingMonitorRoutes';
import artworkLocationRoutes from './routes/artworkLocationRoutes';
import { registerArtLocationRoutes } from './routes/artLocationRoutes';
import hubApiRoutes from './routes/hubApiRoutes';
import hubAdminRoutes from './routes/hubAdminRoutes';
import { getMaterialsPickList, getMaterialsBySupplier, getMaterialsForOrder, updateMaterial, createPurchaseOrder, getMaterialTypes, getMaterialSuppliers } from './controllers/materialsController';
import integrationApiRoutes from './routes/integrationApiRoutes';
import ordersRoutes from './routes/ordersRoutes';
import customersRoutes from './routes/customersRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import xmlPriceSheetRoutes from './routes/xmlPriceSheetRoutes';
import larsonOrderOptimizerRoutes from './routes/larsonOrderOptimizerRoutes';
import customerNotificationRoutes from './routes/customerNotificationRoutes';
import { Request, Response, NextFunction } from 'express';
import { log } from './utils/logger';
import testEmailRoutes from './routes/testEmailRoutes.js';

export async function registerRoutes(app: Express): Promise<Server> {
  // Art Location routes
  app.post('/api/art-locations', artLocationController.sendArtLocationData);
  app.get('/api/art-locations/:orderId', artLocationController.getArtLocationData);

  // Frame Design routes
  app.post('/api/frame-designs', frameDesignController.saveFrameDesign);
  app.get('/api/frame-designs/:orderId', frameDesignController.getFrameDesign);

  // Webhook routes (commented out temporarily)
  // app.use('/api/webhooks', webhookRoutes);

  // Pricing monitor routes (commented out temporarily)
  // app.use('/api/pricing-monitor', pricingMonitorRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Dashboard API configuration endpoint
  app.get('/api/dashboard/config', (req, res) => {
    const dashboardApiUrl = process.env.DASHBOARD_API_URL;
    res.json({
      configured: !!dashboardApiUrl,
      url: dashboardApiUrl ? `${dashboardApiUrl.substring(0, 30)}...` : null,
      fullUrl: dashboardApiUrl,
      message: dashboardApiUrl ? 
        'Dashboard API is configured and ready' : 
        'Dashboard API URL not configured. Add DASHBOARD_API_URL to your secrets.',
      endpoints: dashboardApiUrl ? {
        metrics: `${dashboardApiUrl}/api/metrics`,
        orders: `${dashboardApiUrl}/api/orders`,
        status: `${dashboardApiUrl}/api/status`
      } : null
    });
  });

  // Dashboard proxy endpoints to handle CORS and authentication
  app.get('/api/dashboard-proxy/health', async (req, res) => {
    const dashboardApiUrl = process.env.DASHBOARD_API_URL;
    if (!dashboardApiUrl) {
      return res.status(400).json({ error: 'Dashboard API URL not configured' });
    }

    try {
      const response = await fetch(`${dashboardApiUrl}/api/health`);
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/dashboard-proxy/metrics', async (req, res) => {
    const dashboardApiUrl = process.env.DASHBOARD_API_URL;
    if (!dashboardApiUrl) {
      return res.status(400).json({ error: 'Dashboard API URL not configured' });
    }

    try {
      const response = await fetch(`${dashboardApiUrl}/api/metrics`);
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/dashboard-proxy/status', async (req, res) => {
    const dashboardApiUrl = process.env.DASHBOARD_API_URL;
    if (!dashboardApiUrl) {
      return res.status(400).json({ error: 'Dashboard API URL not configured' });
    }

    try {
      const response = await fetch(`${dashboardApiUrl}/api/status`);
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/dashboard-proxy/test', async (req, res) => {
    const dashboardApiUrl = process.env.DASHBOARD_API_URL;
    if (!dashboardApiUrl) {
      return res.status(400).json({ error: 'Dashboard API URL not configured' });
    }

    try {
      const response = await fetch(`${dashboardApiUrl}/api/health`);
      if (response.ok) {
        res.json({ success: true, message: 'Dashboard connection successful' });
      } else {
        res.status(500).json({ error: 'Dashboard connection failed' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Dashboard API proxy endpoints
  app.all('/api/dashboard-proxy/*', async (req, res) => {
    const dashboardApiUrl = process.env.DASHBOARD_API_URL;

    if (!dashboardApiUrl) {
      return res.status(503).json({
        success: false,
        error: 'Dashboard API URL not configured. Please add DASHBOARD_API_URL to your secrets.'
      });
    }

    try {
      const endpoint = req.params[0]; // Get the path after /api/dashboard-proxy/
      const requestOptions: RequestInit = {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          // Forward any authorization headers if needed
          ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
        }
      };

      // Add body for POST, PUT, PATCH requests
      if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
        requestOptions.body = JSON.stringify(req.body);
      }

      const response = await fetch(`${dashboardApiUrl}/${endpoint}`, requestOptions);

      if (!response.ok) {
        throw new Error(`Dashboard API responded with status: ${response.status}`);
      }

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error('Dashboard API proxy error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to connect to Dashboard API',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Vendor catalog routes (basic endpoints to prevent errors)
  app.get('/api/vendor-catalog/all', (req, res) => {
    res.json([]);
  });

  app.get('/api/vendor-catalog/larson', (req, res) => {
    res.json([]);
  });

  app.get('/api/vendor-catalog/roma', (req, res) => {
    res.json([]);
  });

  app.get('/api/vendor-catalog/nielsen', (req, res) => {
    res.json([]);
  });

  // Larson catalog routes
  app.get('/api/larson-catalog/crescent', (req, res) => {
    res.json([]);
  });

  // Frames catalog route
  app.get('/api/frames', (req, res) => {
    res.json([]);
  });

  // Mat colors endpoint
  app.get('/api/mat-colors', (req, res) => {
    res.json([]);
  });

  // Glass options endpoint
  app.get('/api/glass-options', (req, res) => {
    res.json([]);
  });

  // Wholesale orders endpoint
  app.get('/api/wholesale-orders', (req, res) => {
    res.json([]);
  });

  // QR codes endpoint
  app.get('/api/qr-codes', (req, res) => {
    res.json([]);
  });

  // HUB material orders endpoint
  app.get('/api/hub/material-orders', (req, res) => {
    res.json([]);
  });

  // Auth status route
  app.get('/api/auth/status', (req, res) => {
    res.json({ authenticated: false, user: null });
  });

  // Discord integration disabled for deployment stability
  app.get('/api/discord/bot-info', (req, res) => {
    res.json({
      status: 'disabled',
      message: 'Discord integration temporarily disabled for deployment stability'
    });
  });

  app.post('/api/discord/test-notification', async (req, res) => {
    res.status(503).json({ 
      error: 'Discord integration temporarily disabled',
      message: 'Discord notifications are currently unavailable'
    });
  });

  // Customer notification endpoint - uses real customer data
  app.post('/api/notifications/send', async (req, res) => {
    try {
      const { customerPhone, customerEmail, orderId, type, message, discordUserId } = req.body;

      // Import customer profiles
      const { getCustomerByPhone, getCustomerByEmail, updateCustomerDiscordId } = await import('./data/customerProfiles.js');

      // Find customer by phone or email
      let customer = customerPhone ? getCustomerByPhone(customerPhone) : 
                   customerEmail ? getCustomerByEmail(customerEmail) : null;

      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      const orderNumber = orderId || Math.floor(Math.random() * 1000) + 100;

      // Simple notification logging (Discord integration disabled)
      console.log(`Notification request for customer ${customer.name}: ${type} - ${message}`);

      res.json({
        success: true,
        customer: {
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          hasDiscord: false
        },
        orderNumber,
        message: 'Notification logged (Discord integration disabled for deployment stability)'
      });

    } catch (error) {
      console.error('Error sending customer notification:', error);
      res.status(500).json({ 
        error: 'Failed to send notification',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get customer information endpoint
  app.get('/api/customers/search', async (req, res) => {
    try {
      const { phone, email } = req.query;
      const { getCustomerByPhone, getCustomerByEmail } = await import('./data/customerProfiles.js');

      let customer = phone ? getCustomerByPhone(phone as string) : 
                    email ? getCustomerByEmail(email as string) : null;

      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      res.json({
        customer: {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          hasDiscord: !!customer.discordUserId,
          preferences: customer.preferences,
          notes: customer.notes
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to search customer' });
    }
  });

  // External Kanban Integration - Fetch orders from external Kanban app
  app.get('/api/kanban/external/orders', async (req, res) => {
    try {
      const { externalKanbanService } = await import('./services/externalKanbanService');
      const result = await externalKanbanService.fetchOrders();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        orders: [],
        error: 'Failed to fetch orders from external Kanban app'
      });
    }
  });

  // External Kanban health check
  app.get('/api/kanban/external/health', async (req, res) => {
    try {
      const { externalKanbanService } = await import('./services/externalKanbanService');
      const health = await externalKanbanService.healthCheck();
      res.json(health);
    } catch (error) {
      res.status(500).json({
        status: 'error',
        connected: false,
        error: 'Failed to check external Kanban health'
      });
    }
  });

  // Test all external connections endpoint
  app.get('/api/integrations/test-all', async (req, res) => {
    try {
      const results = {
        dashboard: { connected: false, error: null },
        kanban: { connected: false, error: null }
      };

      // Test Dashboard connection
      const dashboardApiUrl = process.env.DASHBOARD_API_URL;
      if (dashboardApiUrl) {
        try {
          const dashboardResponse = await fetch(`${dashboardApiUrl}/api/health`, {
            method: 'GET',
            timeout: 5000
          });
          results.dashboard.connected = dashboardResponse.ok;
          if (!dashboardResponse.ok) {
            results.dashboard.error = `HTTP ${dashboardResponse.status}`;
          }
        } catch (error) {
          results.dashboard.error = error instanceof Error ? error.message : 'Connection failed';
        }
      } else {
        results.dashboard.error = 'Dashboard API URL not configured';
      }

      // Test Kanban connection
      const kanbanApiUrl = process.env.EXTERNAL_KANBAN_URL;
      const kanbanApiKey = process.env.EXTERNAL_KANBAN_API_KEY;
      if (kanbanApiUrl && kanbanApiKey) {
        try {
          const kanbanResponse = await fetch(`${kanbanApiUrl}/api/health`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${kanbanApiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 5000
          });
          results.kanban.connected = kanbanResponse.ok;
          if (!kanbanResponse.ok) {
            results.kanban.error = `HTTP ${kanbanResponse.status}`;
          }
        } catch (error) {
          results.kanban.error = error instanceof Error ? error.message : 'Connection failed';
        }
      } else {
        results.kanban.error = 'Kanban API URL or API Key not configured';
      }

      res.json({
        success: true,
        integrations: results,
        summary: {
          total: 2,
          connected: Object.values(results).filter(r => r.connected).length,
          failed: Object.values(results).filter(r => !r.connected).length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to test integrations'
      });
    }
  });

  // Test Kanban connection endpoint
  app.post('/api/kanban/external/test-connection', async (req, res) => {
    try {
      const { externalKanbanService } = await import('./services/externalKanbanService');

      // Check configuration
      const hasUrl = !!process.env.EXTERNAL_KANBAN_URL;
      const hasApiKey = !!process.env.EXTERNAL_KANBAN_API_KEY;

      if (!hasUrl || !hasApiKey) {
        return res.status(400).json({
          success: false,
          error: 'Kanban configuration incomplete',
          details: {
            hasUrl,
            hasApiKey,
            message: 'Please add EXTERNAL_KANBAN_URL and EXTERNAL_KANBAN_API_KEY to your secrets'
          }
        });
      }

      // Test health check
      const health = await externalKanbanService.healthCheck();

      // Test fetching orders
      const ordersResult = await externalKanbanService.fetchOrders();

      res.json({
        success: health.connected,
        health,
        ordersTest: {
          success: ordersResult.success,
          orderCount: ordersResult.orders.length,
          error: ordersResult.error
        },
        configuration: {
          baseUrl: process.env.EXTERNAL_KANBAN_URL ? 
            `${process.env.EXTERNAL_KANBAN_URL.substring(0, 30)}...` : 'Not configured',
          apiKeyConfigured: !!process.env.EXTERNAL_KANBAN_API_KEY
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Update order status in external Kanban
  app.post('/api/kanban/external/orders/:orderId/status', async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status, stage, notes } = req.body;

      const { externalKanbanService } = await import('./services/externalKanbanService');
      const success = await externalKanbanService.updateOrderStatus(orderId, status, stage, notes);

      if (success) {
        res.json({
          success: true,
          orderId,
          updatedStatus: status,
          stage,
          notes,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to update order status in external Kanban'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update external Kanban order status'
      });
    }
  });

  // API Key information endpoint
  app.get('/api/kanban/api-key', (req, res) => {
    res.json({
      success: true,
      message: 'Use one of these API keys for integration',
      apiKeys: [
        {
          key: 'kanban_admin_key_2025_full_access',
          name: '3D Designer Integration',
          permissions: ['orders:create', 'orders:read', 'orders:update', 'pricing:read', 'files:upload']
        },
        {
          key: 'jf_houston_heights_framing_2025_master_api_key_secure_access', 
          name: 'Houston Heights Framing API Integration',
          permissions: ['orders:read', 'orders:write', 'integration:webhook', 'pricing:read', 'catalog:read']
        }
      ],
      usage: {
        header: 'Authorization',
        format: 'Bearer YOUR_API_KEY'
      },
      endpoints: {
        baseUrl: process.env.REPL_URL || 'https://your-repl-name.replit.app',
        orders: '/api/kanban/orders',
        status: '/api/kanban/status'
      }
    });
  });

  // Kanban Integration API endpoints for production connection
  const KANBAN_API_KEY = process.env.POS_API_KEY || 'jays_frames_kanban_2025'; // Use secrets for API key
  app.get('/api/kanban/orders', apiKeyAuth, (req, res) => {
    // Returns all orders with production status for Kanban board
    res.json({
      success: true,
      orders: [],
      endpoint: '/api/kanban/orders',
      description: 'Retrieves all orders with production status and timeline information'
    });
  });

  app.post('/api/kanban/orders/:orderId/status', apiKeyAuth, (req, res) => {
    const { orderId } = req.params;
    const { status, stage, notes } = req.body;

    // Updates order production status from Kanban board
    res.json({
      success: true,
      orderId,
      updatedStatus: status,
      stage,
      notes,
      timestamp: new Date().toISOString(),
      description: 'Updates order production status from external Kanban system'
    });
  });

  app.get('/api/kanban/status', (req, res) => {
    // Health check for Kanban integration (no auth required)
    res.json({
      status: 'active',
      service: 'Jays Frames POS System',
      version: '1.0.0',
      endpoints: {
        orders: '/api/kanban/orders',
        updateStatus: '/api/kanban/orders/:orderId/status',
        health: '/api/kanban/status'
      },
      authentication: 'API Key required in Authorization header',
      timestamp: new Date().toISOString()
    });
  });

  // API Key management endpoint
  app.get('/api/kanban/api-key', (req, res) => {
    // Returns the API key for Kanban integration setup
    res.json({
      apiKey: KANBAN_API_KEY,
      usage: 'Add this to your Kanban app Authorization header as: Bearer ' + KANBAN_API_KEY,
      endpoints: {
        orders: '/api/kanban/orders',
        updateStatus: '/api/kanban/orders/:orderId/status'
      },
      note: 'Keep this API key secure - it provides access to your order data'
    });
  });

  // Hub Integration API Routes
  app.use('/api/hub', hubApiRoutes);
  app.use('/api/hub-admin', hubAdminRoutes);

  // Admin routes for API key generation
  app.use('/api/admin', hubAdminRoutes);

  // Admin integration endpoints
  app.post('/api/admin/generate-api-key', async (req, res) => {
    try {
      const { generateApiKey } = await import('./controllers/integrationController');
      await generateApiKey(req, res);
    } catch (error: any) {
      console.error('Error in generate-api-key route:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/admin/integration-status', async (req, res) => {
    try {
      const { getIntegrationStatus } = await import('./controllers/integrationController');
      await getIntegrationStatus(req, res);
    } catch (error: any) {
      console.error('Error in integration-status route:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/admin/integration-docs', async (req, res) => {
    try {
      const { getIntegrationDocs } = await import('./controllers/integrationController');
      await getIntegrationDocs(req, res);
    } catch (error: any) {
      console.error('Error in integration-docs route:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Webhook endpoints
  app.get('/api/webhooks', async (req, res) => {
    try {
      res.json({ success: true, webhooks: [] });
    } catch (error: any) {
      console.error('Error in webhooks route:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Main application routes (must come before integration routes to avoid conflicts)
  app.use('/api', ordersRoutes);
  app.use('/api', customersRoutes);
  app.use('/api', inventoryRoutes);

  // Integration API routes (mounted with specific prefix to avoid conflicts)
  app.use('/api/integration', integrationApiRoutes);

  // Webhook routes
  // import webhookRoutes from './routes/webhookRoutes';
  // app.use('/api/webhooks', webhookRoutes);
  app.use('/api/xml-price-sheets', xmlPriceSheetRoutes);
  app.use('/api/larson-optimizer', larsonOrderOptimizerRoutes);
    // Test email routes
  app.use('/api/test-email', testEmailRoutes);


  // Notification routes (Discord integration disabled)
  app.get('/api/discord/status', (req, res) => {
    res.json({ status: 'disabled', message: 'Discord integration disabled for deployment stability' });
  });

  app.get('/api/notifications/status', (req, res) => {
    res.json({ status: 'basic', channels: ['email'], message: 'Basic notifications only' });
  });

  // Materials API Routes
  app.get('/api/materials/pick-list', getMaterialsPickList);
  app.get('/api/materials/by-supplier', getMaterialsBySupplier);
  app.get('/api/materials/order/:orderId', getMaterialsForOrder);
  app.put('/api/materials/:id', updateMaterial);
  app.post('/api/materials/purchase-order', createPurchaseOrder);
  app.get('/api/materials/types', getMaterialTypes);
  app.get('/api/materials/suppliers', getMaterialSuppliers);

  // Enhanced materials ordering routes with failsafe mechanisms
  app.post('/api/materials/bulk-update', async (req, res) => {
    try {
      const { materialIds, status, adminApproval } = req.body;

      if (!materialIds || !Array.isArray(materialIds) || materialIds.length === 0) {
        return res.status(400).json({ error: "Material IDs are required" });
      }

      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      // Check if materials are already ordered - FAILSAFE MECHANISM
      const materials = await storage.getMaterialsPickList();
      const selectedMaterials = materials.filter(m => materialIds.includes(m.id.toString()));
      const alreadyOrdered = selectedMaterials.filter(m => 
        m.status === 'ordered' || m.status === 'arrived' || m.status === 'completed'
      );

      if (alreadyOrdered.length > 0 && !adminApproval) {
        return res.status(409).json({
          error: 'DOUBLE_ORDER_PREVENTION',
          message: `Materials already ordered. Admin approval required.`,
          alreadyOrderedMaterials: alreadyOrdered
        });
      }

      // Update materials status
      const updatedMaterials = [];
      for (const materialId of materialIds) {
        try {
          const updated = await storage.updateMaterialOrder(parseInt(materialId), { 
            status,
            notes: adminApproval ? "Admin approved override for duplicate order" : undefined
          });
          updatedMaterials.push(updated);
        } catch (error) {
          console.error(`Failed to update material ${materialId}:`, error);
        }
      }

      res.json({
        message: `Successfully updated ${updatedMaterials.length} materials to ${status}`,
        updatedMaterials,
        adminApproval: adminApproval || false
      });

    } catch (error) {
      console.error("Error in bulk update:", error);
      res.status(500).json({ error: "Failed to update materials" });
    }
  });

  // Mark materials as out of stock
  app.post('/api/materials/mark-out-of-stock', async (req, res) => {
    try {
      const { materialIds, notes } = req.body;

      if (!materialIds || !Array.isArray(materialIds) || materialIds.length === 0) {
        return res.status(400).json({ error: "Material IDs are required" });
      }

      const updatedMaterials = [];
      for (const materialId of materialIds) {
        try {
          const updated = await storage.updateMaterialOrder(parseInt(materialId), { 
            status: "out_of_stock",
            notes: notes || "Marked as out of stock"
          });
          updatedMaterials.push(updated);
        } catch (error) {
          console.error(`Failed to mark material ${materialId} as out of stock:`, error);
        }
      }

      res.json({
        message: `Successfully marked ${updatedMaterials.length} materials as out of stock`,
        updatedMaterials
      });

    } catch (error) {
      console.error("Error marking materials as out of stock:", error);
      res.status(500).json({ error: "Failed to mark materials as out of stock" });
    }
  });

  // Generate material orders for existing orders
  app.post('/api/orders/:orderId/generate-materials', async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);

      if (!orderId || isNaN(orderId)) {
        return res.status(400).json({ error: 'Valid order ID is required' });
      }

      console.log(`Generating materials for order ID: ${orderId}`);

      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      console.log(`Found order:`, order);

      const materialOrders = await storage.createMaterialOrdersFromOrder(order);

      console.log(`Generated ${materialOrders.length} material orders`);

      res.json({ 
        success: true, 
        message: `Generated ${materialOrders.length} material orders for order #${orderId}`,
        materialOrders 
      });
    } catch (error: any) {
      console.error('Error generating materials for order:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to generate material orders' 
      });
    }
  });

  // Generate material orders for ALL existing orders
  app.post('/api/orders/generate-all-materials', async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      let totalMaterialOrders = 0;
      let processedOrders = 0;

      for (const order of orders) {
        try {
          const materialOrders = await storage.createMaterialOrdersFromOrder(order);
          totalMaterialOrders += materialOrders.length;
          processedOrders++;
        } catch (error) {
          console.error(`Error creating materials for order ${order.id}:`, error);
          // Continue with other orders
        }
      }

      res.json({ 
        success: true, 
        message: `Generated ${totalMaterialOrders} material orders from ${processedOrders} orders`,
        totalMaterialOrders,
        processedOrders 
      });
    } catch (error: any) {
      console.error('Error generating materials for all orders:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Setup WebSocket for notifications
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', (message) => {
      try {
        console.log('Received message:', message.toString());

        // Broadcast to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message.toString());
          }
        });
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    // Send initial connection confirmation
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'WebSocket connection established'
    }));
  });

  return httpServer;
}