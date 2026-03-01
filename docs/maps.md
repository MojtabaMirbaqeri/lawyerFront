# Iran Provinces Map Module

## Overview

The homepage includes an interactive Iran provinces map so users can find active lawyers by province. Each province is clickable and shows active lawyer count in a tooltip.

## SVG Asset

- **Location:** `assets/maps/iran-provinces.svg` and `public/maps/iran-provinces.svg` (used at runtime for the map component).
- **Source:** [nastoohir/iran-map-svg](https://github.com/nastoohir/iran-map-svg) (master branch, `iran.min.svg`). Vendored and used under the repository’s license.
- **Structure:** The SVG has a group `#provinces` containing one `<path>` per province. Each path has an `id` attribute (e.g. `tehran`, `east-azerbaijan`).

## Province ID Mapping

The SVG path `id` values do not always match this project’s route slugs (`en_name` in `public/provinces.json`). The mapping is in **`utils/svgProvinceIdMap.ts`**:

- `SVG_PATH_ID_TO_EN_NAME`: map from SVG path id → `en_name` (route slug).
- Examples: `azerbaijan-east` → `east-azerbaijan`, `chaharmahal-bakhriari` → `chaharmahal-bakhtiari`, `khorasan-north` → `north-khorasan`.

Route slugs are the same as in `public/provinces.json` and are used for `/provinces/[slug]` pages.

## Active Lawyer Counts

- **Backend:** `GET /api/area/provinces/active-lawyer-counts` returns an array of `{ id, name, active_lawyer_count }` (numeric `id` = `ostan.id`). Only active, non-deleted lawyers with a province are counted.
- **Frontend:** `composables/useProvinceMapData.ts` fetches this endpoint and merges with `public/provinces.json` by `id` so each province has `id`, `name`, `en_name`, and `active_lawyer_count`.

## Replacing or Updating the SVG

1. Replace the file at `assets/maps/iran-provinces.svg` and, if the map is loaded from public, `public/maps/iran-provinces.svg`.
2. If the new SVG uses different path `id`s, update `utils/svgProvinceIdMap.ts` so every province path `id` maps to the correct `en_name` from `public/provinces.json`.
3. Keep the same structure: one path per province inside a group (e.g. `#provinces`). The component targets `#provinces path` for hover/click.

## Extending to City-Level

The same patterns can be reused for city-level interaction:

- Add a city-level SVG or GeoJSON and a city id/slug mapping.
- Add an API endpoint for city-level active lawyer counts (or reuse filters).
- Reuse `resolveProvinceLawyersRoute`-style helpers for city lawyer pages if you add city routes.

## Key Files

| Purpose              | Path |
|----------------------|------|
| Section (homepage)   | `components/Landing/FindActiveLawyersByProvinceSection.vue` |
| Map component        | `components/maps/IranProvincesMap.vue` |
| Tooltip              | `components/maps/ProvinceMapTooltip.vue` |
| Province data        | `composables/useProvinceMapData.ts` |
| Route helper         | `utils/provinceRouteMap.ts` |
| SVG id → slug map     | `utils/svgProvinceIdMap.ts` |
