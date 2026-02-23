# Rollback plan (refactor and performance)

If issues appear after deployment, revert in this order.

## Backend (lawyer-website)

1. **Middleware:** Remove `ApiRequestIdMiddleware` from `bootstrap/app.php` (delete the line that appends it to the API stack). No functional change; only observability.
2. **Migrations:** To roll back the performance indexes:
   ```bash
   php artisan migrate:rollback --step=1
   ```
   This drops the indexes added by `2026_02_23_100000_add_performance_indexes_for_lawyers_reviews_lawyer_info`. Safe; only performance impact.
3. **SendAppointmentReminderJob:** If reminder emails break, revert the job to accept `Appointment $appointment` and use `$this->appointment->user` again; revert `AppointmentController` to dispatch `$appointment` instead of `$appointment->id`.
4. **Form Requests:** To revert to inline validation, restore the previous controller methods that used `Validator::make()` and remove the Form Request type-hints and `validated()` usage. Re-adding the old code from git history is the fastest.
5. **ReviewController:** Restore `User::first()` only for a temporary dev-only fix; do not leave in production. Prefer fixing the real bug (e.g. auth not sent) instead.
6. **ReviewRepository/Service per_page:** Revert the interface and implementation to the previous signatures (no `per_page` or fixed `paginate(10)`); revert controller `lawyerReviews`, `adminIndex`, `adminPendingReviews` to not pass `per_page`.

## Frontend (lawyerFront)

1. **Third-party script:** In `nuxt.config.ts`, restore the two inline `script` entries (Goftino and Yektanet) and remove the single `script` with `src: "/scripts/third-party-loaders.js"`. Delete `public/scripts/third-party-loaders.js` if desired.
2. **Hero image:** In `components/Landing/Header.vue`, remove `fetchpriority="high"` and set `loading="lazy"` again if needed.
3. **Composables:** Revert `composables/useGet.js`, `usePost.js`, `usePut.js`, `usePatch.js`, `useDelete.js` to the previous versions; remove `composables/useApiError.js`.
4. **manualChunks:** In `nuxt.config.ts`, remove the `quill` and `misc-vendor` branches from `manualChunks`.
5. **A11y:** Remove the added `aria-label`, `type="button"`, and `aria-hidden` from Landing components if they cause any conflict (unlikely).

## Deploy order recommendation

- Prefer **backend first** when changing API contracts (e.g. review `per_page` is backward-compatible; job signature change is backend-only). Then deploy frontend.
- If you use feature flags, consider enabling the new request-id middleware and new indexes behind flags so you can turn them off without a code rollback.
