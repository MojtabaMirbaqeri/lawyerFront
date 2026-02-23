// https://nuxt.com/docs/api/configuration/nuxt-config
function getImageDomains(): string[] {
  const base = (process.env.IMAGE_BASE || "").trim().replace(/\/$/, "");
  if (!base) return [];
  try {
    const url = new URL(base.startsWith("http") ? base : `https://${base}`);
    return [url.hostname];
  } catch {
    return [];
  }
}

function getApiPreconnect(): { rel: string; href: string }[] {
  const apiEp = (process.env.API_EP || "").trim();
  if (!apiEp) return [];
  try {
    const origin = new URL(apiEp.startsWith("http") ? apiEp : `https://${apiEp}`).origin;
    return [{ rel: "preconnect", href: origin }];
  } catch {
    return [];
  }
}

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  image: {
    provider: "none", // مسیر مستقیم تصاویر؛ IPX روی سرور درست کار نمی‌کند
    domains: getImageDomains(),
    quality: 85,
    format: "webp",
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      failOnError: false,
    },
    // Cache sitemap API and XMLs for 1 day (86400 seconds)
    routeRules: {
      "/api/sitemap-urls": { swr: 86400 },
      "/sitemap.xml": { swr: 86400 },
      "/sitemap_index.xml": { swr: 86400 }, // Add explicit rule for index
      "/sitemap-*.xml.gz": { swr: 86400 },
      // Long-lived cache for built assets (Lighthouse cache insight)
      "/_nuxt/**": {
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      apiEndpoint: process.env.API_EP,
      imageBase: process.env.IMAGE_BASE,
      websocketHost: process.env.WEBSOCKET_HOST,
      maintenanceMode: process.env.MAINTENANCE_MODE === "true",
    },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "page", mode: "out-in" },
    head: {
      titleTemplate: "%s وکیل وکیل (VakilVakil) | لیست وکلا، مشاوره آنلاین و رزرو نوبت",
      htmlAttrs: {
        dir: "rtl",
        lang: "fa",
      },
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
        },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: getApiPreconnect(),
      script: [
        { src: "/scripts/third-party-loaders.js", defer: true },
      ],
    },
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/ui",
    "@pinia/nuxt",
    "@nuxtjs/leaflet",
    "nuxt-rating",
    "nuxt-countdown",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
  ],
  sitemap: {
    sources: ["/api/sitemap-urls"],
    sitemaps: true, // Enable multiple sitemaps for large datasets
    defaultSitemapsChunkSize: 1000, // Chunk size for each sitemap file
    // Performance optimizations
    cacheMaxAgeSeconds: 86400, // Cache for 1 day
    // Only generate sitemap when GENERATE_SITEMAP env is set
    enabled:
      process.env.GENERATE_SITEMAP === "true" || process.env.NODE_ENV === "development",
  },
  site: {
    url: process.env.SITE_URL || "https://vakilvakil.com",
    name: "وکیل وکیل",
    defaultLocale: "fa",
  },
  css: [
    "@/assets/css/main.css",
    "@/assets/Webfonts/fontiran.css",
    "leaflet/dist/leaflet.css",
    "leaflet.markercluster/dist/MarkerCluster.css",
    "leaflet.markercluster/dist/MarkerCluster.Default.css",
  ],
  ui: {
    colorMode: false,
  },
  leaflet: {
    markerCluster: true,
  },
  icon: {
    clientBundle: {
      scan: true,

      sizeLimitKb: 256,
    },
    customCollections: [
      {
        prefix: "custom",
        dir: "./assets/icons",
      },
    ],
  },
  vite: {
    build: {
      // Source maps disabled in production to reduce deploy size; enable if debugging prod
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("vue") || id.includes("pinia") || id.includes("vue-router")) return "vue-vendor";
              if (id.includes("@nuxt/ui") || id.includes("radix-vue")) return "ui-vendor";
              // Do not chunk leaflet by name "leaflet" - it causes 404 requests for /_nuxt/leaflet/dist/leaflet.css
              if (id.includes("quill")) return "quill";
              if (id.includes("nuxt-rating") || id.includes("nuxt-countdown")) return "misc-vendor";
            }
          },
        },
      },
    },
  },
});
