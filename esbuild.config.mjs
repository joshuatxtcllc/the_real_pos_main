#!/usr/bin/env node

import { build } from 'esbuild';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function buildProduction() {
  console.log('Building for production with ES module support...');
  
  try {
    // Clean dist directory
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true, force: true });
    }
    fs.mkdirSync('dist', { recursive: true });

    // Build frontend with Vite
    console.log('Building frontend...');
    execSync('npx vite build --config vite.deploy.config.ts', { stdio: 'inherit' });
    
    // Build server as ES module
    console.log('Building server...');
    await build({
      entryPoints: ['server/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'esm',
      outfile: 'dist/index.mjs',
      packages: 'external',
      minify: false,
      sourcemap: false,
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      banner: {
        js: `// ES Module compatibility shims
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`
      }
    });
    
    // Create production package.json with ES module configuration
    const productionPkg = {
      "name": "framing-pos",
      "version": "1.0.0",
      "type": "module",
      "main": "index.mjs",
      "scripts": {
        "start": "node index.mjs"
      },
      "engines": {
        "node": ">=18.0.0"
      }
    };
    
    fs.writeFileSync('dist/package.json', JSON.stringify(productionPkg, null, 2));
    
    console.log('✅ Production build complete');
    console.log('📁 Built files are in the dist/ directory');
    console.log('🚀 Start production server with: cd dist && npm start');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildProduction();