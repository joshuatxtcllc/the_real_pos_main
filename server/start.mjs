
#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const startServer = async () => {
  try {
    // Check if server file exists
    const serverPath = join(__dirname, 'server.mjs');
    if (!fs.existsSync(serverPath)) {
      console.error('❌ Server file not found:', serverPath);
      process.exit(1);
    }
    
    console.log('🚀 Starting Jay\'s Frames POS Server...');
    
    const server = spawn('node', [serverPath], {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: '5000'
      }
    });
    
    server.on('error', (error) => {
      console.error('❌ Server startup error:', error.message);
      process.exit(1);
    });
    
    server.on('close', (code) => {
      console.log(`Server exited with code ${code}`);
      if (code !== 0) {
        process.exit(1);
      }
    });
    
    // Handle graceful shutdown
    ['SIGINT', 'SIGTERM'].forEach(signal => {
      process.on(signal, () => {
        console.log(`Received ${signal}, shutting down...`);
        server.kill();
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
