# R&S Jewellery - Deployment Guide

## Quick Deployment Options

### 1. Vercel (Recommended - Free)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project folder
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: rs-jewellery-store
# - Directory: . (current folder)
# - Want to override settings? No
```

### 2. Netlify (Free Alternative)
```bash
# Build your project first
npm run build

# Deploy to Netlify
# 1. Go to netlify.com
# 2. Drag & drop your "dist" folder
# 3. Or use Netlify CLI: npm install -g netlify-cli
```

### 3. GitHub Pages (Free)
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"homepage": "https://[your-username].github.io/rs-jewellery-store",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

## Production Setup

### Environment Variables
Create `.env.production`:
```
VITE_API_URL=https://your-domain.com/api
VITE_NODE_ENV=production
NODE_ENV=production
```

### Build Command
```bash
npm run build
```

### Domain Setup
After deployment, you can:
- Use free subdomain (your-site.vercel.app)
- Connect custom domain (your-domain.com)
- Set up SSL certificate (automatic)

## Next Steps
1. Choose deployment platform
2. Build your project
3. Deploy
4. Test live website
5. Set up custom domain (optional)
