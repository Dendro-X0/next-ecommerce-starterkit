# Next.js E‑Commerce Starterkit (Monorepo)

An end‑to‑end, production‑ready foundation for modern commerce. Built to learn from and launch with.

- Full‑stack Next.js 15 + React 19
- Strict TypeScript, modular monorepo, clear boundaries
- Auth, admin, payments, and real API clients out of the box

This template focuses on completeness and maintainability over vanity numbers. It packs practical patterns across the stack—so you can study the code with confidence, customize quickly, and ship faster.

---

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Architecture](./docs/architecture.md)
- [Frontend Architecture](./docs/frontend-architecture.md)
- [Testing](./docs/testing.md)
- [Deployment](./docs/deployment.md)
- [Payments Setup](./docs/payments.md)
- [Env Setup](./ENV_SETUP.md)
- [Troubleshooting](./docs/troubleshooting.md)
- [Development Mode Limitations](./docs/dev-mode-limitations.md)
- [Components Inventory](./docs/components.md)
- [Release Notes](./docs/release-notes.md)
- [Roadmap](./ROADMAP.md)

---

## Tech Stack

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

---

## Monorepo Layout

- `apps/web` — Next.js app (frontend + API Route Handlers)
- `packages/api` — Hono app (routes/middleware) used by web
- `packages/auth` — Better Auth server instance/config
- `packages/db` — Drizzle schema, migrations, seeding
- `packages/mail` — Mail transport abstraction
- `packages/ui` — Shared UI primitives
- `packages/*-config` — Shared TS/ESLint configs

---

## Quickstart

1) Install

```bash
pnpm install
```

2) Environment (`apps/web/.env.local`)

```bash
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB
WEB_ORIGIN=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-long-random-secret
```

