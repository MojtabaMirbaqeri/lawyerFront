/**
 * Remove broken Leaflet CSS link tags that point to /_nuxt/leaflet/... (404).
 * Styles are already loaded via nuxt.config css array; these links are generated
 * by the build and request non-existent URLs.
 */
export default defineNuxtPlugin(() => {
  if (import.meta.server) return;
  const bad = [
    "/_nuxt/leaflet/dist/leaflet.css",
    "/_nuxt/leaflet.markercluster/dist/MarkerCluster.css",
    "/_nuxt/leaflet.markercluster/dist/MarkerCluster.Default.css",
  ];
  const remove = () => {
    document.querySelectorAll('link[rel="stylesheet"]').forEach((el) => {
      const href = (el as HTMLLinkElement).getAttribute("href") || "";
      if (bad.some((p) => href.includes(p))) el.remove();
    });
  };
  remove();
  nextTick(remove);
});
