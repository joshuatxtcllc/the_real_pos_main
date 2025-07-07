import express from 'express';
import cors from 'cors';
import path from 'path';
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
import healthController from './controllers/healthController';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://*.replit.app', 'https://*.replit.dev']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://0.0.0.0:5173'],
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

// Serve static files from the client build
const clientBuildPath = path.join(__dirname, '../dist/public');
app.use(express.static(clientBuildPath));

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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Serving static files from: ${clientBuildPath}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;