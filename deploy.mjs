#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting deployment build...');

try {
  // Build frontend with Vite
  console.log('📦 Building frontend...');
  execSync('npx vite build --config vite.deploy.config.ts', { stdio: 'inherit' });
  
  // Build backend with ESM support
  console.log('🔧 Building backend...');
  execSync('node esbuild.config.mjs', { stdio: 'inherit' });
  
  // Create a production start script that properly handles ES modules
  const startScript = `#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

process.env.NODE_ENV = 'production';

// Import and start the server
import('./index.mjs').catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
`;

  fs.writeFileSync(resolve(__dirname, 'dist/start.mjs'), startScript);
  fs.chmodSync(resolve(__dirname, 'dist/start.mjs'), '755');
  
  console.log('✅ Deployment build completed successfully!');
  console.log('📁 Built files are in the dist/ directory');
  console.log('🎯 Start production server with: node dist/start.mjs');
  
} catch (error) {
  console.error('❌ Deployment build failed:', error.message);
  process.exit(1);
}