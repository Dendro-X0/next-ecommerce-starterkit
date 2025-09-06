# v1.0 Release Checklist

- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md`
- [ ] Ensure `ENV_SETUP.md` reflects required env vars
- [ ] Run local quality gates:
  - [ ] `pnpm lint`
  - [ ] `pnpm typecheck`
  - [ ] `pnpm build`
  - [ ] `pnpm -C packages/api test`
  - [ ] `pnpm -C apps/web test:e2e` (optional if configured)
- [ ] Verify docs (`README.md`, `docs/*`, `ROADMAP.md`) are accurate
- [ ] Create GitHub Release with tag `v1.0.0` and changelog notes
- [ ] Announce and collect feedback
