/**
 * Strip broken Leaflet CSS link tags from HTML so the browser never requests them (404).
 * Leaflet styles are already loaded via nuxt.config css array.
 */
const BAD_HREF_PATTERNS = [
  "/_nuxt/leaflet/dist/leaflet.css",
  "/_nuxt/leaflet.markercluster/dist/MarkerCluster.css",
  "/_nuxt/leaflet.markercluster/dist/MarkerCluster.Default.css",
];

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:response", (response: { body?: string }) => {
    const body = response.body;
    if (typeof body !== "string") return;
    let changed = false;
    const newBody = body.replace(/<link[^>]+>/g, (tag) => {
      const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
      const href = hrefMatch ? hrefMatch[1] : "";
      if (BAD_HREF_PATTERNS.some((p) => href.includes(p))) {
        changed = true;
        return "";
      }
      return tag;
    });
    if (changed) response.body = newBody;
  });
});
