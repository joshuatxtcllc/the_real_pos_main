#!/usr/bin/env node

import { build } from 'esbuild';
import fs from 'fs';

console.log('Applying ES modules deployment fixes...');

try {
  // Build server with proper ES module configuration
  console.log('Building server with ESM support...');
  await build({
    entryPoints: ['server/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'esm', // Fixed: Changed from 'cjs' to 'esm'
    outfile: 'dist/server.mjs', // Fixed: Use .mjs extension
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
    "name": "framing-pos-production",
    "version": "1.0.0",
    "type": "module", // Fixed: Specify ES module type
    "main": "server.mjs",
    "scripts": {
      "start": "node server.mjs" // Fixed: Use .mjs extension
    },
    "engines": {
      "node": ">=18.0.0"
    }
  };

  fs.writeFileSync('dist/package.json', JSON.stringify(productionPkg, null, 2));

  console.log('✅ ES modules deployment fixes applied successfully!');
  console.log('Server built as: dist/server.mjs');
  console.log('Deploy with: cd dist && node server.mjs');
  
} catch (error) {
  console.error('Fix failed:', error.message);
  process.exit(1);
}