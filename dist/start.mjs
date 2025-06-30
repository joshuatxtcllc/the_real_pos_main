#!/usr/bin/env node
process.env.NODE_ENV = 'production';
const PORT = process.env.PORT || '8080';
process.env.PORT = PORT;
console.log('Starting server on port', PORT);
import('./server.mjs').catch(error => {
  console.error('Server failed:', error);
  process.exit(1);
});