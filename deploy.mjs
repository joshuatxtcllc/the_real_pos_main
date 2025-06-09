#!/usr/bin/env node

/**
 * Simplified deployment build script
 * Handles ES module compatibility for Replit deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Starting deployment build...');

try {
  // Build frontend only (skip problematic backend bundling)
  console.log('Building frontend...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Create deployment package.json with correct module format
  const deployPackage = {
    "name": "jays-frames-pos",
    "version": "1.0.0",
    "type": "module",
    "main": "server/index.ts",
    "scripts": {
      "start": "tsx server/index.ts"
    },
    "engines": {
      "node": ">=18.0.0"
    }
  };
  
  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }
  
  // Write deployment package.json
  fs.writeFileSync('dist/package.json', JSON.stringify(deployPackage, null, 2));
  
  // Copy server files to dist
  execSync('cp -r server dist/', { stdio: 'inherit' });
  execSync('cp -r shared dist/', { stdio: 'inherit' });
  
  // Copy essential config files
  if (fs.existsSync('drizzle.config.ts')) {
    execSync('cp drizzle.config.ts dist/', { stdio: 'inherit' });
  }
  
  console.log('✓ Frontend built successfully');
  console.log('✓ Server files copied');
  console.log('✓ Deployment ready');
  
} catch (error) {
  console.error('Deployment build failed:', error.message);
  process.exit(1);
}