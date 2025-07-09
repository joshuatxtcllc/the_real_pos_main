import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔍 Running pre-deployment checks...\n');

// Check environment variables (supporting both naming conventions)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const missingEnvVars = [];
if (!supabaseUrl) {
  missingEnvVars.push('SUPABASE_URL or VITE_SUPABASE_URL');
}
if (!supabaseKey) {
  missingEnvVars.push('SUPABASE_KEY or VITE_SUPABASE_KEY or VITE_SUPABASE_ANON_KEY');
}

if (missingEnvVars.length > 0) {
  console.warn('⚠️  Optional environment variables not set:');
  missingEnvVars.forEach(envVar => console.warn(`  - ${envVar}`));
  console.log('📝 Note: Application will use mock clients for missing services');
} else {
  console.log('✅ All environment variables are properly configured');
}

// Check if build artifacts exist
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