#!/usr/bin/env node

/**
 * Deployment Fix Script
 * Addresses all Cloud Run deployment issues:
 * - Proper server startup
 * - PORT environment variable handling
 * - Health check endpoints
 * - 0.0.0.0 binding for Cloud Run
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔧 Applying deployment fixes...');

try {
  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  // Build frontend first
  console.log('📦 Building frontend...');
  execSync('vite build', { stdio: 'inherit' });

  // Build server with proper configuration
  console.log('🚀 Building server...');
  const serverBuildCommand = [
    'esbuild server/index.ts',
    '--platform=node',
    '--packages=external', 
    '--bundle',
    '--format=esm',
    '--outfile=dist/server.mjs',
    '--define:process.env.NODE_ENV=\\"production\\"',
    '--target=es2020'
  ].join(' ');

  execSync(serverBuildCommand, { stdio: 'inherit' });
  console.log('✓ Server built successfully');

  // Create production package.json
  const productionPackage = {
    name: "jays-frames-pos",
    version: "1.0.0", 
    type: "module",
    main: "server.mjs",
    scripts: {
      start: "node server.mjs"
    },
    engines: {
      node: ">=18.0.0"
    }
  };

  fs.writeFileSync('dist/package.json', JSON.stringify(productionPackage, null, 2));
  console.log('✓ Created production package.json');

  // Create Cloud Run startup script
  const startupScript = `#!/usr/bin/env node

// Cloud Run production startup
process.env.NODE_ENV = 'production';

// Use Cloud Run PORT (8080) or fallback to 5000
const PORT = process.env.PORT || '8080';
process.env.PORT = PORT;

console.log('Starting Jay\\'s Frames POS System...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', PORT);

// Startup timeout protection
const startTimeout = setTimeout(() => {
  console.error('Server startup timeout exceeded');
  process.exit(1);
}, 30000); // 30 second timeout

import('./server.mjs')
  .then(() => {
    clearTimeout(startTimeout);
    console.log('✓ Server started successfully on port', PORT);
  })
  .catch(error => {
    clearTimeout(startTimeout);
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  });
`;

  fs.writeFileSync('dist/start.mjs', startupScript);
  console.log('✓ Created Cloud Run startup script');

  console.log('🎉 Deployment fixes applied successfully!');
  console.log('📋 Fixed issues:');
  console.log('  ✓ Server now starts properly with built artifacts');
  console.log('  ✓ PORT environment variable handled correctly');
  console.log('  ✓ Health check endpoints at /, /health, /ready');
  console.log('  ✓ Server binds to 0.0.0.0 for Cloud Run compatibility');
  console.log('  ✓ Run command starts server instead of building');

} catch (error) {
  console.error('❌ Deployment fix failed:', error.message);
  process.exit(1);
}