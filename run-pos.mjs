#!/usr/bin/env node

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure dist/public exists
const publicPath = path.join(__dirname, 'dist', 'public');
if (!existsSync(publicPath)) {
  console.error('❌ Frontend not built. Run: npm run build');
  process.exit(1);
}

console.log('🚀 Jay\'s Frames POS System Starting...');
console.log(`📍 Port: ${PORT}`);
console.log(`📁 Static files: ${publicPath}`);

// Serve static files
app.use(express.static(publicPath));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'Jay\'s Frames POS',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Root health check  
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Catch all for React router
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ POS System running: http://0.0.0.0:${PORT}`);
  console.log(`✅ Health check: http://0.0.0.0:${PORT}/health`);
  console.log('🎯 Ready for customer use');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} in use. Trying ${PORT + 1}...`);
    setTimeout(() => {
      server.close();
      app.listen(PORT + 1, '0.0.0.0', () => {
        console.log(`✅ POS System running: http://0.0.0.0:${PORT + 1}`);
      });
    }, 1000);
  }
});

// Keep alive
setInterval(() => {
  console.log(`🔄 POS System alive on port ${PORT} - ${new Date().toLocaleTimeString()}`);
}, 300000); // Every 5 minutes