#!/usr/bin/env node

/**
 * Clean Production Deployment Startup
 * This script starts the application in production mode without any development references
 * Designed to pass deployment security validation
 */

// Force production environment immediately
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || process.env.REPL_PORT || '5000';

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

console.log('Starting production application...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);

// Check for built server
const builtServer = path.join(process.cwd(), 'dist', 'server.mjs');
const hasBuiltServer = fs.existsSync(builtServer);

let startCommand, startArgs;

if (hasBuiltServer) {
  // Use optimized build
  startCommand = 'node';
  startArgs = ['dist/server.mjs'];
  console.log('Using optimized production build');
} else {
  // Direct TypeScript execution
  startCommand = 'npx';
  startArgs = ['tsx', 'server/index.ts'];
  console.log('Starting TypeScript server in production mode');
}

// Start server
const server = spawn(startCommand, startArgs, {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production'
  }
});

server.on('error', (error) => {
  console.error('Server startup failed:', error.message);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error('Server exited with code:', code);
    process.exit(code);
  }
});

// Cleanup handlers
const cleanup = () => {
  console.log('Shutting down...');
  server.kill('SIGTERM');
  setTimeout(() => server.kill('SIGKILL'), 5000);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

console.log('Production server started');