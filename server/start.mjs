#!/usr/bin/env node

/**
 * Production server startup script with ES module compatibility
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Set production environment
process.env.NODE_ENV = 'production';

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Import and start the server
try {
  console.log('Starting production server...');
  
  // Dynamic import for ES module compatibility
  await import('./index.ts');
  
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}