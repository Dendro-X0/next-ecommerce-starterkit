# E-Commerce Starter Kit: Backend Development Roadmap

This document outlines the strategic plan for developing the backend of the ModularShop e-commerce starter kit. The architecture is designed to be modular, scalable, and developer-friendly, using a modern TypeScript-based stack.

## Core Philosophy

- **Modular Architecture**: A decoupled frontend and backend to ensure separation of concerns and independent scalability.
- **Build Core In‑House**: Own core commerce logic (auth, catalog, admin CRUD). Evaluate a CMS only for editorial content post‑1.0 (e.g., Sanity/Directus) if needed.
- **Modern Stack**: Node.js + Next.js 15 (App Router) with Hono for API routing in Route Handlers, Drizzle ORM, Better Auth, and Turborepo.

---

## V1.0 Remaining Checklist (Short)

- [ ] Reviews: Admin moderation UI page and PDP integration (list + submit)
- [ ] Affiliate (U6): tests only — unit (repo), integration (routes), E2E (?ref → cookie → order → conversion)
- [ ] Wishlist: E2E stabilization per `UNRESOLVED_ISSUES.md` (PDP/PLP toggles, badge)
- [ ] CI hardening: Turbo cache, test artifacts (screenshots/HTML)
- [ ] Deployment docs: Vercel env matrix, DB migration/runbook

---

## Post-1.0 Roadmap (Active)

The detailed sections below are historical. For the current plan post-1.0, track work via GitHub issues and milestones in the repository.

- E2E coverage (Playwright): happy path, 3DS/failure/retry/refund; stabilize selectors and test data.
- CI hardening: baseline CI added; next up is cache tuning and artifacts (screenshots/HTML on failures), optional E2E job.
- Image uploads: implemented streaming uploads and admin UI; hardening next (file-type inference, size limits, CDN-backed storage option, admin UX polish).
- Reviews (U5): backend and user dashboard completed; remaining work: admin moderation UI and PDP integration.
- Affiliate (U6): referral capture middleware, clicks, conversions, admin status flows.
- Cart persistence: server-backed cart + client sync; optimistic reconcile on login.
- SEO & filters: deep-linked filters, structured data, sitemaps.

---

## Status Update (August 2025)

Recent progress has focused on stabilizing the Next.js web app and aligning it with Next.js 15 and React 19 best practices:

- Centralized authentication via Better Auth in `@repo/auth`; web app re-exports the shared instance via `apps/web/src/lib/auth.ts`.
- Fixed unresolved imports and created local data modules for dashboards (`@/lib/admin-data`, `@/lib/user-data`).
- Installed `@t3-oss/env-nextjs` and validated envs with `zod`.
- Updated dynamic route pages to the Next.js 15 Promise-based `params`/`searchParams` signatures.
- Added `apps/web/src/lib/user.ts` with `UserProfile` and `UserSettings` types to fix action imports.
- Build is green for `apps/web` (`pnpm --filter web run build`).
- Note: Dashboard charts were placeholders and have visual issues; a full overhaul and data visualization integration is planned next.

Catalog and categories progress:

- Products and categories backend implemented in `@repo/db` + Hono routes; both support filtering and a `featured` flag.
- Drizzle migrations applied and seed script updated to always insert categories; seeded 8+ categories and featured products.
- `ProductFilters` now fetches categories from `/api/v1/categories` with loading/error states and strict typing.
- Category product page `apps/web/src/app/(shop)/categories/[slug]/page.tsx` uses TanStack Query to fetch from backend with proper DTO mapping, loading and error states.
- Categories index page `apps/web/src/app/(shop)/categories/page.tsx` refactored to TanStack Query + new typed client `@/lib/data/categories` to render a responsive card grid.
- Naming standardized to TanStack Query across docs and code.
- Contact API implemented: validated payloads (Zod), email delivery via Resend (if configured), IP rate limiting, DB persistence, and unit tests; migration pushed.

