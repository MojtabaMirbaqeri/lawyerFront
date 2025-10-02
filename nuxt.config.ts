// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  nitro: {
    prerender: {
      crawlLinks: false,
      failOnError: false,
    },
  },
  runtimeConfig: {
    public: {
      apiEndpoint: process.env.API_EP,
      imageBase: process.env.IMAGE_BASE,
      websocketHost: process.env.WEBSOCKET_HOST,
    },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "page", mode: "out-in" },
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
  ],
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
