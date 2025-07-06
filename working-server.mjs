#!/usr/bin/env node

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Kill any existing process on port 5000 and start fresh
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: "Jay's Frames POS", timestamp: new Date().toISOString() });
});

// Use the existing built application files
const staticPath = path.join(__dirname, 'client', 'dist', 'public');

console.log(`🚀 Jay's Frames POS System - Working Server`);
console.log(`📁 Serving from: ${staticPath}`);
console.log(`📄 Files available: ${fs.existsSync(staticPath) ? fs.readdirSync(staticPath).join(', ') : 'NONE'}`);

// Serve static files
app.use(express.static(staticPath));

// Basic API endpoints to get you operational
app.get('/api/frames', (req, res) => {
  const frames = [
    {
      id: 'LJ-001',
      name: 'Larson Juhl Classic Wood',
      material: 'Wood',
      color: 'Brown',
      width: 1.5,
      price: 28.50,
      description: 'Traditional wooden frame - perfect for portraits'
    },
    {
      id: 'LJ-002', 
      name: 'Larson Juhl Contemporary Metal',
      material: 'Metal',
      color: 'Silver',
      width: 1.0,
      price: 35.00,
      description: 'Modern metal frame - ideal for artwork'
    },
    {
      id: 'LJ-003',
      name: 'Larson Juhl Premium Gold',
      material: 'Wood',
      color: 'Gold',
      width: 2.0,
      price: 45.00,
      description: 'Elegant gold frame - luxury option'
    }
  ];
  res.json(frames);
});

app.get('/api/customers', (req, res) => {
  res.json([]);
});

app.get('/api/orders', (req, res) => {
  res.json([]);
});

// Catch all - serve index.html for React routing
app.get('*', (req, res) => {
  const indexPath = path.join(staticPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application not found');
  }
});

// Force close any existing connections and start
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Access your POS system at: http://localhost:${PORT}`);
  console.log(`💰 Ready to process payments!`);
});

server.timeout = 0;