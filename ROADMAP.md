# Roadmap (Post‑v1)

The project is feature‑complete for v1.0. This document intentionally removes historical and completed plans to reduce noise and keep focus on what’s next.

Track active work in GitHub issues and milestones. This file is a high‑level guide only.

## Near‑Term

- Internationalization (i18n)
  - Next.js i18n routing (locale domains/paths), locale switcher UI, and locale negotiation.
  - Product/category translation fields; copywriting pipeline; currency formatting.
- Roles & Permissions (RBAC)
  - Roles: Admin, Manager, Support, Customer (extensible); route and action guards.
  - Policy checks in API handlers; audit logs for sensitive mutations.
- Payments
  - Payment extensions: Apple Pay / Google Pay (Stripe Payment Request).
  - Adyen; multi-currency and tax/VAT enhancements.
- Performance & Observability
  - CDN + cache headers, image optimization, query caching.
  - Structured logging (Pino), tracing/metrics (OTel), basic error triage dashboard.
- Accessibility & SEO
  - A11y pass on critical flows (navigation, forms, tables).
  - Structured data, sitemaps, robots, canonical URLs.

## Medium‑Term

- Notifications
  - Email (Resend/SMTP) templates + async delivery; in‑app toasts/inbox.
  - Rate limits and user preferences.
- Search & Filters
  - Faceted search; server‑side relevance tuning; index rebuild tasks.
- Content & CMS (Optional)
  - Light CMS for editorial pages (Sanity/Contentlayer) without coupling core commerce.
- Analytics & Attribution
  - Affiliate improvements, UTM attribution, campaign dashboards.
- Testing & CI
  - Playwright E2E on critical journeys; artifacts on failure; coverage gates.
- Security Hardening
  - Security headers, CSRF posture review, password/2FA policies, API rate limits.

## Longer‑Term

- Multi‑tenant support and organization/workspace model.
- Mobile app integration; token strategy and API surface hardening.
- Extensibility: plugin hooks for catalog, pricing, fulfillment.

---

For proposals and RFCs, open a GitHub issue using the “Feature Request” template. Attach design sketches, API proposals, and acceptance tests when possible.

 

---

## Notes on Deprecated Content

Historical plans that referenced a separate Medusa/Bun backend have been removed to avoid confusion. The project is committed to a consolidated architecture:

- Backend mounted inside Next.js via Route Handlers and Hono (`apps/web/src/app/api/*`).
- Database and migrations centralized in `@repo/db` (Drizzle + Postgres).
- Authentication via Better Auth under `/api/auth/[...all]`.

All future planning should build on this unified model. For legacy history, refer to repository history (git).
