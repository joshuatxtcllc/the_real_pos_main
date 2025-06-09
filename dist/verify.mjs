#!/usr/bin/env node
import fs from 'fs';

console.log('Verifying deployment package...');

const checks = [
  { file: 'server.mjs', desc: 'ES module server' },
  { file: 'package.json', desc: 'Package configuration' },
  { file: 'README.md', desc: 'Deployment instructions' }
];

let allGood = true;
for (const check of checks) {
  if (fs.existsSync(check.file)) {
    console.log('✓', check.desc);
  } else {
    console.log('✗', check.desc, 'MISSING');
    allGood = false;
  }
}

if (allGood) {
  console.log('\n🚀 Deployment package ready!');
  console.log('Run: node server.mjs');
} else {
  console.log('\n❌ Deployment package incomplete');
  process.exit(1);
}
