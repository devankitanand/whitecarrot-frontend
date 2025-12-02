# Careers Page Builder - Next.js Frontend

This is a Next.js version of the Careers Page Builder frontend, replicated from the original React + Vite implementation.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file (optional):
```
NEXT_PUBLIC_API_BASE_URL=
```

If `NEXT_PUBLIC_API_BASE_URL` is not set, it defaults to `/api` which will be proxied to `http://localhost:5000` via Next.js rewrites.

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js App Router pages
- `/components` - React components
- `/contexts` - React contexts (AuthContext)
- `/styles` - CSS files
- `/utils` - Utility functions (API client)

## Features

- Login/Register page
- Company editing dashboard (Brand, Content Sections, Jobs, Slug management)
- Public careers page
- Preview mode

The UI is identical to the original React + Vite frontend.
