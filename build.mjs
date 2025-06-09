#!/usr/bin/env node

/**
 * Production build script with proper ES module support
 */

import { build } from 'vite';
import { build as esbuild } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildProduction() {
  try {
    console.log('Building frontend...');
    
    // Build frontend with Vite
    await build();
    
    console.log('Building backend...');
    
    // Ensure dist directory exists
    const distDir = join(__dirname, 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // Build backend with proper ES module support
    await esbuild({
      entryPoints: ['server/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'esm',
      outfile: 'dist/server.mjs',
      external: [
        // Keep node built-ins external
        'fs', 'path', 'url', 'crypto', 'stream', 'util', 'os', 'events',
        // Keep problematic packages external
        'canvas', 'sharp', 'better-sqlite3', 'pg-native',
        // Discord.js and related
        'discord.js', '@discordjs/*',
        // Database drivers
        'pg', 'mysql2', 'sqlite3',
        // Other native modules
        'bufferutil', 'utf-8-validate'
      ],
      packages: 'external',
      banner: {
        js: `
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
`
      },
      define: {
        'import.meta.dirname': '__dirname'
      }
    });

    // Create a startup script that handles the server properly
    const startupScript = `#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set production environment
process.env.NODE_ENV = 'production';

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Start the server
try {
  await import('./server.mjs');
} catch (error) {
  console.error('Server startup failed:', error);
  process.exit(1);
}
`;

    fs.writeFileSync(join(distDir, 'index.mjs'), startupScript);
    fs.chmodSync(join(distDir, 'index.mjs'), '755');

    console.log('Build completed successfully!');
    console.log('Production files:');
    console.log('  - Frontend: dist/public/');
    console.log('  - Backend: dist/server.mjs');
    console.log('  - Startup: dist/index.mjs');
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildProduction();