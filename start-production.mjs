#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting production server...');

// Set production environment
process.env.NODE_ENV = 'production';

// Check if built server exists, if not use TypeScript directly
const builtServerPath = path.join(__dirname, 'dist', 'server.mjs');
const useBuiltServer = fs.existsSync(builtServerPath);

let server;

if (useBuiltServer) {
  console.log('📦 Using built production server');
  server = spawn('node', ['dist/server.mjs'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: process.env.PORT || '5000'
    }
  });
} else {
  console.log('🔧 Using TypeScript server directly');
  server = spawn('npx', ['tsx', 'server/index.ts'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: process.env.PORT || '5000'
    }
  });
}

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