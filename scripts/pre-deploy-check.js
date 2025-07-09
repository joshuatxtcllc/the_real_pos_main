
#!/usr/bin/env node

console.log('🔍 Running pre-deployment checks...\n');

// Check environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing environment variables:');
  missingEnvVars.forEach(envVar => console.error(`  - ${envVar}`));
  process.exit(1);
}

// Check if build artifacts exist
const fs = require('fs');
const path = require('path');

const buildArtifacts = [
  'dist/public/index.html',
  'dist/server.mjs'
];

const missingArtifacts = buildArtifacts.filter(artifact => !fs.existsSync(path.join(__dirname, '..', artifact)));

if (missingArtifacts.length > 0) {
  console.error('❌ Missing build artifacts:');
  missingArtifacts.forEach(artifact => console.error(`  - ${artifact}`));
  console.log('\n🔧 Run "npm run build" first');
  process.exit(1);
}

console.log('✅ All pre-deployment checks passed!');
console.log('🚀 Ready for deployment');
