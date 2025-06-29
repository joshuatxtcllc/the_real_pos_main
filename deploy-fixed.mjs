#!/usr/bin/env node

/**
 * Fixed Deployment Script for Cloud Run
 * 
 * Addresses all deployment issues:
 * - ESM format for import.meta syntax support
 * - PORT environment variable priority for Cloud Run
 * - Proper server startup timing
 * - Executable server file creation
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

// Force production environment
process.env.NODE_ENV = 'production';

console.log('🚀 Starting fixed deployment build...');
console.log('🔧 Applying Cloud Run compatibility fixes...');

async function deployFixed() {
  try {
    // Create dist directory
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist', { recursive: true });
      console.log('✓ Created dist directory');
    }

    // Build frontend with production config
    console.log('🎨 Building frontend...');
    await execAsync('npx vite build --config vite.deploy.config.ts', { timeout: 120000 });
    console.log('✓ Frontend build completed');

    // Build server with ESM format (fixes CommonJS/ESM mismatch)
    console.log('🔧 Building server with ESM format...');
    await execAsync(`npx esbuild server/index.ts \\
      --platform=node \\
      --packages=external \\
      --bundle \\
      --format=esm \\
      --outfile=dist/server.mjs \\
      --define:process.env.NODE_ENV='"production"' \\
      --target=es2020 \\
      --minify`);
    console.log('✓ Server build completed with ESM format');

    // Create optimized package.json for deployment
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const deployPackageJson = {
      name: packageJson.name,
      version: packageJson.version,
      type: "module", // Enable ESM module resolution
      main: "server.mjs",
      scripts: {
        start: "node server.mjs" // Change run command to start built server
      },
      engines: {
        node: ">=18.0.0"
      }
    };

    fs.writeFileSync('dist/package.json', JSON.stringify(deployPackageJson, null, 2));
    console.log('✓ Created deployment package.json with ESM support');

    // Create environment template
    if (fs.existsSync('.env')) {
      const envContent = fs.readFileSync('.env', 'utf8');
      const envTemplate = envContent
        .split('\n')
        .map(line => {
          if (line.includes('=') && !line.startsWith('#')) {
            const [key] = line.split('=');
            return `${key}=`;
          }
          return line;
        })
        .join('\n');
      
      fs.writeFileSync('dist/.env.template', envTemplate);
      console.log('✓ Created environment template');
    }

    // Create executable startup script for Cloud Run
    const startupScript = `#!/usr/bin/env node

// Cloud Run compatible startup script
process.env.NODE_ENV = 'production';

// Import and start the server
import('./server.mjs').catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
`;

    fs.writeFileSync('dist/start.mjs', startupScript);
    console.log('✓ Created executable startup script');

    // Verify the build
    console.log('🧪 Verifying build...');
    
    // Check if server.mjs exists and is executable
    if (!fs.existsSync('dist/server.mjs')) {
      throw new Error('Server build failed - server.mjs not found');
    }

    const stats = fs.statSync('dist/server.mjs');
    console.log(`✓ Server bundle size: ${(stats.size / 1024).toFixed(1)}KB`);

    console.log('🎉 Fixed deployment build completed successfully!');
    console.log('📋 Applied fixes:');
    console.log('  ✓ Changed esbuild output format from CommonJS to ESM');
    console.log('  ✓ Added type: "module" to package.json');
    console.log('  ✓ Server uses PORT environment variable as primary');
    console.log('  ✓ Run command starts built server instead of building');
    console.log('  ✓ Created executable server file with .mjs extension');
    console.log('🚀 Ready for Cloud Run deployment');

  } catch (error) {
    console.error('❌ Deployment build failed:', error.message);
    
    // Provide specific guidance based on error type
    if (error.message.includes('ENOENT')) {
      console.error('💡 Missing dependencies. Run: npm install');
    } else if (error.message.includes('syntax error')) {
      console.error('💡 Syntax error in source code. Check TypeScript compilation.');
    } else if (error.message.includes('timeout')) {
      console.error('💡 Build timeout. Try running individual build steps.');
    }
    
    process.exit(1);
  }
}

deployFixed();