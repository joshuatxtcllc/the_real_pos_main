#!/usr/bin/env node

// Bulletproof deployment - minimal, guaranteed to work
import { execSync } from 'child_process';
import fs from 'fs';

console.log('Creating bulletproof deployment...');

try {
  // Clean start
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  fs.mkdirSync('dist', { recursive: true });

  // Build only what we need
  console.log('Building server...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server.mjs --target=es2022', { stdio: 'inherit' });

  // Copy frontend if it exists, otherwise create minimal
  if (fs.existsSync('dist') && fs.readdirSync('dist').some(f => f === 'public')) {
    console.log('Using existing frontend');
  } else {
    console.log('Building frontend...');
    execSync('vite build --outDir dist/public', { stdio: 'inherit' });
  }

  // Minimal package.json
  const pkg = {
    "name": "jays-frames-pos",
    "type": "module",
    "main": "start.mjs",
    "scripts": { "start": "node start.mjs" }
  };
  fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, 2));

  // Ultra-simple startup script
  const start = `import('./server.mjs').catch(console.error);`;
  fs.writeFileSync('dist/start.mjs', start);

  console.log('Bulletproof deployment ready');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}