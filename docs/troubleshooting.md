# Troubleshooting

## Quick
- Auth/session not updating after login?
  - Ensure `NEXT_PUBLIC_FRONTEND_ONLY=false`
  - Session refetch is enabled on focus/reconnect via TanStack Query defaults
- API 404/Invalid redirect?
  - Verify handlers exist under `apps/web/src/app/api/*`
  - Better Auth is mounted at `/api/auth/[...all]`
  - Use relative `redirectTo` paths in local/dev
- DB migrations failing?
  - Check `DATABASE_URL` in `apps/web/.env.local`
  - Run `pnpm db:generate` then `pnpm db:migrate`

## Dev-mode stalls/freezes
- See the full guide: `./dev-mode-limitations.md`.
- Quick flags for a quiet baseline (put in `apps/web/.env.local`):
  ```bash
  NEXT_PUBLIC_DISABLE_TOASTER=true
  NEXT_PUBLIC_DISABLE_CART_HYDRATOR=true
  NEXT_PUBLIC_DISABLE_AFFILIATE_TRACKER=true
  NEXT_PUBLIC_DISABLE_HEADER_INTERACTIONS=false
  NEXT_PUBLIC_USE_UI_TEMPLATES=false
  NEXT_PUBLIC_USE_UI_TEMPLATES_SHOP=false
  ```
- Verify production is smooth (dev-only overhead does not apply):
  ```bash
  pnpm --filter web build
  pnpm --filter web start
  ```

## Local Dev Environment (cookies)
- For HTTP `localhost`, ensure cookies are accepted by disabling cross-site cookie mode:
  - `ENABLE_CROSS_SITE_COOKIES=false`
  - `ENABLE_CROSS_SUBDOMAIN_COOKIES=false`
  - `NEXT_PUBLIC_FRONTEND_ONLY=false`
  - `BETTER_AUTH_SECRET=<long-random-secret>`
- If testing cross-site or multiple subdomains, run HTTPS locally and enable cross-site cookies.

## Additional Notes
- Loading & Error UX for TanStack Query pages:
  - Use `Skeleton` for placeholders and toast on error.
- MailHog won’t start or ports busy
  - Ports 1025 (SMTP) and 8025 (UI). Adjust envs/ports or stop conflicts.
- Next.js params warning
  - Ensure dynamic routes unwrap `params` using `React.use()` per v15 guidance.
- Duplicate React key warnings
  - Ensure mapped lists use stable, unique keys (e.g., product `id`).
