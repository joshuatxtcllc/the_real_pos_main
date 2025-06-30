#!/usr/bin/env node

// Force production environment
process.env.NODE_ENV = 'production';

// Cloud Run port configuration - use process.env.PORT or default to 5000
const PORT = process.env.PORT || '5000';
console.log('🚀 Starting Jay\'s Frames POS System');
console.log('📍 Environment:', process.env.NODE_ENV);
console.log('🔌 Port:', PORT);
console.log('🌐 Binding to: 0.0.0.0:' + PORT);

// Startup timeout to prevent hanging
const startupTimeout = setTimeout(() => {
  console.error('❌ Startup timeout exceeded (60s)');
  process.exit(1);
}, 60000);

// Import and start the server
import('./server.mjs')
  .then(() => {
    clearTimeout(startupTimeout);
    console.log('✅ Server started successfully');
  })
  .catch(error => {
    clearTimeout(startupTimeout);
    console.error('❌ Server startup failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  });

// Handle process signals for graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  clearTimeout(startupTimeout);
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  clearTimeout(startupTimeout);
  process.exit(0);
});