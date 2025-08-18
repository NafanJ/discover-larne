# Vercel Deployment Guide

## Quick Setup

1. **Connect to Vercel**
   - Push your code to GitHub
   - Import your repository in [Vercel](https://vercel.com)
   - Vercel will auto-detect Vite configuration

2. **Environment Variables**
   - In Vercel dashboard → Project Settings → Environment Variables
   - Add these variables:
     ```
     VITE_SUPABASE_URL=https://yggncfjphyywfkrqfkyi.supabase.co
     VITE_SUPABASE_ANON_KEY=your_anon_key_here
     ```
   - Set for Production, Preview, and Development environments

3. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be available at `https://your-project.vercel.app`

## Configuration Details

### Files Created
- `vercel.json` - Deployment configuration with SPA routing and security headers
- `.env.example` - Template for environment variables
- Updated `src/integrations/supabase/client.ts` - Now uses environment variables

### Features Configured
- ✅ SPA routing (all routes serve index.html)
- ✅ Asset caching for performance
- ✅ Security headers (XSS, CSRF protection)
- ✅ Environment variable support
- ✅ Optimized build settings

### Testing
1. Test locally: `npm run build && npm run preview`
2. Use Vercel preview deployments for staging
3. Monitor deployment logs in Vercel dashboard

Your app is now ready for production deployment! 🚀