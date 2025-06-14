import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        // Don't exit the process, just log the error
        console.error(`Vite server error: ${msg}`);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPublicPath = path.resolve(__dirname, '..', 'dist', 'public');
  const clientDistPath = path.resolve(__dirname, '..', 'client', 'dist');

  let staticPath = '';

  // Check for built static files in the correct order
  if (fs.existsSync(distPublicPath)) {
    staticPath = distPublicPath;
    log(`Serving static files from: ${distPublicPath}`);
  } else if (fs.existsSync(clientDistPath)) {
    staticPath = clientDistPath;
    log(`Serving static files from: ${clientDistPath}`);
  } else {
    log('No static files found. Please build the client application.', 'error');
  }

  if (staticPath) {
    // Serve static files with proper cache headers
    app.use(express.static(staticPath, {
      maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
      etag: true,
      index: 'index.html'
    }));
  }

  // Catch-all handler for client-side routing
  app.get('*', (req, res, next) => {
    // Skip API routes and uploads
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }

    const indexPath = path.resolve(staticPath, 'index.html');

    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(500).json({ 
        error: 'Client application not built', 
        message: 'Please run "npm run build" to build the client application' 
      });
    }
  });
}

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function setupViteProxy(app: express.Application, isDev: boolean = true) {
  if (isDev) {
    // Serve static files from uploads directory
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    // In development, serve a basic HTML page that loads the frontend
    app.get('/', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Jay's Frames</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body>
            <div id="app">
              <p>Loading Jay's Frames application...</p>
              <script>
                // Try to load from Vite dev server, fallback to current server
                const viteUrl = 'http://localhost:5173';
                const currentUrl = window.location.origin;
                
                fetch(viteUrl)
                  .then(() => {
                    window.location.href = viteUrl;
                  })
                  .catch(() => {
                    // Vite server not available, show message
                    document.getElementById('app').innerHTML = 
                      '<p>Frontend development server is starting up. Please wait a moment and refresh.</p>';
                  });
              </script>
            </div>
          </body>
        </html>
      `);
    });

    // Handle client-side routing for non-API routes
    app.get('*', (req, res, next) => {
      if (req.url.startsWith('/api')) {
        next();
      } else {
        res.redirect('/');
      }
    });
  } else {
    // Production: serve built files
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    // Catch-all handler for client-side routing
    app.get('*', (req, res) => {
      if (!req.url.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      }
    });
  }
}