# Release Notes

## v1.1.0 (2025-09-10)
- Auth/session flows complete (email verification, redirects, header session refresh)
- Catalog browse (categories/products) wired to API with loading/error states
- PDP + Wishlist toggle stable (PLP/PDP), E2E passing
- Checkout → Order (Stripe/PayPal supported) and order success page
- Payments: Stripe and PayPal integrations with idempotent webhooks; shared clients/hooks in `@repo/payments`
- Split payments endpoints under `apps/web/src/app/api/v1/payments/**` for smaller server bundles
- User dashboard: minimal Orders history
- Contact form: backend (validation, email, rate limiting, DB) + E2E

### Known Limitations
- SEO and deep-linked filters/sorts deferred
- Advanced observability and distributed rate limiting deferred
- Admin marketing/affiliate/email features deferred
