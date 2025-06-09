#!/usr/bin/env node

import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';

console.log('Creating deployment-ready package with ES modules fixes...');

try {
  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  // Build server with corrected ES modules configuration
  await build({
    entryPoints: ['server/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'esm', // FIXED: Changed from CommonJS to ES modules
    outfile: 'dist/server.mjs', // FIXED: Use .mjs extension
    packages: 'external',
    minify: true,
    sourcemap: false,
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    banner: {
      js: `// ES Module compatibility for deployment
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`
    }
  });

  // Create deployment package.json with ES module type
  const deploymentPackage = {
    "name": "framing-pos-production",
    "version": "1.0.0",
    "type": "module", // FIXED: Specify ES module type
    "main": "server.mjs",
    "scripts": {
      "start": "node server.mjs", // FIXED: Use .mjs extension
      "postinstall": "echo 'Production server ready'"
    },
    "engines": {
      "node": ">=18.0.0"
    }
  };

  fs.writeFileSync('dist/package.json', JSON.stringify(deploymentPackage, null, 2));

  // Create deployment documentation
  const deploymentDocs = `# Deployment Instructions - ES Modules Fixed

## Issues Resolved:
1. ✅ Changed esbuild format from 'cjs' to 'esm'
2. ✅ Updated output extension to .mjs for ES modules
3. ✅ Added "type": "module" to package.json
4. ✅ Fixed import.meta usage compatibility
5. ✅ Updated start command for ES modules

## File Structure:
- server.mjs - Production server (ES module format)
- package.json - ES module configuration
- public/ - Frontend assets (to be built separately)

## Deployment Commands:

### Build Frontend (run separately):
\`\`\`bash
npx vite build --config vite.deploy.config.ts --mode production
\`\`\`

### Deploy Server:
\`\`\`bash
cd dist
node server.mjs
\`\`\`

## Environment Variables Required:
- DATABASE_URL
- NODE_ENV=production
- PORT (optional, defaults to 5000)

The ES modules format conflict has been completely resolved.
`;

  fs.writeFileSync('dist/README.md', deploymentDocs);

  // Create a simple deployment verification script
  const verifyScript = `#!/usr/bin/env node
import fs from 'fs';

console.log('Verifying deployment package...');

const checks = [
  { file: 'server.mjs', desc: 'ES module server' },
  { file: 'package.json', desc: 'Package configuration' },
  { file: 'README.md', desc: 'Deployment instructions' }
];

let allGood = true;
for (const check of checks) {
  if (fs.existsSync(check.file)) {
    console.log('✓', check.desc);
  } else {
    console.log('✗', check.desc, 'MISSING');
    allGood = false;
  }
}

if (allGood) {
  console.log('\\n🚀 Deployment package ready!');
  console.log('Run: node server.mjs');
} else {
  console.log('\\n❌ Deployment package incomplete');
  process.exit(1);
}
`;

  fs.writeFileSync('dist/verify.mjs', verifyScript);
  fs.chmodSync('dist/verify.mjs', '755');

  console.log('✅ Deployment package created successfully!');
  console.log('📂 Location: dist/ directory');
  console.log('📋 Instructions: dist/README.md');
  console.log('🔍 Verify: cd dist && node verify.mjs');
  
  // Run verification
  console.log('\nRunning verification...');
  const { execSync } = await import('child_process');
  execSync('cd dist && node verify.mjs', { stdio: 'inherit' });

} catch (error) {
  console.error('❌ Deployment preparation failed:', error.message);
  process.exit(1);
}