3) Database

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed   # optional demo data
```

4) Develop

```bash
pnpm dev
```

---

## Scripts

- `pnpm dev` — start Next.js (API included)
- `pnpm dev:safe` — start Next.js with the minimalist safe-mode homepage (sets `NEXT_PUBLIC_SAFE_HOME=true`)
- `pnpm build` — build web
- `pnpm lint` / `pnpm typecheck` — quality gates
- `pnpm db:generate` / `pnpm db:migrate` / `pnpm db:seed`
- `pnpm -C packages/api test` — API unit/integration tests (Vitest)
- `pnpm -C apps/web test:e2e` — Playwright E2E (web)

---

## Conventions

- One typed client per API domain under `apps/web/src/lib/data/*` (single export per file)
- TanStack Query for all server interactions (queries + mutations)
- Query Keys collocated (e.g., `apps/web/src/lib/wishlist/query-keys.ts`)
- DTO→UI mapping at the client boundary; Zod schemas where applicable
- Avoid `any`; add explicit parameter/return types; use small, single‑purpose functions

---

## API

See [Architecture](./docs/architecture.md) (API conventions).

---

## Current Status

See “Status & v1.0 scope” below and [Release Notes](./docs/release-notes.md).

---

## Roadmap (Summary)

- U1: Addresses & Preferences — user settings foundations
- U2: Cart Persistence — server‑backed cart + client sync
- U3: Orders — checkout creates orders; order success; dashboard history
- U4: Wishlist — add/remove + dashboard
- U5: Reviews — PDP reviews + moderation
- U6: Affiliate — referral code + stats
- A: Admin CRUD — products/categories with RBAC
- H: Hardening — security headers, rate limits, logs, tests

Full detail: `ROADMAP.md`.

---

## Status & v1.0 scope

- Current focus: ship a stable v1.0 with core flows (auth, browse, PDP, cart, checkout→order, orders history, wishlist, contact).
- Payments: Stripe and PayPal integrations include idempotent intent/capture flows and webhook handling with duplicate-delivery protection. Comprehensive integration tests for both providers are passing.
- Remaining: E2E coverage (happy path, 3DS/failure/refund), CI polish, and SEO/deep-linked filters. Observability has initial coverage (rate limiting, validation, metrics).
- Details: see `./docs/release-notes.md`.

---

## Development Guidelines

- Use TanStack Query for data fetching/mutations (no manual `useEffect` for server data)
- Prefer optimistic updates and `invalidateQueries` on success
- Keep UI deterministic: loading skeletons, error states, and `data-testid` for E2E
- Use typed DTOs and mapping utilities; avoid leaking server DTOs into UI
- Follow monorepo import rules (prefer `@/modules/*`, `@repo/*`)

## Development Mode Limitations (Summary)

This project prioritizes production performance. In development, dev prefetch and HMR can cause heavy route compilation when paired with large client trees (e.g., navigation dropdowns). We mitigate this by using RSC for `Header`/`Footer`, tiny client islands for interactivity, disabling `next/link` prefetch in critical areas, and keeping the Shop page SSR-first.

Use the following flags in `apps/web/.env.local` for a quiet dev baseline:

```bash
NEXT_PUBLIC_DISABLE_TOASTER=true
NEXT_PUBLIC_DISABLE_CART_HYDRATOR=true
NEXT_PUBLIC_DISABLE_AFFILIATE_TRACKER=true
NEXT_PUBLIC_DISABLE_HEADER_INTERACTIONS=false
NEXT_PUBLIC_USE_UI_TEMPLATES=false
NEXT_PUBLIC_USE_UI_TEMPLATES_SHOP=false
```

Verify production is smooth (dev overhead doesn’t apply to prod):

```bash
pnpm --filter web build
pnpm --filter web start
```

See the full rationale and checklist in [Development Mode Limitations](./docs/dev-mode-limitations.md).

---

## Dev Modes: Full UI vs Safe Mode

Use safe mode to keep development responsive on large projects or slower hardware.

- `pnpm dev` (default)
  - No special env is set.
  - The homepage (`/`) redirects to `/shop` (full UI), which keeps navigation predictable.

- `pnpm dev:safe` (recommended for heavy dev sessions)
  - Sets `NEXT_PUBLIC_SAFE_HOME=true` via `cross-env`.
  - The homepage (`/`) renders a minimalist landing page defined in `apps/web/src/app/page.tsx`.
  - Navigate to `/shop` for the full storefront. This defers heavy client bundles while keeping the app usable.

To enable safe mode persistently, you can also add to `apps/web/.env.local`:

```bash
NEXT_PUBLIC_SAFE_HOME=true
```

For production, leave `NEXT_PUBLIC_SAFE_HOME` unset (or `false`). The homepage will redirect to `/shop`.

---

## Troubleshooting (Quick)

See `./docs/troubleshooting.md` for common issues, local cookie settings, and fixes.

---

## Deployment

See [Deployment](./docs/deployment.md).

---

## License

MIT — see `LICENSE`.

### Completed in this Phase

- Email verification flow:
  - Signup redirects to `"/auth/verify-email?email=<userEmail>"` for clearer UX.
  - Verification links now callback to `"/auth/login?verified=1&email=<userEmail>"` to prefill email and show a success message.
- Login flow:
  - After sign-in, session cache is invalidated and refetched so the header immediately shows the user avatar.
  - Role-based redirect: users go to `"/dashboard/admin"` if they have the `admin` role, otherwise `"/dashboard/user"`.
- Magic link flow:
  - `"/auth/magic-link"` sends links with callback to `"/dashboard/user"`.
- Resend verification email:
  - Server action reads the session on the server, and uses the same login callback with `verified=1`.
- Breadcrumb/route cleanup:
  - Fixed stale `"/dashboard"` links; all dashboard breadcrumbs now point to valid paths under `"/dashboard/user"`.
- Session hook:
  - `useSession()` now refetches on mount/focus/reconnect and respects `NEXT_PUBLIC_FRONTEND_ONLY` strictly (`"true"` only).

- Server-side dashboard access:
  - Fixed `getServerSession()` to call `GET /api/auth/get-session` (was `/api/auth/session`).
  - Dashboard layout guards now admit authenticated users immediately after email or social login.

### Authentication & Verification Flow

- Signup → Verify Email page (`/auth/verify-email`)
  - Prefills the email field from `?email=`.
  - Resend uses callback to `/auth/login?verified=1&email=<email>`.
- Verify link → Login
  - Landing on `/auth/login?verified=1&email=<email>` pre-fills the email and shows a toast.
- Login → Dashboard
  - On success, invalidate and refetch session, then redirect by role to `/dashboard/admin` or `/dashboard/user`.
- Header session state
  - Header (`modules/shared/components/header.tsx`) consumes `useSession()` and switches between Login/Register buttons and the user avatar menu.

### Dev environment & Auth smoke test

See [Troubleshooting](./docs/troubleshooting.md) (cookies/local HTTPS) and [Testing](./docs/testing.md) (quick auth test).

### Component Status Overrides (Aug 24, 2025)

- Account / Auth
  - login-form — Completed (Better Auth email/password; role-based redirect; session refresh)
  - signup-form — Completed (redirects to verify-email with prefilled email)
  - magic-link page — Completed (callback to `/dashboard/user`)
  - reset-password-form — Baseline (UI planned; server actions to wire)
  - forgot-password-form — Baseline (UI planned; server actions to wire)
  - two-factor-form — Baseline (plugin present; UI/flows to wire)

## v1.0 M0–M4 Summary

- [x] __M0: Data ready__
  - Products/categories schemas, migrations, and seeds applied; `/api/v1/products` returns real data; shop pages render seeds.
  - DTO→UI mapping verified in product/category pages; basic indexes added.
- [ ] __M1: Categories + Featured__ (in progress)
  - DONE: `categories` schema + endpoints; ProductFilters wired to API; `[slug]/page.tsx` and `categories/page.tsx` now API-backed with TanStack Query.
  - TODO: Expose featured endpoint and wire homepage/sections; finalize featured listings UX.
- __M2: Dashboard CRUD__
  - Admin CRUD for Products, Categories, Ads, Affiliates using Zod forms + TanStack Table.
  - Accept: Create/Edit/Delete persists; lists update via TanStack Query; admin-gated.
- __M3: Email Campaigns__
  - Campaigns CRUD + dev “send” + preview via `@repo/mail`.
  - Accept: Create and send a campaign in dev (SMTP/preview).
- __M4: Hardening__
  - Rate limit public endpoints; security headers; logging; minimal integration tests.
  - Accept: Tests pass; headers present; limits active.

## Monorepo Structure

See [Architecture](./docs/architecture.md) for the full monorepo layout and API conventions.

### Frontend Modules & UI Architecture

See [Frontend Architecture](./docs/frontend-architecture.md) for the modules tree, import rules, path aliases, composition safeguards, and maintenance scripts.

## Project Status

- Active (as of Sep 2, 2025)

## Frontend Components Inventory

See [Components Inventory](./docs/components.md).

## Getting Started

See [Getting Started](./docs/getting-started.md).

## Deployment

See `./docs/deployment.md`.

---

## Additional notes

- Backend consolidation, API hosting approach, and migration history: see [Architecture](./docs/architecture.md).
- Database setup and migration scripts: see [Getting Started](./docs/getting-started.md).
- Dashboard and UI overhaul highlights: see [Release Notes](./docs/release-notes.md).
- Digital products & mixed checkout behavior: see [Release Notes](./docs/release-notes.md).
- API usage patterns and typed client examples: see [Architecture](./docs/architecture.md) and [Testing](./docs/testing.md).

## Digital Products & Mixed Checkout

See [Release Notes](./docs/release-notes.md) for behavior, UX, and current scope.
- Badges and type filters: see [Components Inventory](./docs/components.md).
- Local test steps: see [Testing](./docs/testing.md).

## Environment & Configuration

- Each app has its own `.env`. See `config/env.example` and copy relevant values to `apps/web/.env`.
- We use `@t3-oss/env-nextjs` with `zod` schemas to validate required environment variables.
- Ensure cookie settings for cross-domain/subdomain are configured in Better Auth when deploying (e.g., `SameSite=None`, `Secure=true`, optional `partitioned: true`).
 - See `ENV_SETUP.md` for the full list of environment variables, including payments (e.g., `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`), emails (Resend/SMTP), Redis for rate limiting, and admin access (`ADMIN_EMAILS`).

## Development

See [Getting Started](./docs/getting-started.md).

## Testing Digital Checkout Locally

See [Testing](./docs/testing.md).

## Products API Integration

See [Architecture](./docs/architecture.md) (API conventions & clients) and [Testing](./docs/testing.md) (query examples).

## Troubleshooting

See [Troubleshooting](./docs/troubleshooting.md).

