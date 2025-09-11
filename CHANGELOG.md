# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2025-09-10
### Added
- Introduced `@repo/payments` package consolidating typed Stripe/PayPal clients for reuse across apps.
- New payments-oriented hooks in `@repo/payments`:
  - `use-stripe-config`, `use-paypal-config`, `use-stripe-intent`, `use-stripe-refund`, `use-paypal-order`.
- Payments setup guide at `docs/payments.md`, linked from `README.md`.

### Changed
- Migrated web app imports to use `@repo/payments` while keeping back-compat re-exports in `apps/web/src/lib/data/payments/*`.
- `PaymentForm` now reflects provider availability based on server configuration endpoints instead of public env vars.
- Split the catch‑all API by adding focused route handlers under `apps/web/src/app/api/v1/payments/...` for Stripe and PayPal. Specific routes take precedence over the catch‑all to reduce serverless bundle size.

## [1.0.0] - 2025-09-04
### Added
- Initial public release of the Next.js E‑Commerce Starter Kit (monorepo).
- Consolidated API via Next.js Route Handlers using Hono.
- Typed API clients with TanStack Query and DTO→UI mapping.
- Payments: Stripe and PayPal integrations with idempotent webhooks.
- Emails via `@repo/mail` with resilient template rendering and retries.
- Admin dashboard CRUD for products and categories with RBAC.
- Wishlist, reviews scaffolding, and affiliate plan documented.
- Testing docs and CI workflow (lint, typecheck, unit/integration/E2E).

### Changed
- Dashboard UX and session handling improvements.

### Known Issues
- Image uploads: local uploads work; further hardening and CDN integration planned post‑1.0.
