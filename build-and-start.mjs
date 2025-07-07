#!/usr/bin/env node

// Build and start script for production deployment
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

console.log('🚀 Jay\'s Frames POS System - Build and Start');

// Check if build already exists
const serverPath = './dist/server.mjs';
const clientPath = './dist/public/index.html';

if (existsSync(serverPath) && existsSync(clientPath)) {
  console.log('✅ Build files already exist, starting server...');
} else {
  console.log('📦 Building application...');
  
  // Run build process
  const buildProcess = spawn('npm', ['run', 'build'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  });
  
  await new Promise((resolve, reject) => {
    buildProcess.on('exit', (code) => {
      if (code === 0) {
        console.log('✅ Build completed successfully!');
        resolve();
      } else {
        console.error(`❌ Build failed with exit code ${code}`);
        reject(new Error(`Build failed with exit code ${code}`));
      }
    });
    
    buildProcess.on('error', (error) => {
      console.error('❌ Build process error:', error);
      reject(error);
    });
  });
}

// Start the production server
console.log('🚀 Starting production server on port 5000...');

const server = spawn('node', ['dist/server.mjs'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: '5000'
  }
});

server.on('error', (error) => {
  console.error('❌ Server startup error:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
    process.exit(code);
  }
});

// Handle graceful shutdown
const cleanup = () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGTERM');
  
  setTimeout(() => {
    server.kill('SIGKILL');
    process.exit(0);
  }, 5000);
};

process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);

// Keep the process alive
process.on('exit', () => {
  console.log('👋 Server stopped');
});