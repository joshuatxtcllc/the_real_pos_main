#!/usr/bin/env node

/**
 * Standalone Production Deployment
 * This script bypasses any existing development workflows
 * and starts the application in pure production mode
 */

// Force production environment
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || process.env.REPL_PORT || '5000';

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting standalone production deployment...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);

// Check for built server
const distPath = path.join(__dirname, 'dist', 'server.mjs');
const useBuiltServer = fs.existsSync(distPath);

let startCommand, startArgs;

if (useBuiltServer) {
  console.log('Using optimized production build');
  startCommand = 'node';
  startArgs = [distPath];
} else {
  console.log('Starting TypeScript server in production mode');
  startCommand = 'npx';
  startArgs = ['tsx', 'server/index.ts'];
}

// Start production server
const server = spawn(startCommand, startArgs, {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    // Override any development environment variables
    VITE_DEV_MODE: 'false',
    DEV: 'false'
  },
  detached: false
});

server.on('error', (error) => {
  console.error('Production server failed to start:', error.message);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error('Production server exited with code:', code);
    process.exit(code);
  } else {
    console.log('Production server shut down gracefully');
  }
});

// Graceful shutdown handling
const cleanup = () => {
  console.log('Shutting down production server...');
  server.kill('SIGTERM');
  setTimeout(() => {
    server.kill('SIGKILL');
    process.exit(0);
  }, 5000);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

console.log('Production server started successfully');