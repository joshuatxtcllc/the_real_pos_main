import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildServer() {
  try {
    await build({
      entryPoints: [resolve(__dirname, 'server/index.ts')],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'esm',
      outdir: 'dist',
      outExtension: { '.js': '.mjs' },
      packages: 'external',
      define: {
        'import.meta.url': JSON.stringify('file://'),
      },
      banner: {
        js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
        `.trim(),
      },
    });
    
    console.log('✓ Server build completed successfully');
  } catch (error) {
    console.error('✗ Server build failed:', error);
    process.exit(1);
  }
}

buildServer();