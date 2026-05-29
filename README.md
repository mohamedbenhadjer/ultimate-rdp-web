# RDP Bridge Web

Marketing and invite landing page for RDP Bridge — a remote support management platform.

## Features

- Marketing landing page with download links
- Invite signup flow with password setup
- Automatic deep-link to desktop/mobile apps after signup
- GitHub Releases integration for download links

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS v4
- Supabase (authentication)
- Vercel (hosting)

## Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For production deployment on Vercel, add these as environment variables in the Vercel dashboard.

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy

The `vercel.json` configuration handles SPA routing automatically.

## Invite Flow

1. Admin sends invite via the admin app
2. User receives email with link: `/invite?token_hash=...&type=invite&role=agent|manager`
3. User lands on website and sees password setup form
4. User sets password → Supabase verifies OTP and creates account
5. Website fires deep link with session tokens: `rdpagent://login?access_token=...&refresh_token=...`
6. App opens and user is automatically logged in

## API Routes

- `/api/releases?app=admin|agent` — Proxies GitHub Releases API for download links

## Project Structure

```
src/
├── lib/
│   └── supabase.js          # Supabase client
├── pages/
│   ├── LandingPage.jsx      # Marketing page
│   └── InvitePage.jsx       # Invite signup flow
├── App.jsx                  # Router
└── main.jsx                 # Entry point
```
