# Media Storage Integration (Plan)

This document outlines the plan to integrate persistent storage for product/category media.
The current admin uploader renders previews but persists placeholder URLs. We will add a
first‑class storage integration to enable reliable image/video uploads in production.

## Goals

- Reliable, fast, and secure uploads for images and videos.
- Direct‑to‑storage uploads from the browser using short‑lived signed URLs.
- Store media metadata in DB and associate with products/categories.
- Efficient delivery via CDN/Next Image with transformations when possible.
- Clear local dev story (no cloud dependency for iteration).

## User Stories

- As an admin, I can upload a product image or video and see it persist without placeholders.
- As an admin, I can set a primary image, remove gallery items, and re‑order media.
- As a customer, I always see real media for products and category tiles.

## Providers (to evaluate)

- S3 compatible (Amazon S3, Cloudflare R2, MinIO)
- Supabase Storage (Postgres‑backed with signed URLs; good DX)
- UploadThing (DX‑focused wrapper for Next; simple setup)

We will start with an S3‑compatible baseline for portability, and keep the API abstracted so
we can later swap providers (e.g., an adapter architecture in `@repo/storage`).

## Architecture

- Direct upload from the browser using signed PUT URLs or a multipart upload for large files.
- Next.js Route Handlers for signing and post‑processing hooks:
  - `POST /api/v1/storage/sign` — returns a signed URL and the canonical public URL.
  - `POST /api/v1/storage/complete` — optional post‑upload hook to verify and persist metadata.
- Media metadata table in DB (Drizzle, Postgres) e.g. `media`:
  - `id`, `kind` (image|video), `provider` (s3|r2|supabase|uploadthing), `bucket`, `key`, `url`,
    `bytes`, `width`, `height`, `contentType`, `checksum`, `createdAt`, `createdBy`.
- Relations:
  - `product_media` (productId, mediaId, position)
  - `category_media` (categoryId, mediaId, position)

## Security & Validation

- Role‑gated signing endpoints (admins only).
- Validate content type, extension, and size; optional lightweight antivirus hook.
- Limit gallery size and file count per request; enforce quotas.
- Generate unique object keys (`{env}/{yyyymm}/{uuid}.{ext}`) to avoid conflicts.

## Client Integration

- Update `apps/web/src/app/dashboard/admin/_components/media-uploader.tsx`:
  - On select, call `POST /api/v1/storage/sign` per file to obtain a signed URL.
  - Upload file directly to storage with `fetch`/`XHR` progress.
  - On success, call `/complete` to persist metadata and receive a stable public URL and `mediaId`.
  - Replace preview placeholders with the returned canonical public URL.
- Update product form to use `mediaId` references and set `imageUrl`/primary from selected media.

## Delivery & Optimization

- Prefer Next.js Image component with a loader backed by the CDN public URL.
- For providers that support on‑the‑fly transforms, leverage width/quality params.
- For video, store original and optional low‑bitrate preview; lazy‑load with `preload="metadata"`.

## Local Development

- Default to a local S3 emulator (e.g., MinIO or LocalStack) with `.env` overrides.
- Provide a `DEV_STORAGE=memory` mode that writes to `apps/web/.uploads/**` for zero‑setup.

## Environment Variables (initial)

```
STORAGE_PROVIDER=s3 | r2 | supabase | uploadthing
STORAGE_ENDPOINT= # optional for R2/MinIO
STORAGE_REGION=
STORAGE_BUCKET=shop-media
STORAGE_PUBLIC_BASE_URL=https://cdn.example.com
STORAGE_ACCESS_KEY_ID=
STORAGE_SECRET_ACCESS_KEY=
MAX_UPLOAD_MB=25
```

## Migration Plan

- Script to scan products/categories with placeholder URLs and backfill to media records.
- Optionally copy placeholder files to storage and update references in DB.

## Acceptance Criteria

- Admin can upload image/video; the gallery shows persisted media immediately.
- Product primary image can be set from uploaded media; PDP renders that asset.
- Placeholders are no longer used after save; a real public URL is stored.
- Uploads are access‑controlled and size/type‑validated; large files show progress.

## Milestones

1) S3 adapter + signing endpoints + DB schema
2) Admin uploader wired to signed uploads with progress UI
3) PDP/Category render from stored URLs; remove placeholders in save flow
4) Optional: CDN domain and image transforms; video preview transcoding
5) Optional: Supabase/UploadThing adapters

## References

- Next.js Route Handlers
- AWS S3 Signed URLs, Multipart Upload
- Drizzle ORM relations
