#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting production server...');

// Set production environment
process.env.NODE_ENV = 'production';

// Start the production server
const server = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: process.env.PORT || '5000'
  }
});

server.on('error', (error) => {
  console.error('❌ Production server error:', error.message);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Production server exited with code ${code}`);
    process.exit(code);
  }
});

// Handle cleanup
const cleanup = () => {
  console.log('\nShutting down production server...');
  server.kill('SIGTERM');
  
  setTimeout(() => {
    server.kill('SIGKILL');
    process.exit(0);
  }, 5000);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

console.log('✅ Production server started successfully');