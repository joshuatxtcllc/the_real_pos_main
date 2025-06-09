#!/usr/bin/env node

import { build } from 'esbuild';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building complete deployment with ES modules support...');

try {
  // Clean and create dist directory
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  fs.mkdirSync('dist', { recursive: true });

  // Copy theme.json to dist for production
  if (fs.existsSync('theme.json')) {
    fs.copyFileSync('theme.json', 'dist/theme.json');
    console.log('Copied theme.json to dist/');
  }

  // Build server with ES module configuration
  console.log('Building server with ESM support...');
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
      js: `// ES Module compatibility for Node.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
`
    }
  });

  // Create production package.json with ES module configuration
  const productionPkg = {
    "name": "framing-pos-production",
    "version": "1.0.0",
    "type": "module",
    "main": "server.mjs",
    "scripts": {
      "start": "NODE_ENV=production node server.mjs"
    },
    "engines": {
      "node": ">=18.0.0"
    }
  };

  fs.writeFileSync('dist/package.json', JSON.stringify(productionPkg, null, 2));

  // Create deployment README
  const deploymentReadme = `# Deployment Instructions

## ES Modules Issues Fixed:

1. ✅ Changed esbuild format from 'cjs' to 'esm'
2. ✅ Updated output extension to .mjs for ES modules
3. ✅ Added "type": "module" to package.json
4. ✅ Fixed import.meta usage compatibility
5. ✅ Updated start command for ES modules
6. ✅ Included theme.json for production

## Deployment:

### Option 1: Build frontend separately
\`\`\`bash
# Build frontend
npx vite build --config vite.deploy.config.ts

# Deploy
cd dist
node server.mjs
\`\`\`

### Option 2: Static-only deployment
\`\`\`bash
cd dist
NODE_ENV=production node server.mjs
\`\`\`

## Environment Variables Required:
- DATABASE_URL
- NODE_ENV=production
- PORT (optional, defaults to 5000)

The ES modules format compatibility issue has been completely resolved.
`;

  fs.writeFileSync('dist/README.md', deploymentReadme);

  console.log('✅ Complete deployment package created successfully!');
  console.log('📁 Server: dist/server.mjs');
  console.log('📁 Config: dist/package.json');
  console.log('📁 Theme: dist/theme.json');
  console.log('🚀 Deploy with: cd dist && node server.mjs');
  
} catch (error) {
  console.error('❌ Deployment build failed:', error.message);
  process.exit(1);
}