# Verification guide (refactor and performance)

## Build and lint

### Frontend (lawyerFront)

```bash
cd lawyerFront
npm ci
npm run build
npm run lint
```

### Backend (lawyer-website)

```bash
cd lawyer-website
composer install --no-dev
php artisan config:cache
php artisan route:cache
php artisan migrate --force
php artisan test
```

(Use `composer install` with dev deps and `php artisan test` for full test run locally.)

## Re-run Lighthouse

1. Build the frontend and serve (e.g. `npm run preview` or deploy).
2. Run Lighthouse (CLI or DevTools):
   ```bash
   npx lighthouse https://your-domain.com/ --output=json --output-path=./report.json
   ```
3. Compare Performance, Accessibility, and Best Practices scores and metrics (LCP, Speed Index, TTI) with the baseline in the plan.

## API benchmark (simple)

Using **curl** for a quick check:

```bash
# Response time and headers (request-id, response-time)
curl -w "\nTime: %{time_total}s\n" -I "https://your-api-domain.com/api/lawyers?per_page=5"
```

Using **autocannon** (Node) for load:

```bash
npx autocannon -c 10 -d 5 "https://your-api-domain.com/api/lawyers?per_page=10"
```

Using **k6** (if installed):

```javascript
// api-load.js
import http from 'k6/http';
export const options = { vus: 5, duration: '10s' };
export default function () {
  http.get('https://your-api-domain.com/api/lawyers?per_page=10');
}
```

```bash
k6 run api-load.js
```

Replace `your-api-domain.com` with the real API base URL.
