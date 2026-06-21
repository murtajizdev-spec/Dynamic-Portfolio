# Portfolio CMS

A premium 3D animated portfolio website with a full admin CMS. The public site features particle animations, smooth scroll, and Framer Motion transitions. The admin dashboard lets you manage all content sections without touching code.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/portfolio run dev` — run the portfolio frontend (port 21113)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 (port 8080, path `/api`)
- DB: PostgreSQL + Drizzle ORM
- Frontend: React + Vite + Tailwind CSS + shadcn/ui
- 3D: Three.js + React Three Fiber + React Three Drei
- Animation: Framer Motion + Lenis smooth scroll
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema/` — all Drizzle table schemas (hero, about, skills, projects, services, experience, education, testimonials, blog, contact, settings)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contracts)
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks + Zod schemas
- `artifacts/api-server/src/routes/` — Express route handlers for each resource
- `artifacts/portfolio/src/pages/` — public pages (Home, Projects, Blog, Contact) + Admin dashboard
- `artifacts/portfolio/src/components/Scene.tsx` — Three.js particle field + hero shape

## Architecture decisions

- **Contract-first API**: OpenAPI spec → codegen → typed React Query hooks. Never write fetch calls manually.
- **Singleton resources** (hero, about, settings): use upsert pattern — single DB row, GET returns it or 404, PUT creates or updates.
- **WebGL graceful degradation**: `useWebGLSupport` hook checks for WebGL before mounting Canvas to prevent Vite overlay errors in GPU-less environments. Three.js renders in browsers with GPU.
- **Admin at `/admin`**: no authentication yet — add Clerk or Replit Auth before deploying publicly.
- **Snake_case DB columns, camelCase TS properties**: Drizzle maps them. Always check both when debugging.

## Product

- **Public portfolio**: Hero with 3D particle animation, About, Skills grid with proficiency bars, Projects showcase, Work history timeline, Footer
- **Admin CMS** at `/admin`: Dashboard with live stats, CRUD editors for Hero, About, Skills, Projects, Services, Experience, Education, Testimonials, Blog posts, Contact messages, Site settings

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run `pnpm run typecheck:libs` after any changes to `lib/*` packages before checking artifact packages.
- The API server build is ~2.2MB (bundled) — normal for the Express + Drizzle + Pino stack.
- `pnpm run dev` at the workspace root has no dev script by design — use `restart_workflow` or per-package `--filter` commands.
- WebGL doesn't work in Replit's preview sandbox (no GPU). The `useWebGLSupport` hook handles this. Deploy to see full 3D effects.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
