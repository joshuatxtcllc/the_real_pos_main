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
const PORT = parseInt(process.env.PORT || process.env.REPL_PORT || '5000', 10);

// Notification service disabled for deployment stability

// CORS setup for API requests
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? true : ['http://localhost:5173', 'http://localhost:5000'],
  credentials: true
}));

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
      // Use consistent PORT configuration with fallback handling
      const serverInstance = server.listen(PORT, "0.0.0.0", () => {
        log(`serving on port ${PORT}`);
        console.log(`✓ Server running on port ${PORT}`);
        console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`✓ CORS enabled for development`);
      });

      serverInstance.on('error', (error: any) => {
        if (error.code === 'EADDRINUSE') {
          log(`Port ${PORT} is already in use, trying ${PORT + 1}`, "warning");
          const fallbackPort = PORT + 1;
          try {
            const fallbackServer = server.listen(fallbackPort, "0.0.0.0", () => {
              log(`serving on fallback port ${fallbackPort}`);
              console.log(`✓ Server running on fallback port ${fallbackPort}`);
            });
            return fallbackServer;
          } catch (fallbackError) {
            log(`Failed to start on fallback port: ${fallbackError}`, "error");
            console.error('Fallback server error:', fallbackError);
            process.exit(1);
          }
        } else {
          log(`Server startup error: ${error.message}`, "error");
          console.error('Server error:', error);
          process.exit(1);
        }
      });

      // Graceful shutdown handlers
      const gracefulShutdown = (signal: string) => {
        log(`${signal} received, shutting down gracefully`, "info");
        console.log(`Shutting down server...`);

        serverInstance.close((error) => {
          if (error) {
            console.error('Error during shutdown:', error);
            process.exit(1);
          } else {
            log("Server closed", "info");
            console.log('Server closed gracefully');
            process.exit(0);
          }
        });

        // Force exit after 10 seconds
        setTimeout(() => {
          console.log('Force exit after timeout');
          process.exit(1);
        }, 10000);
      };

      process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
      process.on('SIGINT', () => gracefulShutdown('SIGINT'));

      return serverInstance;
    } catch (error: any) {
      log(`Critical server startup failure: ${error?.message || error}`, "error");
      console.error('Critical error:', error);
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