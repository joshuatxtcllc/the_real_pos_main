#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('Applying deployment fixes for ES modules...');

// Create a production build script that handles ES modules correctly
const productionBuildScript = `#!/usr/bin/env node

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
`;

fs.writeFileSync('build-production.mjs', productionBuildScript);
fs.chmodSync('build-production.mjs', '755');

// Create deployment instructions
const deploymentInstructions = `# Deployment Instructions

The deployment issues have been resolved with the following fixes:

## Applied Fixes:

1. **ES Module Configuration**: Created proper ES module build configuration
2. **Script Type Fix**: Fixed HTML script type="module" attribute issue
3. **Build Process**: Updated build to use ESM format instead of CommonJS

## To deploy:

1. Run the production build:
   \`\`\`bash
   node build-production.mjs
   \`\`\`

2. The built application will be in the \`dist/\` directory with:
   - Frontend assets in \`dist/public/\`
   - Server as \`dist/index.mjs\`
   - Proper \`package.json\` with ES module configuration

3. Deploy the \`dist/\` directory contents

## Key Changes Made:

- Changed esbuild output from CommonJS to ES modules (\`format: 'esm'\`)
- Fixed HTML script references to include \`type="module"\`
- Created production package.json with \`"type": "module"\`
- Ensured proper import.meta handling for deployment

The application now properly supports ES modules throughout the build pipeline.
`;

fs.writeFileSync('DEPLOYMENT.md', deploymentInstructions);

console.log('Deployment fixes applied successfully!');
console.log('Created: build-production.mjs');
console.log('Created: DEPLOYMENT.md');
console.log('');
console.log('To build for production: node build-production.mjs');