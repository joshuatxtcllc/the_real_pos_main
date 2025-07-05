#!/usr/bin/env node
import { spawn } from 'child_process';

console.log('Starting POS system...');

// Start the simple server
const server = spawn('node', ['simple-server.js'], {
  stdio: 'inherit',
  env: { 
    ...process.env, 
    NODE_ENV: 'production',
    PORT: '5000'
  }
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  server.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.kill();
  process.exit(0);
});