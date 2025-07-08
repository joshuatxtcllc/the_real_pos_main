// Fixed production server with working database connection
import express from 'express';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

neonConfig.webSocketConstructor = ws;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'dist/public')));

// Database connection with proper configuration
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool.query('SELECT 1 as test').then(() => {
  console.log('✓ Database connection successful');
}).catch(err => {
  console.error('✗ Database connection failed:', err);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Orders endpoint with working database connection
app.get('/api/orders', async (req, res) => {
  try {
    console.log('OrdersController: Fetching all orders from database...');
    
    const ordersResult = await pool.query(`
      SELECT 
        o.*,
        c.name as customer_name,
        c.email as customer_email,
        c.phone as customer_phone
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
    `);
    
    console.log('OrdersController: Found', ordersResult.rows.length, 'orders');
    
    const orders = ordersResult.rows.map(row => ({
      ...row,
      customer: row.customer_name ? {
        id: row.customer_id,
        name: row.customer_name,
        email: row.customer_email,
        phone: row.customer_phone
      } : null,
      id: parseInt(row.id),
      customerId: parseInt(row.customer_id),
      artworkWidth: parseFloat(row.artwork_width) || 0,
      artworkHeight: parseFloat(row.artwork_height) || 0,
      total: row.total || '0.00'
    }));
    
    res.json({ 
      success: true, 
      orders: orders,
      source: 'fixed_production_server',
      count: orders.length
    });
    
  } catch (error) {
    console.error('OrdersController: Error fetching orders:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      orders: [],
      count: 0
    });
  }
});

// Customers endpoint
app.get('/api/customers', async (req, res) => {
  try {
    const customersResult = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
    
    res.json({
      success: true,
      customers: customersResult.rows,
      count: customersResult.rows.length
    });
    
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      customers: [],
      count: 0
    });
  }
});

// Create order endpoint (no payment required)
app.post('/api/orders', async (req, res) => {
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

    // Set default values
    orderData.artworkImage = orderData.artworkImage || 'placeholder-image.jpg';
    orderData.matWidth = orderData.matWidth || '2';
    orderData.status = orderData.status || 'pending'; // No payment required

    // Insert order into database
    const insertResult = await pool.query(`
      INSERT INTO orders (
        customer_id, artwork_width, artwork_height, artwork_image, 
        mat_width, status, total, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `, [
      orderData.customerId,
      orderData.artworkWidth,
      orderData.artworkHeight,
      orderData.artworkImage,
      orderData.matWidth,
      orderData.status,
      orderData.total || '0.00'
    ]);

    const order = insertResult.rows[0];
    console.log('Order created successfully:', order);

    res.status(201).json({ 
      success: true, 
      order,
      message: 'Order saved successfully without payment requirement',
      orderId: order.id
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to create order'
    });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Fixed production server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database URL configured: ${!!process.env.DATABASE_URL}`);
});