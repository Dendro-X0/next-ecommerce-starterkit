# Architecture

## Tech Stack (Summary)
- Framework: Next.js 15, React 19
- Language: TypeScript (strict)
- Monorepo: Turborepo + pnpm
- API: Hono mounted via Route Handlers (`apps/web/src/app/api/*`)
- Auth: Better Auth (`@repo/auth`) at `/api/auth/[...all]`
- DB/ORM: Postgres + Drizzle (`@repo/db`), centralized migrations/seeds
- UI: Tailwind CSS + shadcn/ui + shared `@repo/ui`
- Data: TanStack Query (queries/mutations, optimistic updates)
- State/URL: Zustand, nuqs
- Email: `@repo/mail` (SMTP in dev, Resend in prod)

## Monorepo Layout (Overview)
- `apps/web` — Next.js app (frontend + API Route Handlers)
- `packages/api` — Hono app (routes/middleware) used by web
- `packages/auth` — Better Auth server instance/config
- `packages/db` — Drizzle schema, migrations, seeding
- `packages/mail` — Mail transport abstraction
- `packages/ui` — Shared UI primitives
- `packages/*-config` — Shared TS/ESLint configs

## API Conventions
- Base: `/api/v1/*`
- Responses: Zod‑validated; errors as `{ error, code }`
- Pagination: `page`, `pageSize`, `total`
- Sorting: `newest`, `price_asc`, `price_desc`, `rating`, `popularity`
- Auth: Better Auth; admin routes protected by `ensureAdmin`
