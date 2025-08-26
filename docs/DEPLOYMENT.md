# Deployment Guide

This guide covers various deployment options for NetCraft AI, from development to production environments.

## Table of Contents

- [Build Configuration](#build-configuration)
- [Static Hosting](#static-hosting)
- [Cloud Platforms](#cloud-platforms)
- [Self-Hosting](#self-hosting)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

## Build Configuration

### Production Build

NetCraft AI uses Vite for building and bundling:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Build Output

The build process creates a `dist/` directory with:

```
dist/
├── assets/              # Bundled CSS and JS files
│   ├── index-[hash].css
│   └── index-[hash].js
├── vite.svg            # Favicon
└── index.html          # Entry point
```

### Build Configuration

Key settings in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: './',              // Relative paths for flexible deployment
  build: {
    outDir: 'dist',        # Output directory
    assetsDir: 'assets',   # Assets subdirectory
    sourcemap: true        # Source maps for debugging
  },
  server: {
    port: 3000,
    open: true
  }
})
```

## Static Hosting

NetCraft AI is a Single Page Application (SPA) that can be deployed to any static hosting service.

### Vercel (Recommended)

**Automatic Deployment:**

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel automatically detects Vite and deploys

**Manual Deployment:**

```bash
# Install Vercel CLI
npm i -g vercel

# Build and deploy
npm run build
vercel --prod
```

**Configuration (`vercel.json`):**

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Netlify

**Drag & Drop Deployment:**

1. Build the project: `npm run build`
2. Drag the `dist/` folder to Netlify's deploy interface

**Git-based Deployment:**

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

**Configuration (`netlify.toml`):**

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### GitHub Pages

**Using GitHub Actions:**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

**Manual Deployment:**

```bash
# Build the project
npm run build

# Deploy to gh-pages branch
npx gh-pages -d dist
```

## Cloud Platforms

### AWS S3 + CloudFront

**S3 Bucket Setup:**

1. Create S3 bucket with public read access
2. Enable static website hosting
3. Upload `dist/` contents to bucket

**CloudFront Distribution:**

1. Create CloudFront distribution
2. Set S3 bucket as origin
3. Configure custom error pages for SPA routing:
   - Error Code: 403, 404
   - Response Page Path: `/index.html`
   - Response Code: 200

**AWS CLI Deployment:**

```bash
# Build the project
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Google Cloud Storage

```bash
# Build the project
npm run build

# Upload to GCS bucket
gsutil -m rsync -r -d dist/ gs://your-bucket-name

# Set up load balancer for SPA routing
gcloud compute url-maps create netcraft-ai-map \
  --default-backend-bucket=your-bucket-name
```

### Azure Static Web Apps

**GitHub Integration:**

1. Create Azure Static Web App
2. Connect to GitHub repository
3. Azure automatically detects Vite configuration

**Configuration (`staticwebapp.config.json`):**

```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "mimeTypes": {
    ".js": "text/javascript",
    ".css": "text/css"
  }
}
```

## Self-Hosting

### Docker

**Dockerfile:**

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

**Build and run:**

```bash
# Build Docker image
docker build -t netcraft-ai .

# Run container
docker run -p 8080:80 netcraft-ai
```

### Apache

**`.htaccess` for SPA routing:**

```apache
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
    Header set Cache-Control "public, immutable"
</FilesMatch>

# Security headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
```

## Performance Optimization

### Build Optimization

**Vite Configuration:**

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          motion: ['framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

### Compression

**Enable gzip/brotli compression:**

```nginx
# Nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

# Brotli (if available)
brotli on;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### CDN Configuration

**Cache Headers:**

```
# Static assets (1 year)
/assets/* -> Cache-Control: public, max-age=31536000, immutable

# HTML files (no cache)
/*.html -> Cache-Control: no-cache, no-store, must-revalidate

# Service worker (if added)
/sw.js -> Cache-Control: no-cache
```

## Environment Variables

NetCraft AI is a client-side application, but you can configure build-time variables:

**`.env.production`:**

```env
VITE_APP_VERSION=1.0.0
VITE_APP_BUILD_DATE=2025-01-01
VITE_APP_ENVIRONMENT=production
```

**Usage in code:**

```typescript
const version = import.meta.env.VITE_APP_VERSION;
```

## Monitoring & Analytics

### Error Tracking

**Sentry Integration:**

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});
```

### Performance Monitoring

**Web Vitals:**

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Security Considerations

### Content Security Policy

**CSP Header:**

```
Content-Security-Policy: default-src 'self'; 
  script-src 'self' 'unsafe-inline'; 
  style-src 'self' 'unsafe-inline' fonts.googleapis.com; 
  font-src 'self' fonts.gstatic.com; 
  img-src 'self' data: blob:;
```

### HTTPS

Always serve NetCraft AI over HTTPS in production:

- Protects user data in transit
- Required for modern browser features
- Improves SEO rankings
- Enables service workers (if added)

## Troubleshooting

### Common Issues

**1. Blank page after deployment**

- Check browser console for errors
- Verify `base` path in `vite.config.ts`
- Ensure SPA routing is configured

**2. 404 errors on refresh**

- Configure server to serve `index.html` for all routes
- Check `.htaccess`, `nginx.conf`, or platform-specific routing

**3. Assets not loading**

- Verify asset paths are relative
- Check CORS headers if using CDN
- Ensure proper MIME types are set

**4. Large bundle size**

- Analyze bundle with `npm run build -- --analyze`
- Implement code splitting
- Remove unused dependencies

### Debug Build

**Local debugging:**

```bash
# Build with source maps
npm run build

# Serve locally
npm run preview

# Or use any static server
npx serve dist
```

### Performance Testing

**Lighthouse:**

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://your-domain.com --output html --output-path ./lighthouse-report.html
```

**Bundle Analysis:**

```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ filename: 'dist/stats.html', open: true })
  ]
});
```

## Checklist

Before deploying to production:

- [ ] Run `npm run build` successfully
- [ ] Test production build locally with `npm run preview`
- [ ] Configure SPA routing on hosting platform
- [ ] Set up proper cache headers
- [ ] Enable compression (gzip/brotli)
- [ ] Configure security headers
- [ ] Test on multiple browsers and devices
- [ ] Verify all routes work correctly
- [ ] Check performance with Lighthouse
- [ ] Set up monitoring and error tracking
- [ ] Configure backup and recovery procedures

## Support

For deployment issues:

- Check the [GitHub Issues](https://github.com/netcraft-ai/issues)
- Review platform-specific documentation
- Test locally first with `npm run preview`
- Verify browser console for errors