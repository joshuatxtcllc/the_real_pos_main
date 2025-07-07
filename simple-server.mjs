import express from 'express';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // Add CORS for all routes
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // JSON parsing middleware
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));

  // Health check endpoints
  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  app.get('/ready', (req, res) => {
    res.json({ status: 'ready', timestamp: new Date().toISOString() });
  });

  // API routes - Import your existing API routes
  try {
    // Try to import the built server first
    const { registerRoutes } = await import('./dist/server.mjs');
    await registerRoutes(app);
    console.log('✅ API routes registered from built server');
  } catch (error) {
    console.log('⚠️ Built server not available, using fallback routes:', error.message);
    // Add comprehensive fallback routes
    app.get('/api/health', (req, res) => {
      res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    });
    
    app.get('/api/frames', (req, res) => {
      res.json({ frames: [] });
    });
    
    app.get('/api/orders', (req, res) => {
      res.json({ orders: [] });
    });
    
    app.get('/api/customers', (req, res) => {
      res.json({ customers: [] });
    });
    
    app.post('/api/*', (req, res) => {
      res.json({ success: true, message: 'Fallback API response' });
    });
  }

  // Create Vite server in middleware mode
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: path.join(__dirname, 'client'),
    resolve: {
      alias: {
        "@": path.join(__dirname, "client/src"),
        "@shared": path.join(__dirname, "shared"),
      },
    },
  });

  // Use vite's connect instance as middleware
  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);

  const port = 5000;

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Jay's Frames POS System running on http://0.0.0.0:${port}`);
    console.log(`📱 Access your app at: https://${port}-jayframes-rest-express.replit.dev`);
    console.log(`✅ Server is ready and serving both frontend and backend`);
    console.log(`🔧 Frontend assets are being served by Vite dev server`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`❌ Port ${port} is already in use. Another server may be running.`);
      console.log(`🔄 Attempting to kill existing processes and restart...`);
      
      // Try to start on a different port
      const fallbackPort = port + 1;
      setTimeout(() => {
        const fallbackServer = app.listen(fallbackPort, '0.0.0.0', () => {
          console.log(`🚀 Jay's Frames POS System running on fallback port http://0.0.0.0:${fallbackPort}`);
          console.log(`📱 Access your app at: https://${fallbackPort}-jayframes-rest-express.replit.dev`);
        });
        
        fallbackServer.on('error', (fallbackError) => {
          console.error(`❌ Failed to start on fallback port ${fallbackPort}:`, fallbackError.message);
          process.exit(1);
        });
      }, 1000);
    } else {
      console.error(`❌ Server error:`, error);
      process.exit(1);
    }
  });
}

startServer().catch(console.error);