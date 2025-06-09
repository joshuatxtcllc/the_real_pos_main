#!/usr/bin/env node

import { execSync } from 'child_process';
import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building for production deployment...');

try {
  // Clean dist directory
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  fs.mkdirSync('dist', { recursive: true });
  fs.mkdirSync('dist/public', { recursive: true });

  // Build frontend with Vite
  console.log('📦 Building frontend...');
  execSync('npx vite build', { 
    stdio: 'inherit',
    timeout: 120000
  });

  // Build server with proper ES module support
  console.log('🔧 Building server...');
  await build({
    entryPoints: ['server/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'esm',
    outfile: 'dist/server.mjs',
    packages: 'external',
    minify: false,
    sourcemap: false,
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    banner: {
      js: `import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`
    }
  });

  // Create production package.json
  const prodPackage = {
    "name": "jays-frames-production",
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

  fs.writeFileSync('dist/package.json', JSON.stringify(prodPackage, null, 2));

  console.log('✅ Production build completed successfully!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}