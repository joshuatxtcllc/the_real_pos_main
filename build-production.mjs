#!/usr/bin/env node

import { execSync } from 'child_process';
import { build } from 'esbuild';
import fs from 'fs';

async function buildProduction() {
  console.log('Building for production with ES module support...');
  
  try {
    // Build frontend
    execSync('npx vite build --config vite.deploy.config.ts', { stdio: 'inherit' });
    
    // Build server as ES module
    await build({
      entryPoints: ['server/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'esm',
      outfile: 'dist/index.mjs',
      packages: 'external',
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    
    // Create proper package.json for production
    const pkg = {
      "name": "framing-pos",
      "type": "module",
      "main": "index.mjs",
      "scripts": {
        "start": "node index.mjs"
      }
    };
    
    fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, 2));
    
    console.log('Production build complete');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildProduction();
