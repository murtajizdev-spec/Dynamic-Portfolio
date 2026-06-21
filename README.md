# Dynamic Portfolio

A premium 3D animated portfolio website with a full admin CMS. The public site features particle animations, smooth scroll, and Framer Motion transitions. The admin dashboard lets you manage all content sections without touching code.

## Live Demo

Deploy on Vercel — see deployment guide below.

## Features

- **3D Hero** — Three.js particle field with React Three Fiber (GPU-accelerated)
- **Smooth scroll** — Lenis smooth scroll + Framer Motion page transitions
- **Admin CMS** at `/admin` — manage Hero, About, Skills, Projects, Services, Experience, Education, Testimonials, Blog posts, and Site Settings
- **Contact messages** — submissions saved to the database, readable in admin
- **Fully responsive** — mobile-first Tailwind CSS design

## Stack

- **Frontend**: React 19 + Vite + Tailwind CSS + shadcn/ui
- **3D / Animation**: Three.js + React Three Fiber + Framer Motion + Lenis
- **API**: Express 5 (Node.js)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod + drizzle-zod
- **API contract**: OpenAPI 3.0 → Orval codegen → typed React Query hooks

## Quick Start (Development)

```bash
# Install dependencies
pnpm install

# Push DB schema
pnpm --filter @workspace/db run push

# Start API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Start frontend (port configured via PORT env var)
pnpm --filter @workspace/portfolio run dev
```

Required env vars:
```
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=your-admin-password
SESSION_SECRET=any-long-random-string
PORT=3000
BASE_PATH=/
```

## Deploy on Vercel

1. **Get free PostgreSQL** at [neon.tech](https://neon.tech) — copy the connection string
2. **Push schema to Neon**:
   ```bash
   DATABASE_URL="your-neon-url" pnpm --filter @workspace/db run push
   ```
3. **Import repo on [vercel.com](https://vercel.com)** — the `vercel.json` handles everything automatically
4. **Add environment variables** in Vercel dashboard:
   - `DATABASE_URL` — your Neon connection string
   - `ADMIN_PASSWORD` — your admin password
   - `SESSION_SECRET` — any long random string
5. Deploy ✅

Admin panel at `https://your-project.vercel.app/admin`

## Project Structure

```
artifacts/
  api-server/     # Express API (deployable as Vercel serverless function)
  portfolio/      # React + Vite frontend
lib/
  db/             # Drizzle ORM schema + database client
  api-spec/       # OpenAPI spec (source of truth)
  api-client-react/ # Generated React Query hooks
  api-zod/        # Generated Zod schemas
api/
  index.ts        # Vercel serverless entry point
vercel.json       # Vercel deployment config
```

## License

MIT
# Dynamic-Portfolio
