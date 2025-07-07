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
    const { registerRoutes } = await import('./server/routes.js');
    await registerRoutes(app);
    console.log('✅ API routes registered');
  } catch (error) {
    console.log('⚠️ API routes not available:', error.message);
    // Add basic fallback routes
    app.get('/api/health', (req, res) => {
      res.json({ status: 'healthy', timestamp: new Date().toISOString() });
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

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Jay's Frames POS System running on http://0.0.0.0:${port}`);
    console.log(`📱 Access your app at: https://${port}-jayframes-rest-express.replit.dev`);
    console.log(`✅ Server is ready and serving both frontend and backend`);
    console.log(`🔧 Frontend assets are being served by Vite dev server`);
  });
}

startServer().catch(console.error);