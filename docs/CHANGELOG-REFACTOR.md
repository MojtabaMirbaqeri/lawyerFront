# Changelog: Architecture refactor and performance

## Architecture refactors

- **Backend:** Removed duplicate `indexLawyer` in `ReviewController`; public lawyer reviews use only `lawyerReviews`.
- **Backend:** Replaced inline `Validator::make()` with Form Request classes: `StoreReviewRequest`, `ReplyReviewRequest`, `StoreArticleRequest`, `UpdateArticleRequest`, `StoreLawyerNoteRequest`, `UpdateLawyerNoteRequest`, `SendAdminSmsRequest` (Admin).
- **Backend:** Standardized `per_page` on review list endpoints (lawyer reviews, admin index, admin pending) with a cap of 50; `ReviewRepository` and `ReviewService` accept `per_page` parameters.
- **Frontend:** Extracted shared API error parsing and toast logic into `composables/useApiError.js`; `useGet`, `usePost`, `usePut`, `usePatch`, `useDelete` now use `parseApiErrorMessage` and `showApiErrorToast`.

## Performance improvements

- **Frontend:** Hero image (Landing Header) uses `fetchpriority="high"` and `loading="eager"` for LCP; explicit width/height and descriptive alt.
- **Frontend:** Third-party scripts (Goftino, Yektanet) moved to deferred external script `/scripts/third-party-loaders.js` to avoid render-blocking inline script.
- **Frontend:** Additional `manualChunks` for Quill and misc vendor (nuxt-rating, nuxt-countdown) for better code splitting.
- **Backend:** `SendAppointmentReminderJob` now receives `appointmentId` and uses `Appointment::with('user')` in `handle()` to avoid N+1.
- **Backend:** New migration adding indexes: `lawyers` (is_active, lawyer_info_id), `reviews` (lawyer_id, status), `lawyer_info` (city_id, province_id).

## Security / best practices

- **Backend:** Removed production-unsafe `User::first()` fallback in `ReviewController::store()`; only authenticated user can submit reviews.
- **Backend:** Added `ApiRequestIdMiddleware`: sets `X-Request-ID` on request/response and `X-Response-Time`; logs request_id, method, path, duration when `APP_DEBUG` is true.

## Accessibility fixes

- **Frontend:** Added `type="button"` and `aria-label` to Landing buttons (Header quick actions, CtaSection, ServicesSection, Filters remove-specialty); decorative icons use `aria-hidden="true"`.

## Documentation and infra

- **Nginx:** Expanded `docs/NGINX-RECOMMENDATIONS.md` with concrete snippets for gzip/brotli, static cache, security headers, API proxy, and blocking sensitive paths.
- **Backend:** Added `docs/CACHE.md` with Redis/cache usage and production checklist.
