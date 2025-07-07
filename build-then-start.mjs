#!/usr/bin/env node

import { spawn } from 'child_process';
import { existsSync } from 'fs';

console.log('🚀 Jay\'s Frames POS System');

// Check if server is already built
if (!existsSync('./dist/server.mjs')) {
  console.log('📦 Building server...');
  
  const buildServer = spawn('npx', ['esbuild', 'server/index.ts', '--platform=node', '--packages=external', '--bundle', '--format=esm', '--outfile=dist/server.mjs', '--define:process.env.NODE_ENV="production"', '--target=es2020'], {
    stdio: 'inherit'
  });
  
  await new Promise((resolve, reject) => {
    buildServer.on('exit', (code) => {
      if (code === 0) {
        console.log('✅ Server build completed');
        resolve();
      } else {
        reject(new Error(`Build failed with code ${code}`));
      }
    });
    buildServer.on('error', reject);
  });
}

// Start the server
console.log('🚀 Starting server on port 5000...');

const server = spawn('node', ['dist/server.mjs'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: '5000'
  }
});

server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

// Handle cleanup
const cleanup = () => {
  server.kill('SIGTERM');
  setTimeout(() => server.kill('SIGKILL'), 3000);
};

process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);