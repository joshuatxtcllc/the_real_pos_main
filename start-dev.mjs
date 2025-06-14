
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting development servers...');

// Check if port 5000 is already in use
import { createServer } from 'net';

function checkPort(port) {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(port, () => {
      server.close(() => resolve(false)); // Port is free
    });
    server.on('error', () => resolve(true)); // Port is in use
  });
}

async function startServers() {
  const portInUse = await checkPort(5000);
  if (portInUse) {
    console.log('Port 5000 is already in use. Cleaning up...');
    // Kill any existing processes using port 5000
    try {
      await new Promise((resolve, reject) => {
        const killProcess = spawn('pkill', ['-f', 'tsx server/index.ts'], { stdio: 'inherit' });
        killProcess.on('close', () => resolve());
        killProcess.on('error', () => resolve()); // Continue even if kill fails
      });
      // Wait a moment for cleanup
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.log('Cleanup completed');
    }
  }

  // Start backend server
  console.log('Starting backend server on port 5000...');
  const backend = spawn('npx', ['tsx', 'server/index.ts'], {
    stdio: ['inherit', 'inherit', 'inherit'],
    cwd: __dirname,
    env: { ...process.env, NODE_ENV: 'development' }
  });

  // Wait for backend to start before starting frontend
  console.log('Waiting for backend to initialize...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Start frontend server on a different port to avoid conflicts
  console.log('Starting frontend server on port 5173...');
  const frontend = spawn('npx', ['vite', 'client', '--port', '5173', '--host', '0.0.0.0', '--force'], {
    stdio: ['inherit', 'inherit', 'inherit'],
    cwd: __dirname,
    env: { ...process.env, NODE_ENV: 'development' }
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\nShutting down development servers...');
    backend.kill('SIGTERM');
    frontend.kill('SIGTERM');
    setTimeout(() => {
      backend.kill('SIGKILL');
      frontend.kill('SIGKILL');
      process.exit(0);
    }, 5000);
  });

  backend.on('error', (err) => {
    console.error('Backend server error:', err);
  });

  frontend.on('error', (err) => {
    console.error('Frontend server error:', err);
  });

  backend.on('exit', (code) => {
    if (code !== 0) {
      console.error('Backend server exited with code:', code);
    }
  });

  frontend.on('exit', (code) => {
    if (code !== 0) {
      console.error('Frontend server exited with code:', code);
    }
  });
}

startServers().catch(console.error);
