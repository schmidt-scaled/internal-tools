# TestEnv Manager

A comprehensive test environment management system built with React, TypeScript, and Supabase.

## Features

- 📅 **Environment Reservations Calendar** - Visual calendar view of environment bookings
- 📋 **Reservations Management** - List view with filtering and status updates
- 🧪 **Test Run Tracking** - Monitor test execution with GitHub integration
- 📊 **Analytics Dashboard** - Insights into usage patterns and success rates
- ⚙️ **Settings Management** - Manage users, environments, and test types

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **UI Components**: Lucide React icons
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment Options

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts and add your environment variables

### Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy --prod --dir=dist`
3. Add environment variables in Netlify dashboard

### GitHub Pages (with GitHub Actions)
See `.github/workflows/deploy.yml` for automated deployment

## Database Schema

The application uses the following Supabase tables:
- `users` - User management
- `environments` - Test environments
- `test_types` - Types of tests
- `environment_reservations` - Environment bookings
- `test_runs` - Test execution tracking

## License

MIT License