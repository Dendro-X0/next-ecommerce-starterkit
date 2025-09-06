# Unresolved Issues Log

Last updated: 2025-08-28 21:55:53-12:00

## Wishlist E2E

- [PDP] tests/wishlist.spec.ts fails to locate `pdp-wishlist-toggle` after navigating to PDP.
  - Symptoms: `getByTestId('pdp-wishlist-toggle')` not found or button never becomes visible/enabled.
  - Suspicions: route/content mismatch; PDP renders without wishlist section; or client runtime error/hydration preventing toggle render.
  - Suggested next debug: capture page.console, page.url, and a body HTML snippet when container not found; navigate to a known seeded slug to remove homepage dependency.

- [PLP] tests/plp-wishlist.spec.ts fails to find `product-card` on homepage.
  - Symptoms: homepage did not render any `data-testid="product-card"` within 60s in CI run.
  - Suspicions: homepage grid not mounted in test, feature sections gate on data not available in test, or race with initial skeletons.
  - Suggested next debug: wait for a known section heading, or navigate to `/categories` or another PLP guaranteed to load; add diagnostics (console logs + HTML snippet) on failure.

### Resolution Plan (U4)

- See `ROADMAP.md` → "U4: Wishlist — Completion & Hardening" for full task list.
- Immediate actions:
  - Add diagnostics to both specs: capture console, URL, and partial HTML when target is missing.
  - Point PDP spec to a seeded product slug; point PLP spec to `/categories` or a seeded category grid.
  - Ensure PLP and PDP toggles use TanStack Query mutations with disabled/loading states; assert header badge updates.
  - Fix TS typing in `packages/api/src/routes/wishlist.ts` by safe JSON parse + Zod schema for `{ productId: string }`.

## TypeScript

- packages/api/src/routes/wishlist.ts: TS2339 for `body.productId` due to `json().catch(() => ({}))` typing as `Partial<...> | {}`.
  - Suggested fix: narrow type after parse (e.g., `const body = (await c.req.json().catch(() => null)) as { productId?: string } | null;`), or type predicate, or default to `{}` with explicit type.

## Misc Notes

- Header wishlist badge added in `modules/shared/components/header.tsx` using TanStack Query and `wishlistApi.getWishlist()`. Badge uses `data-testid="header-wishlist-badge"` and hides when count is 0.
- PLP wishlist toggle added in `modules/shop/components/product/product-card.tsx` with `data-testid="plp-wishlist-toggle(-button)"`, optimistic update, and proper typing.
- Wishlist client in `apps/web/src/lib/data/wishlist.ts` and query keys in `apps/web/src/lib/wishlist/query-keys.ts` are implemented.

## Suggested Next Steps (when resuming bug triage)

1. Add diagnostics to both E2E specs (console, URL, partial HTML dump on failure).
2. Temporarily navigate PDP spec to a known seeded slug to decouple from homepage.
3. For PLP, target a category PLP page known to load products, or ensure homepage featured grid resolves in tests.
4. Fix TS errors in wishlist route by narrowing `body` type before access.
