# Setting Up Your TestEnv Manager Project Locally

## 1. Create New React Project

```bash
npm create vite@latest testenv-manager -- --template react-ts
cd testenv-manager
```

## 2. Install Dependencies

```bash
npm install @hookform/resolvers @supabase/supabase-js @types/react-router-dom date-fns lucide-react react react-dom react-hook-form react-hot-toast react-router-dom zod
npm install -D @eslint/js @types/react @types/react-dom @vitejs/plugin-react autoprefixer eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals postcss tailwindcss typescript typescript-eslint vite
```

## 3. Setup Tailwind CSS

```bash
npx tailwindcss init -p
```

## 4. Copy Configuration Files

Copy these files from your Bolt project:
- `tailwind.config.js`
- `postcss.config.js`
- `eslint.config.js`
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `vite.config.ts`

## 5. Copy Source Files

Copy the entire `src/` directory with all components and utilities.

## 6. Copy Root Files

- `index.html`
- `package.json` (merge dependencies)
- `.env` (create with your Supabase credentials)
- All deployment config files (vercel.json, netlify.toml, etc.)

## 7. Initialize Git and Push

```bash
git init
git add .
git commit -m "Initial commit: TestEnv Manager"
git branch -M main
git remote add origin https://github.com/yourusername/testenv-manager.git
git push -u origin main
```

## 8. Environment Variables

Create `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 9. Test Locally

```bash
npm run dev
```

Your application should now be running locally and ready for deployment!