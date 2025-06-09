import { build } from 'esbuild';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildForProduction() {
  console.log('Building for production deployment...');

  try {
    // Clean dist directory
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true, force: true });
    }
    fs.mkdirSync('dist', { recursive: true });

    // Build frontend using vite deploy config
    console.log('Building frontend...');
    execSync('npx vite build --config vite.deploy.config.ts', { 
      stdio: 'inherit',
      cwd: __dirname 
    });

    // Build server with proper ESM configuration
    console.log('Building server...');
    await build({
      entryPoints: [resolve(__dirname, 'server/index.ts')],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'esm',
      outdir: 'dist',
      outExtension: { '.js': '.mjs' },
      packages: 'external',
      minify: false,
      sourcemap: false,
      define: {
        'process.env.NODE_ENV': '"production"',
      },
      banner: {
        js: `// ES Module Server Build
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`,
      },
      external: [
        'express',
        'cors', 
        'helmet',
        'discord.js',
        '@supabase/supabase-js',
        '@neondatabase/serverless',
        'drizzle-orm',
        'stripe',
        'twilio',
        '@sendgrid/mail',
        'openai',
        'ws',
        'canvas',
        'multer',
        'pdf-parse',
        'mammoth',
        'xlsx',
        'xml2js',
        'csv-parser',
        'qrcode',
        'jsonwebtoken',
        'passport',
        'passport-local',
        'express-session',
        'connect-pg-simple',
        'express-rate-limit',
        'cookie-parser',
        'csurf',
        'memorystore'
      ]
    });

    // Create package.json for production
    const prodPackageJson = {
      "name": "framing-pos-production",
      "version": "1.0.0",
      "type": "module",
      "main": "index.mjs",
      "engines": {
        "node": ">=18.0.0"
      },
      "scripts": {
        "start": "node index.mjs"
      }
    };

    fs.writeFileSync(
      resolve(__dirname, 'dist/package.json'), 
      JSON.stringify(prodPackageJson, null, 2)
    );

    console.log('Production build completed successfully!');
    console.log('Files ready for deployment in dist/ directory');

  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildForProduction();