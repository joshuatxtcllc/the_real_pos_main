import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Frames catalog API
app.get('/api/frames', (req, res) => {
  try {
    const csvPath = path.join(__dirname, 'data', 'studio-moulding-catalog.csv');
    
    if (fs.existsSync(csvPath)) {
      const csvData = fs.readFileSync(csvPath, 'utf8');
      const lines = csvData.split('\n').filter(line => line.trim());
      
      const frameData = lines.slice(1).map((line, index) => {
        const values = line.split(',');
        const itemNumber = values[0] || `frame-${index}`;
        const description = values[1] || 'Custom Frame';
        const lengthPrice = values[2] || '10.00';
        const width = values[7] || '2';
        const height = values[8] || '1';
        
        return {
          id: `larson-${itemNumber}`,
          name: description,
          manufacturer: 'Larson-Juhl',
          material: 'wood',
          width: width.toString(),
          depth: height.toString(),
          color: description.includes('BROWN') ? '#8B4513' : 
                 description.includes('WALNUT') ? '#654321' : 
                 description.includes('HONEY') ? '#D4A574' : 
                 description.includes('COFFEE') ? '#6F4E37' : '#8B4513',
          price: lengthPrice,
          imageUrl: `https://www.larsonjuhl.com/contentassets/products/mouldings/${itemNumber}_fab.jpg`,
          description: description,
          itemNumber: itemNumber,
          inStock: true
        };
      });

      console.log(`✅ Loaded ${frameData.length} frames from Larson catalog`);
      res.json({ frames: frameData });
    } else {
      console.log('❌ No catalog file found at:', csvPath);
      res.json({ frames: [] });
    }
  } catch (error) {
    console.error('❌ Error loading frames catalog:', error);
    res.json({ frames: [] });
  }
});

// Serve static files with explicit MIME types to fix JavaScript loading
const staticPath = path.resolve(__dirname, 'dist', 'public');

// Custom static file handler with explicit MIME types
app.use('/assets', (req, res, next) => {
  const filePath = path.join(staticPath, 'assets', req.path);
  
  if (req.path.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  } else if (req.path.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
  }
  
  express.static(path.join(staticPath, 'assets'))(req, res, next);
});

// Serve other static files
app.use(express.static(staticPath, {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
  }
}));

// Handle React Router - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  const indexPath = path.join(staticPath, 'index.html');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(indexPath);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Jay's Frames POS System - Simple Server`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔌 Port: ${PORT}`);
  console.log(`📁 Serving from: ${staticPath}`);
  console.log(`🌐 Access at: http://0.0.0.0:${PORT}`);
  console.log(`✅ Server ready for connections`);
});