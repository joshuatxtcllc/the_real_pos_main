# Deployment Instructions

## ES Modules Issues Fixed:

1. ✅ Changed esbuild format from 'cjs' to 'esm'
2. ✅ Updated output extension to .mjs for ES modules
3. ✅ Added "type": "module" to package.json
4. ✅ Fixed import.meta usage compatibility
5. ✅ Updated start command for ES modules
6. ✅ Included theme.json for production

## Deployment:

### Option 1: Build frontend separately
```bash
# Build frontend
npx vite build --config vite.deploy.config.ts

# Deploy
cd dist
node server.mjs
```

### Option 2: Static-only deployment
```bash
cd dist
NODE_ENV=production node server.mjs
```

## Environment Variables Required:
- DATABASE_URL
- NODE_ENV=production
- PORT (optional, defaults to 5000)

The ES modules format compatibility issue has been completely resolved.
