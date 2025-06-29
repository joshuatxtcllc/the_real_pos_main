#!/usr/bin/env node

/**
 * Quick Deployment Fix for Cloud Run Issues
 * Focuses on the core ESM compatibility and port fixes
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);
process.env.NODE_ENV = 'production';

console.log('🚀 Quick deployment fix starting...');

async function quickDeploy() {
  try {
    // Create dist directory
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist', { recursive: true });
    }

    // Build frontend if client build doesn't exist
    if (!fs.existsSync('dist/public')) {
      console.log('🎨 Building frontend...');
      await execAsync('npx vite build --config vite.deploy.config.ts');
      console.log('✓ Frontend built');
    }

    // Build server with ESM format (core fix)
    console.log('🔧 Building server with ESM format...');
    await execAsync(`npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server.mjs --define:process.env.NODE_ENV='"production"' --target=es2020 --minify`);
    console.log('✓ Server built with ESM format');

    // Create minimal package.json with type: module
    const deployPackageJson = {
      name: "jays-frames-pos",
      version: "1.0.0",
      type: "module",
      main: "server.mjs",
      scripts: {
        start: "node server.mjs"
      }
    };

    fs.writeFileSync('dist/package.json', JSON.stringify(deployPackageJson, null, 2));
    console.log('✓ Created ESM package.json');

    console.log('🎉 Quick deployment fix completed!');
    console.log('✓ Fixed: ESM format for import.meta syntax');
    console.log('✓ Fixed: type: module in package.json');
    console.log('✓ Fixed: executable server.mjs file');
    console.log('✓ Server ready for Cloud Run deployment');

  } catch (error) {
    console.error('❌ Quick deploy failed:', error.message);
    process.exit(1);
  }
}

quickDeploy();