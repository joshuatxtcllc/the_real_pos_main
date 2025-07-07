import express from 'express';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Kill any existing processes on startup
function cleanupExistingProcesses() {
  return new Promise((resolve) => {
    exec('pkill -f "node simple-server.mjs" || true', () => {
      exec('pkill -f "tsx server/index.ts" || true', () => {
        exec('pkill -f "vite.*5000" || true', () => {
          setTimeout(resolve, 1000);
        });
      });
    });
  });
}

async function startServer() {
  console.log('🧹 Cleaning up existing processes...');
  await cleanupExistingProcesses();
  
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
      console.log(`❌ Port ${port} is still in use after cleanup.`);
      console.log(`🔄 Force killing remaining processes and retrying...`);
      
      exec('pkill -9 -f "node.*5000" || true', () => {
        exec('pkill -9 -f "tsx.*5000" || true', () => {
          setTimeout(() => {
            console.log(`🔄 Retrying on port ${port}...`);
            const retryServer = app.listen(port, '0.0.0.0', () => {
              console.log(`🚀 Jay's Frames POS System running on http://0.0.0.0:${port}`);
              console.log(`📱 Access your app at: https://${port}-jayframes-rest-express.replit.dev`);
              console.log(`✅ Server is ready and serving both frontend and backend`);
            });
            
            retryServer.on('error', (retryError) => {
              console.error(`❌ Failed to start after cleanup:`, retryError.message);
              console.log(`🆘 Trying emergency fallback port...`);
              
              const emergencyPort = 5001;
              const emergencyServer = app.listen(emergencyPort, '0.0.0.0', () => {
                console.log(`🚨 Emergency server running on port ${emergencyPort}`);
                console.log(`📱 Access at: https://${emergencyPort}-jayframes-rest-express.replit.dev`);
              });
            });
          }, 2000);
        });
      });
    } else {
      console.error(`❌ Server error:`, error);
      process.exit(1);
    }
  });
}

startServer().catch(console.error);