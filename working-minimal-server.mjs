// Minimal working server for automated cost estimator
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

// Database connection
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

console.log('Starting minimal server...');

// Test connection
pool.query('SELECT 1 as test').then(() => {
  console.log('✓ Database connection successful');
}).catch(err => {
  console.error('✗ Database connection failed:', err);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mock data for development
const mockFrames = [
  { id: 'frame-1', name: 'Classic Gold Frame', price: '12.50', material: 'Wood', manufacturer: 'Larson-Juhl', color: '#D4AF37' },
  { id: 'frame-2', name: 'Modern Silver Frame', price: '8.75', material: 'Metal', manufacturer: 'Larson-Juhl', color: '#C0C0C0' },
  { id: 'frame-3', name: 'Rustic Oak Frame', price: '15.00', material: 'Wood', manufacturer: 'Larson-Juhl', color: '#8B4513' },
  { id: 'frame-4', name: 'Black Contemporary', price: '10.25', material: 'Metal', manufacturer: 'Larson-Juhl', color: '#000000' },
  { id: 'frame-5', name: 'White Traditional', price: '9.50', material: 'Wood', manufacturer: 'Larson-Juhl', color: '#FFFFFF' }
];

const mockMatColors = [
  { id: 'mat-1', name: 'Antique White', color: '#FAEBD7', price: '0.12', category: 'Neutral' },
  { id: 'mat-2', name: 'Cream White', color: '#F5F5DC', price: '0.12', category: 'Neutral' },
  { id: 'mat-3', name: 'Navy Blue', color: '#000080', price: '0.15', category: 'Color' },
  { id: 'mat-4', name: 'Forest Green', color: '#228B22', price: '0.15', category: 'Color' },
  { id: 'mat-5', name: 'Charcoal Gray', color: '#36454F', price: '0.13', category: 'Neutral' }
];

const mockGlassOptions = [
  { id: 'glass-1', name: 'Standard Glass', price: '0.08', description: 'Basic clear glass protection' },
  { id: 'glass-2', name: 'UV Protection Glass', price: '0.15', description: 'Blocks 99% UV rays' },
  { id: 'glass-3', name: 'Non-Glare Glass', price: '0.18', description: 'Reduces reflections' },
  { id: 'glass-4', name: 'Museum Glass', price: '0.35', description: 'Premium UV protection with clarity' }
];

// API endpoints
app.get('/api/frames', async (req, res) => {
  try {
    // Try database first
    const result = await pool.query('SELECT * FROM frames LIMIT 20');
    if (result.rows.length > 0) {
      res.json({ success: true, frames: result.rows });
    } else {
      // Fallback to mock data
      res.json({ success: true, frames: mockFrames, source: 'mock' });
    }
  } catch (error) {
    console.error('Error fetching frames:', error);
    res.json({ success: true, frames: mockFrames, source: 'mock_fallback' });
  }
});

app.get('/api/mat-colors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mat_colors LIMIT 20');
    if (result.rows.length > 0) {
      res.json({ success: true, matColors: result.rows });
    } else {
      res.json({ success: true, matColors: mockMatColors, source: 'mock' });
    }
  } catch (error) {
    console.error('Error fetching mat colors:', error);
    res.json({ success: true, matColors: mockMatColors, source: 'mock_fallback' });
  }
});

app.get('/api/glass-options', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM glass_options LIMIT 10');
    if (result.rows.length > 0) {
      res.json({ success: true, glassOptions: result.rows });
    } else {
      res.json({ success: true, glassOptions: mockGlassOptions, source: 'mock' });
    }
  } catch (error) {
    console.error('Error fetching glass options:', error);
    res.json({ success: true, glassOptions: mockGlassOptions, source: 'mock_fallback' });
  }
});

// Orders endpoint
app.get('/api/orders', async (req, res) => {
  try {
    const ordersResult = await pool.query(`
      SELECT 
        o.*,
        c.name as customer_name,
        c.email as customer_email,
        c.phone as customer_phone
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
      LIMIT 20
    `);
    
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
      count: orders.length
    });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.json({ 
      success: true, 
      orders: [],
      count: 0,
      error: error.message
    });
  }
});

// Pricing calculation endpoint
app.post('/api/pricing/calculate', async (req, res) => {
  try {
    const { frameId, matColorId, glassOptionId, artworkWidth, artworkHeight, matWidth, quantity } = req.body;
    
    // Get materials
    const frame = mockFrames.find(f => f.id === frameId) || mockFrames[0];
    const mat = mockMatColors.find(m => m.id === matColorId) || mockMatColors[0];
    const glass = mockGlassOptions.find(g => g.id === glassOptionId) || mockGlassOptions[0];
    
    // Calculate dimensions
    const finishedWidth = artworkWidth + (matWidth * 2);
    const finishedHeight = artworkHeight + (matWidth * 2);
    const unitedInches = finishedWidth + finishedHeight;
    const frameLinearFeet = unitedInches / 12;
    const matArea = finishedWidth * finishedHeight;
    const glassArea = finishedWidth * finishedHeight;
    
    // Calculate costs
    const framePrice = frameLinearFeet * parseFloat(frame.price) * 2.5; // Markup factor
    const matPrice = matArea * parseFloat(mat.price) * 1.8; // Markup factor  
    const glassPrice = glassArea * parseFloat(glass.price) * 1.5; // Markup factor
    const laborCost = 25.00; // Base labor
    
    const materialCost = framePrice + matPrice + glassPrice;
    const subtotal = materialCost + laborCost;
    const totalPrice = subtotal * quantity;
    
    res.json({
      success: true,
      framePrice: framePrice,
      matPrice: matPrice,
      glassPrice: glassPrice,
      laborCost: laborCost,
      materialCost: materialCost,
      subtotal: subtotal,
      totalPrice: totalPrice,
      calculations: {
        frameLinearFeet: frameLinearFeet.toFixed(2),
        matArea: matArea.toFixed(2),
        glassArea: glassArea.toFixed(2),
        unitedInches: unitedInches
      }
    });
    
  } catch (error) {
    console.error('Error calculating pricing:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Minimal server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database URL configured: ${!!process.env.DATABASE_URL}`);
  console.log('✓ Cost Estimator feature available at /cost-estimator');
});