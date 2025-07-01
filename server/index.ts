import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from "cors";

// ES module compatibility - add __dirname and __filename polyfills
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// Use PORT environment variable with proper Cloud Run compatibility
const PORT = parseInt(process.env.PORT || '5000', 10);

// Notification service disabled for deployment stability

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000',
    'https://localhost:5173',
    process.env.REPL_URL || '',
    process.env.FRONTEND_URL || '',
    // Allow Replit deployment domains
    /https:\/\/.*\.replit\.dev$/,
    /https:\/\/.*\.replit\.app$/,
    /https:\/\/.*\.repl\.co$/,
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Early health check registration - MUST be before any other middleware
// These endpoints respond immediately without database dependencies
app.get('/', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache');
  res.status(200).json({ 
    status: 'healthy', 
    service: 'Jay\'s Frames POS System',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Additional health check endpoints for deployment systems
app.get('/health', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache');
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/ready', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache');
  res.status(200).json({ 
    ready: true, 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Additional ping endpoint for load balancers
app.get('/ping', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.status(200).send('pong');
});

// JSON parsing middleware with increased limits for image uploads
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Static files
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });

    // Log the error instead of re-throwing it
    log(`Error: ${message} (${status})`, "error");
    console.error(err);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }



  // Function to start server with deployment-ready configuration
  const startServer = () => {
    try {
      console.log(`🚀 Starting Jay's Frames POS System`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔌 Port: ${PORT}`);
      console.log(`🌐 Binding to: 0.0.0.0:${PORT}`);
      
      // Use consistent PORT configuration - prioritize PORT env var for Cloud Run
      const serverInstance = server.listen(PORT, "0.0.0.0", () => {
        log(`serving on port ${PORT}`);
        console.log(`✅ Server successfully started on port ${PORT}`);
        console.log(`✅ Health endpoints available at:`, [
          `http://0.0.0.0:${PORT}/`,
          `http://0.0.0.0:${PORT}/health`,
          `http://0.0.0.0:${PORT}/ready`
        ]);
        console.log(`✅ Ready for incoming connections`);
      });

      serverInstance.on('error', (error: any) => {
        const errorMessage = `Server startup error: ${error.message}`;
        log(errorMessage, "error");
        console.error('❌ Server error:', error);
        
        // Handle specific error cases for Cloud Run
        if (error.code === 'EADDRINUSE') {
          console.error(`❌ Port ${PORT} is already in use`);
        } else if (error.code === 'EACCES') {
          console.error(`❌ Permission denied to bind to port ${PORT}`);
        }
        
        process.exit(1);
      });

      // Graceful shutdown handlers
      const gracefulShutdown = (signal: string) => {
        log(`${signal} received, shutting down gracefully`, "info");
        console.log(`🛑 ${signal} received, shutting down gracefully...`);

        serverInstance.close((error) => {
          if (error) {
            console.error('❌ Error during shutdown:', error);
            process.exit(1);
          } else {
            log("Server closed", "info");
            console.log('✅ Server closed gracefully');
            process.exit(0);
          }
        });

        // Force exit after 10 seconds
        setTimeout(() => {
          console.log('⏰ Force exit after timeout');
          process.exit(1);
        }, 10000);
      };

      process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
      process.on('SIGINT', () => gracefulShutdown('SIGINT'));

      return serverInstance;
    } catch (error: any) {
      const errorMessage = `Critical server startup failure: ${error?.message || error}`;
      log(errorMessage, "error");
      console.error('❌ Critical error:', error);
      console.error('❌ Stack trace:', error.stack);
      process.exit(1);
    }
  };

  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'uploads');
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  } catch (error) {
    log(`Warning: Could not create uploads directory: ${error}`, "warning");
  }

  // Static file serving for uploads
  app.use('/uploads', express.static(uploadsDir));

  startServer();
})();