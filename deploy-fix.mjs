#!/usr/bin/env node

import { build } from 'esbuild';
import fs from 'fs';

console.log('Applying ES modules deployment fixes...');

try {
  // Clean dist directory
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  fs.mkdirSync('dist', { recursive: true });

  // Build server with proper ES module configuration
  console.log('Building server with ESM support...');
  await build({
    entryPoints: ['server/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'esm', // Fixed: Changed from 'cjs' to 'esm'
    outfile: 'dist/index.mjs', // Fixed: Use .mjs extension
    packages: 'external',
    minify: true,
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
    "type": "module", // Fixed: Specify ES module type
    "main": "index.mjs",
    "scripts": {
      "start": "node index.mjs" // Fixed: Use .mjs extension
    },
    "engines": {
      "node": ">=18.0.0"
    }
  };

  fs.writeFileSync('dist/package.json', JSON.stringify(productionPkg, null, 2));

  // Create deployment instructions
  const deployInstructions = `# Deployment Fixed

## Changes Applied:

1. **esbuild format**: Changed from 'cjs' to 'esm'
2. **Output extension**: Changed to .mjs for ES modules
3. **package.json**: Added "type": "module"
4. **Start command**: Updated to use .mjs extension

## To complete deployment:

1. Build frontend separately:
   \`\`\`bash
   npx vite build --config vite.deploy.config.ts
   \`\`\`

2. The server is now built as: dist/index.mjs

3. Deploy with: \`node dist/index.mjs\`

The ES modules format conflict has been resolved.
`;

  fs.writeFileSync('dist/DEPLOYMENT.md', deployInstructions);

  console.log('✅ ES modules deployment fixes applied successfully!');
  console.log('📁 Server built as: dist/index.mjs');
  console.log('📋 Check dist/DEPLOYMENT.md for instructions');
  
} catch (error) {
  console.error('❌ Fix failed:', error.message);
  process.exit(1);
}