### Contact — Backend Complete

- Backend is finished and mounted at `/api/v1/contact` with validation, email delivery (Resend), in-memory IP rate limiting, and DB persistence via `contacts` table.
- Typed client `apps/web/src/lib/data/contact.ts` and UI form are wired; manual/HTTP tests return 400 for invalid and 202 for accepted.

Next steps:

- Distributed rate limiting: replace in-memory bucket with Redis or Upstash (per-IP window + burst) to support multi-instance deployments.
- Email delivery hardening: route through `@repo/mail` to enable SMTP fallback and centralized templates/provider switch.

---

## Status Update (September 2025)

Recent changes focused on release readiness, CI, and monorepo build stability:

- CI added: `.github/workflows/ci.yml` runs pnpm workspace install, lint, typecheck, builds `@repo/emails`, then builds `apps/web`.
- Monorepo build fixes: Next transpiles `@repo/emails`; web depends on `@repo/api`; Turbo `typecheck` depends on upstream builds; lockfile updated.
- Env guards: API env now warns (instead of throwing) when email/payments are not configured; `WEB_ORIGIN` defaults to `http://localhost:3000`.
- DB runtime init: `@repo/db` lazily reads `DATABASE_URL` at runtime to avoid build-time failures on hosting providers.
- Result: Local and CI builds are green. Production deploy still requires proper environment configuration and remote DB schema; considered out-of-scope for the v1.0 code handoff.
- E2E UI tests (Playwright): happy path submit, invalid payload, and rate-limit flows with assertions on toasts and HTTP status.
- Observability/security: structured logs for contact submissions, basic honeypot/Turnstile option, and alerting on spikes.

## Status Update (September 2025)

Payments idempotency and webhook reliability are implemented and covered by passing integration tests. Docs and environment setup have been clarified.

- Stripe: test‑mode integration with idempotent PaymentIntent creation and webhook processing for order status changes.
  - Routes: `packages/api/src/routes/payments-stripe.ts` (`POST /intent`, `POST /webhook`).
  - Side effects: inventory commit/restock and transactional emails on `paid`/`cancelled` transitions.
- PayPal: capture+webhook flows implemented with duplicate‑delivery idempotency.
  - Routes: `packages/api/src/routes/payments-paypal.ts` (`POST /webhook`).
- Integration tests (passing):
  - Stripe and PayPal webhook edge cases + duplicate delivery idempotency under `packages/api/test/integration/*`.
- Environment and docs:
  - `ENV_SETUP.md` expanded with payments, email, Redis, and admin env vars.
  - `README.md` updated (status, operational notes, env reference).

Next goals (Q4 hardening):

- Playwright E2E flows: Stripe happy‑path (4242), 3DS, failure/retry, refund; PayPal create/approve/capture.
- CI pipeline: lint, typecheck (web+api), unit/integration, E2E smoke with artifacts.

---
 
## Phase 1: Foundational Setup

**Goal**: Establish the core backend project, database, and ORM.

- **[X] Task 1.1: Initialize Node.js/Next.js + Hono API**
  - Use Next.js Route Handlers and mount the Hono app inside `apps/web`.
  - Expose a catch‑all at `/api/[[...rest]]/route.ts` with `handle(app)`.
  - Keep TypeScript/ESLint/Prettier consistent across monorepo via shared configs.

- **[X] Task 1.2: Set Up Neon Database**
  - Create a new project on Neon.tech.
  - Obtain the database connection string and store it securely in environment variables (`.env`).

- **[X] Task 1.3: Integrate Drizzle ORM**
  - Install and configure Drizzle ORM in the Hono project.
  - Connect Drizzle to the Neon database.

- **[X] Task 1.4: Define Initial Database Schema**
  - Using Drizzle, define the initial schema for `users`.
  - Other schemas (products, orders) will be managed by the in-house solution.
  - Create initial migration files.

---
 
