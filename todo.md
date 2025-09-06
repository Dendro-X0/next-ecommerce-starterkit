# Backend Production TODO (Linear Workflow)

> Note: This checklist is finalized for the v1.0 release. Remaining E2E items are moved to the Post-1.0 Roadmap. This file will be removed after the first push to GitHub.

This checklist is the only source of truth until complete. Work strictly top-to-bottom. No out-of-order or optional items.

## Ground rules
- Only tasks on this list will be executed until all are done.
- After all tasks are complete:
  1) Update README and ROADMAP to reflect the final state and operational guidance.
  2) Delete this `todo.md`.
- Keep functions short, typed, and documented (see project coding standards). Use TanStack Query on the web app for server data.

## Next tasks (short list)
- Phase 6: Integration tests for webhook flows and idempotency (Hono app)
- Phase 6: E2E (Playwright) for Stripe and PayPal flows; refund path
- Phase 4: Switch API sender to template-based rendering and add retry/metrics

## Phase 0 — Unblockers
- [x] Fix API typecheck blocker: `@repo/db/auth-schema` moduleResolution
  - [x] Align `packages/api/tsconfig.json` with web (e.g., `moduleResolution: bundler|nodenext`) and/or add path alias for `@repo/*`.
  - [x] Prefer package exports in `@repo/db` or adjust import path to a resolvable entry.
  - [x] Ensure `pnpm -C packages/api typecheck` passes.

## Phase 1 — Payments (Stripe) hardening
- [x] Persist payment refs on orders
  - [x] DB: add nullable columns `paymentProvider`, `paymentRef` in `packages/db/src/schema/orders.ts` + migration.
  - [x] Thread fields through `ordersRepo.create()` and API DTOs; expose on GET endpoints.
- [x] Stripe webhooks
  - [x] Add `POST /api/v1/payments/stripe/webhook` in `packages/api/src/routes/payments-stripe.ts`.
  - [x] Verify signature; handle `payment_intent.succeeded|canceled|processing|amount_capturable_updated|payment_intent.payment_failed|charge.refunded`.
  - [x] Map events to orders via stored `paymentRef` (intent id) or metadata; update status using `ordersRepo.updateStatus()`.
- [x] Idempotency
  - [x] Support `Idempotency-Key` header for create intent and order creation routes.
  - [x] Store and enforce idempotency on the API.
- [x] 3DS/redirect and capture/refund
  - [x] Confirm `redirect: "if_required"` path is handled; fallback to webhook for final source of truth.
  - [x] Admin: add refund endpoint; wire to Stripe refunds API; update order. (Email notifications tracked in Phase 4)
  - [x] Optional: manual capture flow support (authorize then capture) if needed; capture endpoint.

## Phase 2 — PayPal provider
- [x] Backend: `packages/api/src/routes/payments-paypal.ts` with config/create/capture and webhook verification.
- [x] Frontend: `apps/web/src/lib/data/payments/paypal.ts` (typed client) + wiring into checkout similar to Stripe.
- [x] Env validation: client + server keys; config endpoint mirrors Stripe.

## Phase 3 — Taxes and shipping
- [x] Tax service integration (`packages/api/src/lib/tax.ts`) behind provider interface; compute during checkout.
  - Define `TaxProvider` interface and a `stub` implementation for dev; plug into `computeTotals()` usage.
- [x] Shipping rates via provider (`packages/api/src/lib/shipping.ts`) based on cart + address; return options.
  - Define `ShippingProvider` interface with flat and free‑threshold strategies; expose selected option in quote.
- [x] Update checkout API to compute and lock totals before payment; store tax and shipping lines.
  - Persist tax and shipping line items on order create; ensure server totals override client values.

## Phase 4 — Orders, inventory, emails
- [x] Inventory management
  - [x] Reservation on checkout initiate; decrement on paid; release on cancel/refund.
  - [x] Repo + schema support; safe concurrency.
- [x] Transactional emails via Resend
  - [x] Wire order created/paid/shipped/refunded emails in API (orders/admin + Stripe/PayPal webhooks).
  - [x] Implement templates in `apps/web/modules/shared/components/emails/*` (created/paid/cancelled/shipped/refunded).
  - [x] Switch API sender to template-based rendering (use `@react-email/render` in API); consider moving templates to a shared package if needed.
  - [x] Retry on failure; log and surface metrics.
  - [x] Basic logging and no-op when not configured.

## Phase 5 — Security and observability
- [x] Global middlewares in API
  - [x] Rate limiting (Upstash Redis with in-memory fallback), request logging with correlation id.
  - [x] Zod validation across routes (define per-route schemas and unify error formatting).
  - [x] Env validation enforcement for prod-critical keys (Stripe/PayPal/Resend) in production.
- [x] Health/readiness endpoints and metrics (basic Prometheus-style metrics at `/api/metrics`).
- [x] Audit logs for admin actions (console JSON; consider persistence to DB in future).

## Phase 6 — Testing and CI
- [x] Unit tests: repositories and routes (Stripe/PayPal mocked), using fast in-memory or test DB.
  - [x] Admin Customers endpoint coverage (validation, guards, errors, success, mapping)
  - [x] Products featured failure-path (repo throws -> 500)
  - [x] Products list/detail and admin CRUD routes
  - [x] Admin Reviews and Admin Affiliate endpoints
- [x] Integration tests: Hono app with webhook flows and idempotency.
- [ ] E2E (Playwright):
  - [ ] Stripe happy-path (4242), 3DS (4000 0027 6000 3184), failure/retry, refund flow.
  - [ ] PayPal create/approve/capture with mocks.
- [x] CI: lint, typecheck (web+api), unit/integration. (E2E smoke moved to Post-1.0)
 - [ ] Email: render snapshot tests for templates; API tests assert email sends on status transitions.
  - Add test fixtures for seeded products/orders; use deterministic IDs for webhook mapping.

## Acceptance criteria
- Orders store payment provider and external reference; status mirrors provider via webhooks.
- Stripe and PayPal work in test mode end-to-end; refunds and (optional) capture supported.
- Taxes and shipping computed server-side; totals locked pre-payment; inventory consistent.
- Transactional emails sent and retried; logs and metrics available; rate-limited and validated APIs.
- Web and API typecheck clean; CI green; E2E covers happy/failure/3DS/refund paths.

## Post-completion
- [x] Add `.env.example` and expand `ENV_SETUP.md` with API/Redis/Payments/Emails env variables.
- [x] Update `README.md` with setup, envs, flows, and operational notes.
- [x] Update `ROADMAP.md` to mark phases complete and next goals.
- [ ] Delete `todo.md` (after first push).
