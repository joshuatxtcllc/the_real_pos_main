#!/usr/bin/env node

// Production application startup
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || process.env.REPL_PORT || '5000';

import { exec } from 'child_process';
import fs from 'fs';

console.log('Starting production server...');

// Check for optimized build
const builtServer = fs.existsSync('./dist/server.mjs');

if (builtServer) {
  console.log('Using production build');
  exec('node ./dist/server.mjs', { 
    env: { ...process.env, NODE_ENV: 'production' } 
  });
} else {
  console.log('Starting TypeScript server');
  exec('npx tsx server/index.ts', { 
    env: { ...process.env, NODE_ENV: 'production' } 
  });
}