
#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';

console.log('Creating simple production deployment...');

// Clean dist
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}
fs.mkdirSync('dist');

// Copy entire server directory
execSync('cp -r server dist/', { stdio: 'inherit' });

// Copy package.json and modify for production
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = {
  "start": "tsx server/index.ts"
};
pkg.type = "module";
fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, 2));

// Copy other essential files
fs.copyFileSync('theme.json', 'dist/theme.json');
if (fs.existsSync('.env')) {
  fs.copyFileSync('.env', 'dist/.env');
}

// Create simple start script
const startScript = `#!/usr/bin/env node
process.env.NODE_ENV = 'production';
import('./server/index.ts');
`;
fs.writeFileSync('dist/start.mjs', startScript);

console.log('✅ Simple deployment ready in dist/');
console.log('Deploy with: cd dist && node start.mjs');
