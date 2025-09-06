# Environment Setup

Create `apps/web/.env.local` with the following keys:

```
# Database
DATABASE_URL=

# Better Auth
BETTER_AUTH_SECRET=
ENABLE_CROSS_SITE_COOKIES=true
ENABLE_CROSS_SUBDOMAIN_COOKIES=false

# OAuth providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

# CORS
WEB_ORIGIN=http://localhost:3000
```

Notes:
- Set `WEB_ORIGIN` to the exact origin of the Next.js app.
- Use a strong `BETTER_AUTH_SECRET` (run `npx @better-auth/cli@latest secret`).
- For local cross-site testing, keep `ENABLE_CROSS_SITE_COOKIES=true`.

## API, Payments, and Emails

Add these server-side variables to `apps/web/.env.local` as well (Next.js will load them for the co-located API in `packages/api/`). Do not prefix with `NEXT_PUBLIC_` unless the variable must be exposed to the browser.

```
# Admin access (comma-separated emails)
ADMIN_EMAILS=

# Orders, tax, and shipping defaults
AFFILIATE_COMMISSION_PCT=10
TAX_RATE=0.08
FREE_SHIPPING_THRESHOLD=50
FLAT_SHIPPING_FEE=9.99

# Emails (Resend)
RESEND_API_KEY=
EMAIL_FROM=

# SMTP (use for local testing with MailHog)
# Set MAIL_PROVIDER=SMTP to route emails through SMTP instead of Resend
MAIL_PROVIDER=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=

# API/global rate limiting (server)
API_RATE_LIMIT_MAX=120
API_RATE_LIMIT_WINDOW_MS=60000

# Contact form rate limiting (server)
CONTACT_RATE_LIMIT_MAX=5
CONTACT_RATE_LIMIT_WINDOW_MS=60000

# Stripe (server and client)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# PayPal
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MODE=sandbox # or live
PAYPAL_WEBHOOK_ID=
```

## Rate Limiting (Redis via Upstash)

To enable distributed rate limiting in production, set the following. When unset, the API falls back to an in-memory limiter suitable for local development only.

```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Behavior:
- When Redis is configured, the API enforces a sliding window limit using Upstash.
- Health endpoints reflect readiness: `GET /api/readyz` reports `dbOk` and `redisOk`. Metrics are available at `GET /api/metrics`.

## Admin Access

Admins are allowlisted via `ADMIN_EMAILS`. Ensure your test/admin account email is included to access the admin dashboard and admin-only API endpoints.

## Production Notes

- Keep server-only secrets (Stripe, PayPal, Resend) out of client exposure. Only use `NEXT_PUBLIC_` for keys intended for the browser (e.g., Stripe publishable key).
- `WEB_ORIGIN` must point to your deployed Next.js origin (e.g., `https://shop.example.com`).
- For stricter safety, enforce presence of prod-critical keys in production (tracked in TODO Phase 5).
