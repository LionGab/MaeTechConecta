# Netlify Quick Start Guide

## Immediate Actions Required

### 1. Configure Environment Variables (CRITICAL)

Go to: https://app.netlify.com/sites/nossamaternidade/settings/environment

**Required Variables:**

```bash
# Supabase (REQUIRED for app to work)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://your-project.supabase.co/functions/v1

# Gemini API (REQUIRED for AI chat)
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key_here
```

**Get Supabase Keys:**
1. Go to https://app.supabase.com
2. Select your project
3. Settings → API
4. Copy URL and anon key

**Get Gemini Key:**
1. Go to https://makersuite.google.com/app/apikey
2. Create new API key
3. Copy the key

### 2. Trigger First Deployment

After adding environment variables:

**Option A: From GitHub**
```bash
# Make any small change and push
git add netlify.toml NETLIFY_DEPLOYMENT_SETUP.md
git commit -m "chore: Add Netlify deployment configuration"
git push origin main
```

**Option B: Manual Deploy**
```bash
cd C:\Users\Usuario\Documents\LionNath
netlify deploy --prod
```

### 3. Monitor Deployment

1. Go to: https://app.netlify.com/sites/nossamaternidade/deploys
2. Watch the build log
3. Check for errors

### 4. Verify Deployment

Once deployed, visit:
- **Production URL:** https://www.nossamaternidade.com.br
- **Test Features:**
  - App loads without errors
  - Authentication works
  - AI chat functions properly

## Build Details

**Build Command:**
```bash
pnpm install && pnpm run build:web
```

**Publish Directory:**
```
dist
```

**Build Base:**
```
apps/mobile
```

## Common Issues

### Build Fails
- Check environment variables are set
- Review build log for specific errors
- Ensure pnpm dependencies are correct

### App Loads But Broken
- Environment variables not configured
- Check browser console for errors
- Verify Supabase connection

### Blank Page
- Check redirects are working
- Verify index.html in dist folder
- Check SPA routing configuration

## Quick Commands

```bash
# Check Netlify status
netlify status

# List sites
netlify sites:list

# Open admin dashboard
netlify open

# View deploy logs
netlify watch

# Deploy preview
netlify deploy

# Deploy to production
netlify deploy --prod
```

## Project URLs

- **Admin Dashboard:** https://app.netlify.com/sites/nossamaternidade
- **Live Site:** https://www.nossamaternidade.com.br
- **Deploy Logs:** https://app.netlify.com/sites/nossamaternidade/deploys
- **Settings:** https://app.netlify.com/sites/nossamaternidade/settings

## Support

For detailed information, see: `NETLIFY_DEPLOYMENT_SETUP.md`

---

**Quick Checklist:**
- [ ] Environment variables configured
- [ ] First deployment triggered
- [ ] Site loads successfully
- [ ] Features working properly
- [ ] Domain correctly configured
