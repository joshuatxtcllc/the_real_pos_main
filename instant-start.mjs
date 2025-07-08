// Quick start script that starts the development server immediately
import { spawn } from 'child_process';

console.log('🚀 Starting development server...');

const server = spawn('tsx', ['server/index.ts'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development',
    PORT: '5000'
  }
});

server.on('error', (error) => {
  console.error('Server error:', error.message);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Server exited with code ${code}`);
    process.exit(code);
  }
});

// Keep process alive and handle shutdown
process.on('SIGTERM', () => {
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  server.kill('SIGINT');
});