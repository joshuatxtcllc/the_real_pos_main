
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting development servers...');

// Start backend server
const backend = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  cwd: __dirname
});

// Start frontend server
const frontend = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  cwd: join(__dirname, 'client')
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down development servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

backend.on('error', (err) => {
  console.error('Backend server error:', err);
});

frontend.on('error', (err) => {
  console.error('Frontend server error:', err);
});
