#!/usr/bin/env node

/**
 * Production server startup with ES module compatibility
 */

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set production environment
process.env.NODE_ENV = 'production';

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

console.log('Starting Jay\'s Frames POS System...');
console.log('Environment: production');

// Import and start the server
try {
  await import('./server/index.ts');
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}