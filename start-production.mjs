#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Set production environment
process.env.NODE_ENV = 'production';

console.log('🚀 Starting production server...');

// Check if built server exists
const serverPath = 'dist/server.mjs';
if (!fs.existsSync(serverPath)) {
  console.error('❌ Built server not found. Running build first...');
  
  // Run build process
  const buildProcess = spawn('node', ['simple-deploy.mjs'], {
    stdio: 'inherit',
    env: process.env
  });

  buildProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Build completed, starting server...');
      startServer();
    } else {
      console.error('❌ Build failed with code:', code);
      process.exit(1);
    }
  });
} else {
  startServer();
}

function startServer() {
  console.log('🔧 Starting production server...');
  
  const serverProcess = spawn('node', [serverPath], {
    stdio: 'inherit',
    env: process.env
  });

  serverProcess.on('error', (error) => {
    console.error('❌ Server error:', error.message);
    process.exit(1);
  });

  serverProcess.on('close', (code) => {
    console.log(`Server exited with code: ${code}`);
    process.exit(code);
  });

  // Handle process termination
  process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    serverProcess.kill('SIGTERM');
  });

  process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully...');
    serverProcess.kill('SIGINT');
  });
}