## Phase 3: Dashboard Refactor & UI Overhaul
 
**Goal**: Elevate the dashboard UX, fix styling/layout issues, and establish a robust, modular UI foundation before CMS integration.
 
### Progress (P0 - August 2025)
 
- Created shared `DashboardShell` at `apps/web/src/app/dashboard/_components/shell.tsx` and integrated it in both `admin` and `user` layouts.
 
---
 
## Backend Architecture Overview (Approved)
 
### Stack & Structure
 
- API: Hono mounted via Next.js Route Handlers under `apps/web/src/app/api/*` using `handle(app)`.
- ORM/DB: Drizzle ORM + Postgres in `@repo/db` with centralized migrations and seeds.
- Auth: Better Auth in `@repo/auth`; mounted at `/api/auth/[...all]` via `toNextJsHandler`.
- Packages: `@repo/api` (routes/middleware), `@repo/db`, `@repo/auth`, `@repo/mail`, `@repo/ui`.
- FE Data: TanStack Query; typed API clients in `apps/web/src/lib/data/*` (one export per file).
 
### Data Model (Drizzle tables)
 
- profiles, addresses, preferences
- categories, products (with `categorySlug`, `featured`, media JSONB)
- carts, cart_items
- orders, order_items
- reviews (with moderation status)
- wishlists, wishlist_items
- affiliate_profiles, affiliate_clicks, affiliate_conversions
 
### API Conventions
 
- Base `/api/v1/*`, Zod-validated DTOs, structured `{ error, code }` responses.
- Pagination: `page`, `pageSize`, total; Sorting: `newest`, `price_asc`, `price_desc`, `rating`, `popularity`.
- Auth middleware for user, `ensureAdmin` guard for admin routes.
 
---
 
## Phased Delivery Plan (U1–U6, A, H)
 
Each phase lists scope and acceptance criteria to minimize ambiguity.
 
### U1: Addresses & Preferences (User Dashboard foundations)
 
- DB: `addresses`, `preferences`.
- API: `/account/addresses` (CRUD, set default), `/account/preferences` (get/patch).
- FE: Wire user settings pages; add `addresses.ts` and `preferences.ts` clients.
- Accept: CRUD/default works; preferences persist and reflect in UI.
 
### U2: Cart Persistence

- DB: `carts`, `cart_items`.
- API: GET/POST/PATCH/DELETE `/cart` and `/cart/items`.
- FE: Add `cart.ts` client; hydrate and sync `useCartStore` with server.
- Accept: Cart survives refresh/login; optimistic UI reconciles correctly.

### U3: Orders (Checkout → Order Success → Dashboard)

- DB: `orders`, `order_items`.
- API: `POST /orders`, `GET /orders`, `GET /orders/:id`.
- FE: Replace checkout simulate with real order; fetch `order-success/[orderId]`; wire dashboard orders.
- Accept: Orders created with accurate totals; retrievable by id/list.

### U4: Wishlist

- DB: `wishlists`, `wishlist_items`.
- API: `/wishlist`, `/wishlist/items` (add/remove).
- FE: `wishlist.ts`; PDP heart toggle; dashboard wishlist.
- Accept: Add/remove works; dashboard reflects live data.
 
Status: Completed (core flows implemented). Remaining work tracked under "U4: Wishlist — Completion & Hardening" and E2E stabilization tasks.

### U5: Reviews

- DB: `reviews` with moderation.
- API: list approved by product; create/edit/delete; admin moderation.
- FE: `reviews.ts`; PDP list/submit; dashboard manage own reviews.
- Accept: Users manage reviews; PDP shows approved reviews.

### U6: Affiliate

- DB: `affiliate_*` tables.
- API: profile/regenerate, stats, clicks, conversions.
- FE: `affiliate.ts`; wire dashboard affiliate page.
- Accept: Code generation works; stats render with seed/demo data.

### A: Admin CRUD (Products/Categories)

