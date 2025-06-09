import { build } from 'esbuild';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Deployment configuration that handles ES modules properly
async function deploymentBuild() {
  console.log('Starting deployment build process...');

  try {
    // Clean and create dist directory
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true, force: true });
    }
    fs.mkdirSync('dist', { recursive: true });
    fs.mkdirSync('dist/public', { recursive: true });

    // Build frontend
    console.log('Building frontend application...');
    execSync('npx vite build --config vite.deploy.config.ts --mode production', { 
      stdio: 'inherit' 
    });

    // Build server with proper ES module configuration
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
      metafile: false,
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      banner: {
        js: `import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);`
      }
    });

    // Create production package.json with ES module configuration
    const productionPackage = {
      "name": "framing-pos-app",
      "version": "1.0.0",
      "type": "module",
      "main": "server.mjs",
      "engines": {
        "node": ">=18.0.0"
      },
      "scripts": {
        "start": "node server.mjs"
      }
    };

    fs.writeFileSync('dist/package.json', JSON.stringify(productionPackage, null, 2));

    // Copy necessary files
    if (fs.existsSync('shared')) {
      fs.cpSync('shared', 'dist/shared', { recursive: true });
    }

    console.log('Deployment build completed successfully!');
    console.log('Output directory: dist/');
    console.log('Start command: cd dist && npm start');

  } catch (error) {
    console.error('Deployment build failed:', error.message);
    process.exit(1);
  }
}

deploymentBuild();