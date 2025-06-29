#!/usr/bin/env node

// Cloud Run production startup
process.env.NODE_ENV = 'production';

// Configure PORT for Cloud Run (required) - override default 5000 for deployment
const PORT = process.env.PORT || 8080;
process.env.PORT = PORT.toString();

console.log('🚀 Jay\'s Frames POS System starting...');
console.log('Port:', PORT);
console.log('Node ENV:', process.env.NODE_ENV);

// Import and start server
import('./server.mjs').catch(error => {
  console.error('❌ Server startup failed:', error);
  process.exit(1);
});