- API: Admin create/update/delete with Zod validation and RBAC.
- FE: Finalize admin `product-form` and tables with TanStack Query invalidation.
- Accept: Full CRUD functional and gated.

### H: Hardening

- Security headers, rate limits on public endpoints, Pino logs, error envelopes.
- Minimal integration tests across domains.
- Accept: Tests pass; limits/headers verified.

## Testing & Deployment

- E2E: Playwright flows for auth, browse, cart, checkout (order creation).
- CI: GitHub Actions for typecheck, lint, unit/integration/E2E; preview deploys.
- Deploy: Next.js app (including Route Handlers) on Vercel; Postgres (Neon/Supabase). No separate Medusa service.

---

## Dashboard Implementation Plan (Detailed)

This section details a step-by-step implementation plan focusing on the dashboards first (user/admin), followed by store-facing integrations. Follow conventions already used in the codebase: Hono routes under `@repo/api`, Drizzle repositories in `@repo/db`, Better Auth context on `c.get("user")`, Zod validation, and TanStack Query clients under `apps/web/src/lib/data/*` (one export per file).

### Principles

- Use TanStack Query for all data fetching/mutations in the Next.js app; prefer optimistic updates + invalidateQueries on success.
- One export per file; avoid `any`; keep DTOs explicit and documented.
- RBAC: reuse `ensureAdmin()` in `packages/api/src/routes/admin.ts` and admin layout guards in `apps/web/src/app/dashboard/admin/layout.tsx`.
- Error envelopes `{ error }`, Zod validation, rate limits for public endpoints.

### Overall Sequence

1) Implement Affiliate (U6) backend and wire user/admin dashboards.
2) Implement Reviews (U5) backend and wire user/admin dashboards + PDP.
3) Finish Admin Customers and Categories gaps (CRUD/data wiring).
4) Dashboard polish: loading/error/empty states, pagination, and DX.
5) Store-area follow-ups: PDP reviews, referral capture, payments prep.

---

### U4: Wishlist — Completion & Hardening

1. API Route Typing Fixes (`packages/api/src/routes/wishlist.ts`)
   - [x] Parse JSON body safely and validate with Zod (e.g., `{ productId: string }`).
   - [x] Remove TS2339 by narrowing `body` before access; return `{ error }` envelopes with appropriate status codes.
   - [x] Ensure add/remove are idempotent and consistently typed.

2. Repository & Schema Review
   - [x] Verify `packages/db/src/repositories/wishlists-repo.ts` add/remove semantics and return shapes.
   - [x] Confirm `packages/db/src/schema/wishlists.ts` indexes support common queries.

3. Frontend Client & Query Keys
   - [x] Ensure `apps/web/src/lib/data/wishlist.ts` methods have strict types and map to API responses.
   - [x] Use TanStack Query for all mutations; invalidate wishlist query keys in `apps/web/src/lib/wishlist/query-keys.ts` after success.

4. UI Wiring
   - [x] PLP toggle: `modules/shop/components/product/product-card.tsx` uses mutation with loading/disabled states; `data-testid="plp-wishlist-toggle(-button)"` intact.
   - [x] PDP toggle: ensure `pdp-wishlist-toggle` renders post-hydration and after product fetch; handle optimistic state.
   - [x] Header badge: `modules/shared/components/header.tsx` hides when count is 0; updates after mutations.

5. Seeds
   - [x] Ensure dev seeds include a known product slug and a category used in tests to make PLP/PDP deterministic.

6. E2E Stabilization (see `UNRESOLVED_ISSUES.md`)
   - [ ] PDP spec: navigate to seeded slug; on failure, capture console, URL, and partial HTML.
   - [ ] PLP spec: navigate to `/categories` or seeded category; wait for a stable heading; capture diagnostics on failure.
   - [ ] Add waits for visible/enabled states on toggles and assert header badge changes.

