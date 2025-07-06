#!/usr/bin/env node

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from client/dist/public where the built app actually is
let staticPath = path.join(__dirname, 'client', 'dist', 'public');

console.log(`🔍 Looking for static files in: ${staticPath}`);
console.log(`📁 Directory exists: ${fs.existsSync(staticPath)}`);

if (fs.existsSync(staticPath)) {
  const files = fs.readdirSync(staticPath);
  console.log(`📄 Files found: ${files.join(', ')}`);
}

app.use(express.static(staticPath));

// API routes - simple frame data
app.get('/api/frames', (req, res) => {
  const sampleFrames = [
    {
      id: '1',
      name: 'Classic Wood Frame',
      material: 'Wood',
      color: 'Brown',
      width: 1.5,
      price: 25.00,
      description: 'Traditional wooden frame'
    },
    {
      id: '2', 
      name: 'Modern Metal Frame',
      material: 'Metal',
      color: 'Silver',
      width: 1.0,
      price: 35.00,
      description: 'Contemporary metal frame'
    }
  ];
  res.json(sampleFrames);
});

// Catch all - serve index.html for client-side routing
app.get('*', (req, res) => {
  const indexPath = path.join(staticPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`
      <html>
        <head><title>Jay's Frames POS</title></head>
        <body>
          <h1>Jay's Frames POS System</h1>
          <p>Application starting...</p>
          <p>Static path: ${staticPath}</p>
          <p>Index exists: ${fs.existsSync(indexPath)}</p>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Emergency server running on port ${PORT}`);
  console.log(`📁 Serving from: ${staticPath}`);
  console.log(`🌐 Access at: http://localhost:${PORT}`);
});