import { Request, Response } from 'express';
import { storage } from '../storage';
import axios from 'axios';

// Kanban app configuration
const KANBAN_API_URL = process.env.KANBAN_API_URL || 'https://kanban-app-url.replit.app';
const KANBAN_API_KEY = process.env.KANBAN_API_KEY;

// Function to sync new order to Kanban app
async function syncOrderToKanban(order: any) {
  try {
    if (!KANBAN_API_KEY || !KANBAN_API_URL) {
      console.log('Kanban integration not configured, skipping sync');
      return;
    }

    const kanbanOrder = {
      orderId: order.id,
      customerName: order.customerName || 'Unknown Customer',
      artworkTitle: order.artworkDescription,
      frameSize: `${order.artworkWidth}x${order.artworkHeight}`,
      status: order.productionStatus || 'order_processed',
      stage: 'pending',
      priority: 'standard',
      dueDate: order.dueDate,
      createdAt: order.createdAt,
      estimatedCompletion: order.estimatedCompletionDays ? 
        new Date(Date.now() + (order.estimatedCompletionDays * 24 * 60 * 60 * 1000)).toISOString() : null,
      materials: {
        frameType: order.frameId || 'Unknown',
        matColor: order.matColorId || 'White',
        glass: order.glassOptionId || 'Regular'
      }
    };

    const response = await axios.post(`${KANBAN_API_URL}/api/orders`, kanbanOrder, {
      headers: {
        'Authorization': `Bearer ${KANBAN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });

    if (response.data && response.data.success) {
      console.log(`Order ${order.id} synced to Kanban successfully`);
    }
  } catch (error: any) {
    console.error(`Failed to sync order ${order.id} to Kanban:`, error.message);
  }
}

// Function to update order status in Kanban app
async function updateKanbanOrderStatus(orderId: number, status: string, notes?: string) {
  try {
    if (!KANBAN_API_KEY || !KANBAN_API_URL) {
      console.log('Kanban integration not configured, skipping status update');
      return;
    }

    const response = await axios.post(`${KANBAN_API_URL}/api/orders/${orderId}/status`, {
      status,
      stage: status,
      notes: notes || `Status updated to ${status}`,
      updatedBy: 'Jays Frames POS',
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Authorization': `Bearer ${KANBAN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });

    if (response.data && response.data.success) {
      console.log(`Order ${orderId} status updated in Kanban to ${status}`);
    }
  } catch (error: any) {
    console.error(`Failed to update order ${orderId} status in Kanban:`, error.message);
  }
}

async function fetchOrdersFromKanban() {
  try {
    if (!KANBAN_API_KEY) {
      console.log('No Kanban API key found, using local storage');
      return null;
    }

    const response = await axios.get(`${KANBAN_API_URL}/api/orders`, {
      headers: {
        'Authorization': `Bearer ${KANBAN_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000 // 5 second timeout
    });

    if (response.data && response.data.success) {
      return response.data.orders;
    }
    return null;
  } catch (error: any) {
    console.error('Failed to fetch orders from Kanban app:', error.message);
    return null;
  }
}

export async function getAllOrders(req: Request, res: Response) {
  try {
    console.log('getAllOrders called');
    
    // Always try local storage first for reliability
    const localOrders = await storage.getAllOrders();
    console.log('Local orders found:', localOrders.length);
    
    if (localOrders && localOrders.length > 0) {
      res.json({ 
        success: true, 
        orders: localOrders,
        source: 'local',
        count: localOrders.length
      });
      return;
    }

    // Try to fetch from Kanban app as fallback
    const kanbanOrders = await fetchOrdersFromKanban();

    if (kanbanOrders && kanbanOrders.length > 0) {
      console.log(`Fetched ${kanbanOrders.length} orders from Kanban app`);

      // Transform Kanban orders to our format
      const transformedOrders = kanbanOrders.map((order: any) => ({
        id: order.orderId || order.id,
        customerId: order.customerId || null,
        customerName: order.customerName,
        customerPhone: order.customerPhone || '',
        customerEmail: order.customerEmail || '',
        artworkDescription: order.artworkTitle,
        artworkWidth: order.frameSize ? parseFloat(order.frameSize.split('x')[0]) : order.artworkWidth,
        artworkHeight: order.frameSize ? parseFloat(order.frameSize.split('x')[1]) : order.artworkHeight,
        frameId: order.materials?.frameType || order.frameId,
        matColorId: order.materials?.matColor || order.matColorId,
        glassOptionId: order.materials?.glass || order.glassOptionId,
        status: order.status || 'pending',
        total: order.totalPrice || 0,
        createdAt: order.createdAt,
        quantity: order.quantity || 1
      }));

      res.json({ 
        success: true, 
        orders: transformedOrders,
        source: 'kanban',
        count: transformedOrders.length
      });
      return;
    }

    // Return empty array if no orders found
    res.json({ 
      success: true, 
      orders: [],
      source: 'local',
      count: 0
    });

  } catch (error: any) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to fetch orders' 
    });
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const order = await storage.getOrder(parseInt(id));
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found' 
      });
    }

    res.json({ 
      success: true, 
      order 
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to fetch order' 
    });
  }
}

export async function createOrder(req: Request, res: Response) {
  try {
    const orderData = req.body;
    console.log('Creating order with data:', orderData);

    // Validate required fields
    if (!orderData.customerId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Customer ID is required' 
      });
    }

    // Ensure all required numeric fields are present
    if (!orderData.artworkWidth || !orderData.artworkHeight) {
      return res.status(400).json({ 
        success: false, 
        error: 'Artwork dimensions are required' 
      });
    }

    // Ensure mat width is provided
    if (!orderData.matWidth) {
      orderData.matWidth = 2; // Default mat width as number
    }

    // Make artwork image optional
    if (!orderData.artworkImagePath) {
      orderData.artworkImagePath = null;
    }

    console.log('Processing order creation...');
    const order = await storage.createOrder(orderData);
    console.log('Order created successfully:', order);
    
    // Sync new order to Kanban app (but don't fail if this fails)
    try {
      await syncOrderToKanban(order);
    } catch (kanbanError) {
      console.warn('Kanban sync failed, but order was created:', kanbanError);
    }
    
    res.status(201).json({ 
      success: true, 
      order,
      message: 'Order created successfully',
      orderId: order.id
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to create order',
      details: error.stack
    });
  }
}

export async function updateOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const order = await storage.updateOrder(parseInt(id), updateData);
    
    // If production status changed, sync to Kanban
    if (updateData.productionStatus) {
      await updateKanbanOrderStatus(parseInt(id), updateData.productionStatus);
    }
    
    res.json({ 
      success: true, 
      order,
      message: 'Order updated successfully' 
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to update order' 
    });
  }
}

// New endpoint specifically for production status updates
export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({ 
        success: false, 
        error: 'Status is required' 
      });
    }

    // Update order in local database
    const order = await storage.updateOrder(parseInt(id), { 
      productionStatus: status,
      lastStatusChange: new Date()
    });
    
    // Sync status update to Kanban app
    await updateKanbanOrderStatus(parseInt(id), status, notes);
    
    res.json({ 
      success: true, 
      order,
      message: `Order status updated to ${status}` 
    });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to update order status' 
    });
  }
}

export async function deleteOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    await storage.deleteOrder(parseInt(id));
    
    res.json({ 
      success: true, 
      message: 'Order deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to delete order' 
    });
  }
}

// Test endpoint to verify Kanban synchronization
export async function testKanbanSync(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    
    if (!KANBAN_API_KEY || !KANBAN_API_URL) {
      return res.json({
        success: false,
        error: 'Kanban integration not configured',
        config: {
          hasApiKey: !!KANBAN_API_KEY,
          hasApiUrl: !!KANBAN_API_URL,
          apiUrl: KANBAN_API_URL
        }
      });
    }

    // Get order from local database
    const order = await storage.getOrder(parseInt(orderId));
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Test sync to Kanban
    await syncOrderToKanban(order);
    
    res.json({
      success: true,
      message: `Order ${orderId} synced to Kanban successfully`,
      order: {
        id: order.id,
        status: order.productionStatus,
        kanbanUrl: KANBAN_API_URL
      }
    });
  } catch (error: any) {
    console.error('Error testing Kanban sync:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to test Kanban sync'
    });
  }
}

// Get Kanban configuration status
export async function getKanbanStatus(req: Request, res: Response) {
  try {
    res.json({
      success: true,
      status: {
        configured: !!(KANBAN_API_KEY && KANBAN_API_URL),
        apiUrl: KANBAN_API_URL,
        hasApiKey: !!KANBAN_API_KEY,
        endpoints: {
          orders: `${KANBAN_API_URL}/api/orders`,
          statusUpdate: `${KANBAN_API_URL}/api/orders/:id/status`
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get Kanban status'
    });
  }
}

// Debug endpoint to check storage state
export async function getStorageDebug(req: Request, res: Response) {
  try {
    const allOrders = await storage.getAllOrders();
    const allCustomers = await storage.getAllCustomers();
    
    res.json({
      success: true,
      debug: {
        ordersCount: allOrders.length,
        customersCount: allCustomers.length,
        orders: allOrders,
        storageFilePath: './storage.json'
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get storage debug info'
    });
  }
}

export async function getAllOrderGroups(req: Request, res: Response) {
  try {
    const orderGroups = await storage.getAllOrderGroups();
    
    res.json({ 
      success: true, 
      orderGroups,
      count: orderGroups.length 
    });
  } catch (error: any) {
    console.error('Error fetching order groups:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to fetch order groups' 
    });
  }
}

export async function createOrderGroup(req: Request, res: Response) {
  try {
    const orderGroupData = req.body;
    
    const orderGroup = await storage.createOrderGroup(orderGroupData);
    
    res.status(201).json({ 
      success: true, 
      orderGroup,
      message: 'Order group created successfully' 
    });
  } catch (error: any) {
    console.error('Error creating order group:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to create order group' 
    });
  }
}