7. Acceptance Criteria
   - [ ] TS builds clean (no TS2339 in wishlist route).
   - [ ] PLP/PDP toggles render and operate reliably; header badge reflects count.
   - [ ] E2E specs for wishlist pass locally and in CI.

---

### U6: Affiliate — Dashboard-first Delivery

1. DB Schema (`packages/db/src/schema/affiliate.ts`)
   - [x] `affiliate_profiles` (id, userId unique, code unique, createdAt, updatedAt)
   - [x] `affiliate_clicks` (id, code, userId?, ipHash, userAgentHash, source?, createdAt, convertedAt?)
   - [x] `affiliate_conversions` (id, clickId, orderId unique, userId?, code, commissionCents, status: pending|approved|paid, createdAt, paidAt?)
   - [x] Indexes by `code`, `status`, `createdAt`.

2. Repositories (`packages/db/src/repositories/affiliate-repo.ts`)
   - [x] Profiles: `getByUserId`, `getByCode`, `upsertForUser`, `regenerateCode`.
   - [x] Clicks: `createClick`, `listByCode(limit)`, `markConverted` with dedupe window.
   - [x] Conversions: `create`, `getByOrderId`, `listByCode({ status, limit })`, `updateStatus`.

3. API Routes (`packages/api/src/routes/affiliate.ts`)
   - [x] Public: `POST /api/v1/affiliate/track` (body: { code, source? }) → create click, set cookie `AFF_REF`.
   - [x] User: `GET /api/v1/affiliate/me` (profile + stats), `POST /api/v1/affiliate/me/code` (regenerate), `GET /api/v1/affiliate/me/clicks`, `GET /api/v1/affiliate/me/conversions`.
   - [x] Admin: `GET /api/v1/admin/affiliate/conversions?status&limit`, `PATCH /api/v1/admin/affiliate/conversions/:id`.

4. Route Mounting (`packages/api/src/app.ts`)
   - [x] `app.route("/api/v1/affiliate", affiliateRoute)`; re-use `ensureAdmin` for admin subpaths.

5. Order Attribution
   - [x] Extend `packages/db/src/schema/orders.ts` with: `affiliateCode`, `affiliateClickId`, `affiliateCommissionCents`, `affiliatePayoutStatus`.
   - [x] In `packages/api/src/routes/orders.ts` `.post("/")`: read `AFF_REF` cookie; resolve to profile/click; create `affiliate_conversions` for `orderId`; mark click converted; persist attribution fields on the order.

6. Referral Capture
   - [x] Add middleware `apps/web/src/middleware.ts` to capture `?ref=` and set `AFF_REF` cookie (`SameSite=Lax; Max-Age=30d`).
   - [x] Add client util `apps/web/src/lib/data/affiliate.ts` method `trackClick()` for non-middleware capture (e.g., from landing pages).

7. Frontend Client + Query Keys
   - [x] `apps/web/src/lib/data/affiliate.ts`: `getMe`, `regenerateCode`, `listClicks`, `listConversions`, `trackClick`.
   - [x] `apps/web/src/lib/affiliate/query-keys.ts`: `me`, `clicks`, `conversions`.

8. Wire User Dashboard
   - [x] Replace mocks in `apps/web/src/app/dashboard/user/affiliate/page.tsx` with TanStack Query.
   - [x] Optimistic update on code regeneration; invalidate `me`.

9. Admin Dashboard
   - [x] Implement `apps/web/src/app/dashboard/admin/marketing/affiliate/page.tsx` table for conversions with status filter + action (approve/paid).
   - [x] Extend `apps/web/src/lib/data/admin-api.ts` with `listAffiliateConversions`, `updateAffiliateConversionStatus`.

10. Seeds & Tests
   - [x] Dev seeds for profiles/clicks/conversions.
   - [ ] Unit tests: repositories; integration: route handlers; E2E: `?ref=` → cookie → order → conversion.

---

### U5: Reviews — Dashboard-first Delivery

