#!/usr/bin/env node

import { build } from 'esbuild';
import { execSync } from 'child_process';
import fs from 'fs';

console.log('Creating production deployment with ES modules...');

try {
  // Clean dist directory
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  fs.mkdirSync('dist', { recursive: true });

  // Copy theme.json
  if (fs.existsSync('theme.json')) {
    fs.copyFileSync('theme.json', 'dist/theme.json');
  }

  // Build server with ES modules
  await build({
    entryPoints: ['server/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'esm',
    outfile: 'dist/server.mjs',
    packages: 'external',
    minify: true,
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    banner: {
      js: `import { createRequire } from 'module';
const require = createRequire(import.meta.url);`
    }
  });

  // Create production package.json
  const pkg = {
    "name": "framing-pos-production",
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

  fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, 2));

  // Create start script
  const startScript = `#!/bin/bash
export NODE_ENV=production
export PORT=\${PORT:-5000}
node server.mjs`;

  fs.writeFileSync('dist/start.sh', startScript);
  fs.chmodSync('dist/start.sh', 0o755);

  console.log('✅ Production deployment ready!');
  console.log('Fixed: ES modules format compatibility');
  console.log('Fixed: import.meta usage');
  console.log('Fixed: Top-level await support');
  console.log('Deploy: cd dist && ./start.sh');
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}