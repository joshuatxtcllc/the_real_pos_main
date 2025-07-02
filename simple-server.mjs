import express from 'express';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  
  // Create Vite server in middleware mode with manual __dirname configuration
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: path.join(__dirname, 'client'),
    resolve: {
      alias: {
        "@": path.join(__dirname, "client/src"),
        "@shared": path.join(__dirname, "shared"),
        "@assets": path.join(__dirname, "attached_assets"),
      },
    },
  });

  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);

  const port = process.env.PORT || 5000;
  
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📸 Enhanced camera with zoom controls is ready!`);
  });
}

startServer().catch(console.error);