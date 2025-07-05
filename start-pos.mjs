#!/usr/bin/env node
import { spawn } from 'child_process';
import { readFileSync } from 'fs';

console.log('🚀 Starting Jay\'s Frames POS System...');

// Check if built assets exist
try {
  readFileSync('./dist/public/index.html');
  console.log('✅ Frontend assets ready');
} catch (error) {
  console.log('⚠️  Building frontend assets...');
  const build = spawn('npm', ['run', 'build'], { stdio: 'inherit' });
  await new Promise(resolve => build.on('close', resolve));
}

// Start the POS server
console.log('🌐 Starting server on port 5000...');
const server = spawn('node', ['simple-server.js'], {
  stdio: 'inherit',
  env: { 
    ...process.env, 
    NODE_ENV: 'production',
    PORT: '5000'
  }
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`❌ Server exited with code ${code}`);
  process.exit(code);
});

// Handle shutdown signals
process.on('SIGINT', () => {
  console.log('\n⏹️  Shutting down POS system...');
  server.kill('SIGTERM');
  setTimeout(() => {
    server.kill('SIGKILL');
    process.exit(0);
  }, 5000);
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
  setTimeout(() => {
    server.kill('SIGKILL');
    process.exit(0);
  }, 5000);
});

console.log('✅ POS System startup complete - listening for connections...');