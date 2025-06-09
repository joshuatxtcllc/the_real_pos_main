#!/usr/bin/env node

import { build } from 'esbuild';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building for deployment with ES modules support...');

try {
  // Clean dist directory
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  fs.mkdirSync('dist', { recursive: true });

  // Build frontend
  console.log('📦 Building frontend...');
  execSync('npx vite build --config vite.deploy.config.ts --mode production', { 
    stdio: 'inherit',
    timeout: 60000 // 1 minute timeout
  });

  // Build server with proper ES module configuration
  console.log('🔧 Building server...');
  await build({
    entryPoints: ['server/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'esm', // Use ES modules format
    outfile: 'dist/server.mjs',
    packages: 'external',
    minify: true,
    sourcemap: false,
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    banner: {
      js: `// ES Module polyfills for Node.js compatibility
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`
    }
  });

  // Create production package.json with proper ES module config
  const productionPackage = {
    "name": "framing-pos",
    "version": "1.0.0",
    "type": "module",
    "main": "server.mjs",
    "scripts": {
      "start": "node server.mjs"
    },
    "engines": {
      "node": ">=18.0.0"
    }
  };

  fs.writeFileSync('dist/package.json', JSON.stringify(productionPackage, null, 2));

  // Create a simple start script
  const startScript = `#!/usr/bin/env node
import './server.mjs';
`;
  
  fs.writeFileSync('dist/start.mjs', startScript);
  fs.chmodSync('dist/start.mjs', '755');

  console.log('✅ Deployment build completed successfully!');
  console.log('📁 Files generated:');
  console.log('   - dist/public/ (frontend assets)');
  console.log('   - dist/server.mjs (ES module server)');
  console.log('   - dist/package.json (production config)');
  console.log('🎯 Deploy the dist/ directory with: node server.mjs');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}