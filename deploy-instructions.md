# Deployment Instructions

Your TestEnv Manager application is ready for deployment! Here are several options:

## Option 1: Vercel (Recommended)

Vercel offers excellent React/Vite support with automatic deployments.

### Steps:
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up
3. Click "New Project" and import your GitHub repository
4. Vercel will auto-detect it's a Vite project
5. Add environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
6. Deploy!

### CLI Method:
```bash
npm i -g vercel
vercel
# Follow prompts and add environment variables when asked
```

## Option 2: Netlify

Great for static sites with form handling capabilities.

### Steps:
1. Build the project: `npm run build`
2. Go to [netlify.com](https://netlify.com) and sign up
3. Drag and drop the `dist` folder to deploy
4. For continuous deployment, connect your GitHub repo
5. Update `netlify.toml` with your Supabase credentials
6. Add environment variables in Netlify dashboard

### CLI Method:
```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

## Option 3: GitHub Pages

Free hosting directly from your GitHub repository.

### Steps:
1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Enable GitHub Actions as source
4. Add repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. The workflow will automatically deploy on push to main

## Option 4: Railway

Modern platform with database support.

### Steps:
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables
4. Deploy automatically

## Option 5: Render

Simple static site hosting.

### Steps:
1. Go to [render.com](https://render.com)
2. Create new Static Site
3. Connect your GitHub repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add environment variables

## Environment Variables Needed

For all platforms, you'll need these environment variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from your Supabase project dashboard under Settings > API.

## Build Command

All platforms should use:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18+

## Notes

- The app is a Single Page Application (SPA), so make sure redirects are configured to serve `index.html` for all routes
- All deployment configs are included in the project files
- The application is production-ready with proper error handling and loading states