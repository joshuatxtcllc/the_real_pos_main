#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

console.log('🚀 Building server for deployment...');

async function buildServer() {
  try {
    // Create dist directory
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist', { recursive: true });
    }

    // Build server only
    console.log('🔧 Building server...');
    await execAsync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server.mjs --define:process.env.NODE_ENV=\\"production\\" --minify');
    
    // Create minimal package.json for deployment
    const deployPackage = {
      "name": "jay-frames-pos",
      "version": "1.0.0",
      "type": "module",
      "main": "server.mjs",
      "scripts": {
        "start": "node server.mjs"
      }
    };
    
    fs.writeFileSync('dist/package.json', JSON.stringify(deployPackage, null, 2));
    
    console.log('✅ Server build completed');
    console.log('📦 Files created in dist/');
    console.log('🚀 Ready for deployment');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

buildServer();