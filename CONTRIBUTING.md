# Contributing Guide

Thank you for your interest in contributing! This project is a Next.js + Hono monorepo powered by Turborepo and pnpm.

## Code of Conduct

By participating, you agree to abide by the standards of respectful, inclusive collaboration.

## Getting Started

- Clone the repository and install dependencies:
  - `pnpm install`
- Prepare environment variables:
  - Copy `ENV_SETUP.md` values into `apps/web/.env.local`
- Database:
  - `pnpm db:generate && pnpm db:migrate && pnpm db:seed`
- Run the app:
  - `pnpm dev`

## Project Structure

- `apps/web` — Next.js app (frontend + API Route Handlers)
- `packages/api` — Hono app (routes/middleware) mounted by web
- `packages/db` — Drizzle schema, migrations, seeds
- `packages/auth`, `packages/mail`, `packages/ui` — shared packages

## Development Conventions

- TypeScript strict mode; avoid `any`. One export per file.
- Keep functions short (<20 lines), single-purpose, documented.
- Use TanStack Query for all server interactions; optimistic updates + invalidations.
- Map DTOs at the client boundary; do not leak server DTOs into UI.
- Follow path aliases: `@/`, `@repo/*`.

## Branching & Commit Style

- Base branch: `main`
- Branch naming: `feat/<scope>`, `fix/<scope>`, `docs/<scope>`, `chore/<scope>`
- Conventional Commits recommended (e.g., `feat(cart): persist cart to server`)

## Linting, Typecheck, Tests

- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Build: `pnpm build`
- API unit/integration (Vitest): `pnpm -C packages/api test`
- E2E (Playwright): `pnpm -C apps/web test:e2e`

## Pull Request Checklist

- [ ] Lint and typecheck pass locally
- [ ] Unit/integration tests updated/added
- [ ] E2E updated when user flows change
- [ ] Docs updated (README, docs/*, or inline JSDoc)
- [ ] Accessibility and loading/error states covered

## Reporting Issues

- Use the issue template (bug/feature) with clear repro steps, logs, and environment info.

## Security

- Do not open public issues for vulnerabilities. See `SECURITY.md` for responsible disclosure.
