#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

console.log('🚀 Starting deployment build process...');

async function deployBuild() {
  try {
    // Create dist directory if it doesn't exist
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist', { recursive: true });
      console.log('✓ Created dist directory');
    }

    // Build backend server (optimized for deployment)
    console.log('🔧 Building server for deployment...');
    await execAsync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server.mjs --define:process.env.NODE_ENV=\\"production\\" --minify');
    console.log('✓ Server build completed');

    // Copy package.json essentials for deployment
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const deployPackageJson = {
      name: packageJson.name,
      version: packageJson.version,
      type: "module",
      main: "server.mjs",
      scripts: {
        start: "node server.mjs"
      },
      dependencies: {
        // Only include production dependencies that are actually external
        "pg": packageJson.dependencies?.pg || "latest",
        "dotenv": packageJson.dependencies?.dotenv || "latest"
      }
    };

    fs.writeFileSync('dist/package.json', JSON.stringify(deployPackageJson, null, 2));
    console.log('✓ Created deployment package.json');

    // Copy environment template if .env exists
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

    console.log('🎉 Deployment build completed successfully!');
    console.log('📂 Build artifacts created in dist/ directory');
    console.log('🚀 Ready for deployment');

  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

deployBuild();