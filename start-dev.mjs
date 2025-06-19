import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting development servers...');

let backend, frontend;

// Check if port 5000 is already in use before starting
import { createServer } from 'net';

function checkPort(port) {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    server.on('error', () => resolve(false));
  });
}

const portAvailable = await checkPort(5000);
if (!portAvailable) {
  console.log('✓ Backend already running on port 5000');
} else {
  console.log('🚀 Starting backend server on port 5000...');
  // Start backend server
  try {
    backend = spawn('tsx', ['server/index.ts'], {
      stdio: 'inherit',
      env: { 
        ...process.env, 
        NODE_ENV: 'development',
        PORT: '5000'
      }
    });

    backend.on('error', (error) => {
      console.error('❌ Backend startup error:', error.message);
    });

    backend.on('exit', (code) => {
      if (code !== 0) {
        console.error(`❌ Backend exited with code ${code}`);
      }
    });

    console.log('✓ Backend server started');
  } catch (error) {
    console.error('❌ Failed to start backend:', error.message);
  }
}

// Wait a moment for backend to start, then start frontend
setTimeout(() => {
  console.log('🚀 Starting frontend server on port 5173...');
  try {
    frontend = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5173'], {
      stdio: 'inherit',
      env: { 
        ...process.env,
        VITE_API_URL: 'http://localhost:5000'
      },
      cwd: process.cwd()
    });

    frontend.on('error', (error) => {
      console.error('❌ Frontend startup error:', error.message);
    });

    frontend.on('exit', (code) => {
      if (code !== 0) {
        console.error(`❌ Frontend exited with code ${code}`);
      }
    });

    console.log('✓ Frontend server started');
  } catch (error) {
    console.error('❌ Failed to start frontend:', error.message);
  }
}, 3000);

// Handle cleanup
const cleanup = () => {
  console.log('\nShutting down development servers...');
  if (backend) backend.kill('SIGTERM');
  if (frontend) frontend.kill('SIGTERM');

  setTimeout(() => {
    if (backend) backend.kill('SIGKILL');
    if (frontend) frontend.kill('SIGKILL');
    process.exit(0);
  }, 5000);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);