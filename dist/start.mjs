#!/usr/bin/env node

// Cloud Run optimized startup
const requiredEnvVars = ['NODE_ENV', 'PORT'];
requiredEnvVars.forEach(key => {
  if (key === 'NODE_ENV') process.env[key] = 'production';
  if (key === 'PORT' && !process.env[key]) process.env[key] = '8080';
});

console.log('🚀 Starting Jay\'s Frames POS System for Cloud Run');
console.log('Port:', process.env.PORT);
console.log('Environment:', process.env.NODE_ENV);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server with timeout
const startTimeout = setTimeout(() => {
  console.error('Server startup timeout exceeded');
  process.exit(1);
}, 60000); // 60 second timeout

import('./server.mjs')
  .then(() => {
    clearTimeout(startTimeout);
    console.log('✓ Server started successfully');
  })
  .catch(error => {
    clearTimeout(startTimeout);
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  });
