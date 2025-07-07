#!/usr/bin/env node
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 5000;

console.log('🚀 Jay\'s Frames POS System - Simple Server');
console.log('📍 Environment: production');
console.log('🔌 Port:', PORT);

const staticPath = path.join(__dirname, 'dist', 'public');
console.log('📁 Serving from:', staticPath);

// Middleware
app.use(express.static(staticPath, {
  maxAge: 0, // No caching for development
  etag: false
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch all for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Server Error');
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('🌐 Access at: http://0.0.0.0:' + PORT);
  console.log('✅ Server ready for connections');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('Port', PORT, 'is busy, trying', PORT + 1);
    server.listen(PORT + 1, '0.0.0.0');
  } else {
    console.error('Server error:', err);
  }
});

process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());