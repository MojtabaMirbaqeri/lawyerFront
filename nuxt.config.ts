// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
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
      titleTemplate: "%s | وکیل وکیل",
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
      script: [
        {
          type: "text/javascript",
          innerHTML: `["keydown","touchmove","touchstart","mouseover"].forEach(function(v){window.addEventListener(v,function(){if(!window.isGoftinoAdded){window.isGoftinoAdded=1;var i="DfL38U",d=document,g=d.createElement("script"),s="https://www.goftino.com/widget/"+i,l=localStorage.getItem("goftino_"+i);g.type="text/javascript",g.async=!0,g.src=l?s+"?o="+l:s;d.getElementsByTagName("head")[0].appendChild(g);}})});`,
        },
        {
          type: "text/javascript",
          innerHTML: ` !function(e,t,n){e.yektanetAnalyticsObject=n,e[n]=e[n]||function(){e[n].q.push(arguments)},e[n].q=e[n].q||[];var a=t.getElementsByTagName("head")[0],r=new Date,c="https://cdn.yektanet.com/superscript/LFcYdvcQ/native-vakilvakil.com-45548/yn_pub.js?v="+r.getFullYear().toString()+"0"+r.getMonth()+"0"+r.getDate()+"0"+r.getHours(),s=t.createElement("link");s.rel="preload",s.as="script",s.href=c,a.appendChild(s);var l=t.createElement("script");l.async=!0,l.src=c,a.appendChild(l)}(window,document,"yektanet");`,
        },
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
    url: process.env.SITE_URL || "https://vakilvakil.ir",
    name: "وکیل وکیل",
    defaultLocale: "fa",
  },
  css: ["@/assets/css/main.css", "@/assets/Webfonts/fontiran.css"],
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
});
