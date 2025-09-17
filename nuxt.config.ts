// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiEndpoint: process.env.API_EP,
      imageBase: process.env.IMAGE_BASE,
      host: process.env.NUXT_PUBLIC_WEBSOCKET_HOST || 'localhost',
      port: '',
      scheme: process.env.NUXT_PUBLIC_WEBSOCKET_SCHEME || 'http',
      appId: process.env.NUXT_PUBLIC_WEBSOCKET_APP_ID || 'lawyer-app',
      appKey: process.env.NUXT_PUBLIC_WEBSOCKET_APP_KEY || 'lawyer-key-123456',
      appSecret: process.env.NUXT_PUBLIC_WEBSOCKET_APP_SECRET || 'Zx8!kL9@pQwErTyUiOp1234567890'
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
    "nuxt-socket-io"
  ],
  css: ["@/assets/css/main.css", "@/assets/Webfonts/fontiran.css"],
  plugins: [
    '~/plugins/laravel-echo.client.js'
  ],
  io: {
    sockets: [
      {
        name: 'main',
        url: 'https://api.vakilinja.com',
        default: true
      },
    ]
  },
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
