#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testDeployment() {
  console.log('🧪 Testing deployment build...');
  
  try {
    // Test TypeScript compilation
    console.log('📝 Checking TypeScript compilation...');
    await execAsync('npx tsc --noEmit --skipLibCheck');
    console.log('✅ TypeScript compilation successful');
    
    // Test esbuild compilation
    console.log('📦 Testing esbuild compilation...');
    await execAsync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/test-server.mjs --define:process.env.NODE_ENV=\"production\" --minify');
    console.log('✅ ESBuild compilation successful');
    
    console.log('🎉 All deployment tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Deployment test failed:', error.message);
    return false;
  }
}

testDeployment().then(success => {
  if (success) {
    console.log('\n🚀 Application is ready for deployment!');
  } else {
    console.log('\n🔧 Additional fixes needed before deployment');
    process.exit(1);
  }
});
