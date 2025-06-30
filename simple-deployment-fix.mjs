#!/usr/bin/env node

/**
 * Simple Deployment Fix - Quick build for Cloud Run
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔧 Quick deployment fix...');

try {
  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  // Quick server build only
  console.log('🚀 Building server...');
  execSync(`esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server.mjs --define:process.env.NODE_ENV=\\"production\\" --target=es2020`, { stdio: 'inherit' });

  // Copy existing frontend build if available
  if (fs.existsSync('dist/public')) {
    console.log('✓ Using existing frontend build');
  } else {
    console.log('📦 Building frontend...');
    execSync('vite build', { stdio: 'inherit' });
  }

  // Create production package.json
  const productionPackage = {
    name: "jays-frames-pos",
    version: "1.0.0",
    type: "module",
    main: "server.mjs",
    scripts: { start: "node server.mjs" },
    engines: { node: ">=18.0.0" }
  };

  fs.writeFileSync('dist/package.json', JSON.stringify(productionPackage, null, 2));

  // Create startup script
  const startupScript = `#!/usr/bin/env node
process.env.NODE_ENV = 'production';
const PORT = process.env.PORT || '8080';
process.env.PORT = PORT;
console.log('Starting server on port', PORT);
import('./server.mjs').catch(error => {
  console.error('Server failed:', error);
  process.exit(1);
});`;

  fs.writeFileSync('dist/start.mjs', startupScript);
  console.log('🎉 Deployment ready!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}