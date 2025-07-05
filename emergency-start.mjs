#!/usr/bin/env node

// Emergency startup script for customer service
import { spawn } from 'child_process';

console.log('🚨 Emergency POS startup for customer...');

// Kill any existing processes
try {
  await new Promise(resolve => {
    const killProcess = spawn('pkill', ['-f', 'tsx.*server'], { stdio: 'inherit' });
    killProcess.on('close', () => resolve());
  });
  
  // Wait for cleanup
  await new Promise(resolve => setTimeout(resolve, 2000));
} catch (e) {
  console.log('No existing processes to kill');
}

// Start server on port 3000
console.log('Starting POS server on port 3000...');
const server = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development',
    PORT: '3000'
  }
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.kill();
  process.exit(0);
});