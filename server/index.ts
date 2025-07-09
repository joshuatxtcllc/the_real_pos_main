import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import ordersRoutes from './routes/ordersRoutes';
import customersRoutes from './routes/customersRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import materialsRoutes from './routes/materialsRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import fileRoutes from './routes/fileRoutes';
import qrCodeRoutes from './routes/qrCodeRoutes';
import webhookRoutes from './routes/webhookRoutes';
import bookmarkRoutes from './routes/bookmarkRoutes';
import healthController from './controllers/healthController';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Immediate health check endpoint (must be first)
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: "Jay's Frames POS System",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.get('/ready', (req, res) => {
  res.status(200).json({ status: 'ready' });
});

// Trust proxy for accurate client IPs
app.set('trust proxy', true);
const PORT = parseInt(process.env.PORT || process.env.REPL_PORT || '5000', 10);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://*.replit.app', 'https://*.replit.dev']
    : [
        'http://localhost:3000', 
        'http://localhost:5173', 
        'http://0.0.0.0:5173',
        'https://5173-jayframes-rest-express.replit.dev',
        /^https:\/\/.*\.replit\.dev$/,
        /^https:\/\/.*\.replit\.app$/
      ],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', healthController.getHealth);

// API routes
app.use('/api', ordersRoutes);
app.use('/api', customersRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', materialsRoutes);
app.use('/api', invoiceRoutes);
app.use('/api', fileRoutes);
app.use('/api', qrCodeRoutes);
app.use('/api', webhookRoutes);
app.use('/api', bookmarkRoutes);

// Serve static files from the client build
const clientBuildPath = process.env.NODE_ENV === 'production' 
  ? path.join(process.cwd(), 'dist/public')        // When running from dist/server.mjs, use cwd + dist/public
  : path.join(__dirname, '../dist/public');       // When running from server/index.ts in development

console.log(`📁 Serving static files from: ${clientBuildPath}`);
console.log(`📂 Directory exists: ${fs.existsSync(clientBuildPath)}`);

app.use(express.static(clientBuildPath, {
  index: 'index.html',
  redirect: false
}));

// Handle client-side routing
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }

  res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Server Error');
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: err.message 
  });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Server bound to 0.0.0.0:${PORT}`);
  console.log('Health check endpoints: /, /health, /ready');
});

export default app;