1. DB Schema (`packages/db/src/schema/reviews.ts`)
   - [x] `reviews` (id, productId, userId, rating 1–5, title, body, status: pending|approved|rejected, createdAt, updatedAt)
   - [x] Indexes by `productId`, `userId`, `status`, `createdAt`.

2. Repository (`packages/db/src/repositories/reviews-repo.ts`)
   - [x] `create`, `listApprovedByProduct(productId, limit, offset)`, `listByUser(userId, limit, offset)`, `updateByUser`, `deleteByUser`.
   - [x] Admin: `listAll({ status, limit })`, `moderate(id, status)`.

3. API Routes (`packages/api/src/routes/reviews.ts` or split under products/account/admin)
   - [x] Public/Product: `GET /api/v1/products/:id/reviews` (approved only), `POST /api/v1/products/:id/reviews` (auth required).
   - [x] Account: `GET /api/v1/account/reviews`, `PATCH /api/v1/account/reviews/:id`, `DELETE /api/v1/account/reviews/:id`.
   - [x] Admin: `GET /api/v1/admin/reviews?status&limit`, `PATCH /api/v1/admin/reviews/:id/status`.

4. Route Mounting (`packages/api/src/app.ts`)
   - [x] `app.route("/api/v1/reviews", reviewsRoute)` and/or register product subroutes within `productsRoute`.

5. Frontend Client + Query Keys
   - [x] `apps/web/src/lib/data/reviews.ts`: `listByProduct`, `create`, `listMine`, `updateMine`, `deleteMine`.
   - [x] `apps/web/src/lib/reviews/query-keys.ts`: `product(id)`, `me`.

6. Wire User Dashboard
   - [x] Replace mocks in `apps/web/src/app/dashboard/user/reviews/page.tsx` with TanStack Query.
   - [x] Add edit/delete flows with optimistic updates + invalidations.

7. Admin Dashboard
   - [ ] Add `apps/web/src/app/dashboard/admin/customers/reviews/page.tsx` for moderation queue with approve/reject.
   - [ ] Extend `apps/web/src/lib/data/admin-api.ts` with `listReviews`, `moderateReview`.

8. PDP Integration (Store Area)
   - [ ] On product page, fetch approved reviews and render list; add submit form guarded by auth.

---

### Admin Customers & Categories — Completeness

- [ ] Implement customers list API under `packages/api/src/routes/admin.ts` or new route; wire `apps/web/src/app/dashboard/admin/customers/page.tsx` table to backend.
- [ ] Ensure categories CRUD parity (admin create/update/delete endpoints + forms), aligning with `@repo/db` and UI in `product-form.tsx`.

---

### Dashboard Polish & Hardening

- [ ] Add loading/error/empty states across admin/user pages; table pagination where necessary.
- [ ] Security hardening: headers, rate limits on public endpoints (`/affiliate/track`), Pino logs.
- [ ] Add Playwright E2E for dashboard flows (affiliate, reviews, orders, wishlist) and CI gates.

---

### Store Area Follow-ups (post-dashboard)

- [ ] PDP Reviews: list + submit wired to reviews API.
- [x] Referral capture on landing/PLP/PDP via middleware; add `trackClick()` fallback.
- [ ] Wishlist PDP/PLP heart: ensure toggle and cache invalidation are stable (address flakiness noted in `UNRESOLVED_ISSUES.md`).
- [ ] Checkout/payments prep: Stripe test mode integration path, order status updates, and admin status mutation audits.

---

---

## Notes on Deprecated Content

Historical plans that referenced a separate Medusa/Bun backend have been removed to avoid confusion. The project is committed to a consolidated architecture:

- Backend mounted inside Next.js via Route Handlers and Hono (`apps/web/src/app/api/*`).
- Database and migrations centralized in `@repo/db` (Drizzle + Postgres).
- Authentication via Better Auth under `/api/auth/[...all]`.

All future planning should build on this unified model. For legacy history, refer to repository history (git).
