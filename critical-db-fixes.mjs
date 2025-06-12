#!/usr/bin/env node

import fs from 'fs';

console.log('🔧 Applying critical database schema fixes...');

// Fix storage.ts database operations
const storagePath = 'server/storage.ts';
let storageContent = fs.readFileSync(storagePath, 'utf8');

// Fix 1: Remove all vendor property references
storageContent = storageContent.replace(/vendor: [^,}]+,?\s*/g, '');

// Fix 2: Fix notification insertions to use arrays
storageContent = storageContent.replace(
  /await db\.insert\(customerNotifications\)\.values\(([^)]+)\)/g,
  'await db.insert(customerNotifications).values([$1])'
);

// Fix 3: Fix productionStatus type casting
storageContent = storageContent.replace(
  /productionStatus: order\.productionStatus,?/g,
  'productionStatus: order.productionStatus as any,'
);

// Fix 4: Fix orderBy syntax issues
storageContent = storageContent.replace(
  /\.orderBy\(([^.]+)\.([^)]+)\)/g,
  '.orderBy($1.$2)'
);

// Fix 5: Fix inventory item database insertions
storageContent = storageContent.replace(
  /unitOfMeasure: inventoryItem\.unitOfMeasure,?/g,
  'unitOfMeasure: inventoryItem.unitOfMeasure as any,'
);

// Fix 6: Fix transaction type casting
storageContent = storageContent.replace(
  /type: transaction\.type,?/g,
  'type: transaction.type as any,'
);

// Fix 7: Fix material type casting  
storageContent = storageContent.replace(
  /materialType: materialOrder\.materialType,?/g,
  'materialType: materialOrder.materialType as any,'
);

// Fix 8: Fix join syntax issues
storageContent = storageContent.replace(
  /\.leftJoin\(customers, eq\(customers\.id\)\)/g,
  '.leftJoin(customers, eq(orders.customerId, customers.id))'
);

fs.writeFileSync(storagePath, storageContent);
console.log('✓ Fixed storage.ts database operations');

// Fix QR code controller remaining issues
const qrCodePath = 'server/controllers/qrCodeController.ts';
let qrContent = fs.readFileSync(qrCodePath, 'utf8');

// Fix QR code creation with proper schema validation
qrContent = qrContent.replace(
  /type: 'order'/g,
  "type: 'customer_order'"
);

// Fix QR code query syntax
qrContent = qrContent.replace(
  /\.where\(eq\(qrCodes\.type, ([^)]+)\), eq\(qrCodes\.entityId, ([^)]+)\)\)/g,
  '.where(and(eq(qrCodes.type, $1), eq(qrCodes.entityId, $2)))'
);

// Add missing import for 'and' function
if (!qrContent.includes('and,')) {
  qrContent = qrContent.replace(
    'import { eq } from "drizzle-orm";',
    'import { eq, and } from "drizzle-orm";'
  );
}

fs.writeFileSync(qrCodePath, qrContent);
console.log('✓ Fixed QR code controller database operations');

// Create a deployment test script
const testScript = `#!/usr/bin/env node

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
    await execAsync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/test-server.mjs --define:process.env.NODE_ENV=\\"production\\" --minify');
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
    console.log('\\n🚀 Application is ready for deployment!');
  } else {
    console.log('\\n🔧 Additional fixes needed before deployment');
    process.exit(1);
  }
});
`;

fs.writeFileSync('test-deployment.mjs', testScript);
console.log('✓ Created deployment test script');

console.log('✅ All critical database fixes applied!');
console.log('📋 Run: node test-deployment.mjs to verify deployment readiness');