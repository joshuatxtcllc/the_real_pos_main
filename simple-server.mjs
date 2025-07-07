
import express from 'express';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

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

  // Health check endpoints
  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  app.get('/ready', (req, res) => {
    res.json({ status: 'ready', timestamp: new Date().toISOString() });
  });

  // Create Vite server in middleware mode
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: path.join(__dirname, 'client'),
    base: '/',
    resolve: {
      alias: {
        "@": path.join(__dirname, "client/src"),
        "@shared": path.join(__dirname, "shared"),
      },
    },
    define: {
      global: 'globalThis',
    }
  });

  // Use vite's connect instance as middleware
  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);

  // Catch-all handler for SPA routing
  app.get('*', async (req, res, next) => {
    try {
      // Skip API routes and health checks
      if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/ready')) {
        return next();
      }

      const url = req.originalUrl;
      let template = await vite.ssrLoadModule('/client/index.html');
      
      if (typeof template === 'object' && template.default) {
        template = template.default;
      }
      
      const html = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (error) {
      vite.ssrFixStacktrace(error);
      console.error('Error serving page:', error);
      res.status(500).end(error.message);
    }
  });

  const port = 5000;
  
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Jay's Frames POS System running on http://0.0.0.0:${port}`);
    console.log(`📱 Frontend accessible at the webview or Replit URL`);
    console.log(`✅ Server is ready and serving both frontend and backend`);
  });
}

startServer().catch(console.error);
