# Release Notes

## v1.0.0 (Draft)
- Auth/session flows complete (email verification, redirects, header session refresh)
- Catalog browse (categories/products) wired to API with loading/error states
- PDP + Wishlist toggle stable (PLP/PDP), E2E passing
- Checkout → Order (dummy payment) and order success page
- User dashboard: minimal Orders history
- Contact form: backend (validation, email, rate limiting, DB) + E2E

### Known Limitations
- No real payments; Stripe/etc. deferred post‑1.0
- SEO and deep-linked filters/sorts deferred
- Advanced observability and distributed rate limiting deferred
- Admin marketing/affiliate/email features deferred
