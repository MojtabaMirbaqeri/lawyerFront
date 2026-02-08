import Echo from "laravel-echo";
import Pusher from "pusher-js";

// برای اتصال به Laravel Reverb از پروتکل Pusher استفاده می‌کنیم
window.Pusher = Pusher;

export default defineNuxtPlugin(() => {
  if (process.client) {
    window.Echo = null;

    window.initEcho = (token) => {
      if (window.Echo) {
        try {
          window.Echo.disconnect();
        } catch (e) {
          console.log("Error disconnecting Echo:", e);
        }
        window.Echo = null;
      }

      if (!token) return null;

      const config = useRuntimeConfig();
      const reverb = config.public.reverb || {};
      const apiEndpoint = (config.public.apiEndpoint || "").replace(/\/api\/?$/, "") || "";
      const key = reverb.key || "vakilvakil-key";
      const host = reverb.host || "localhost";
      const port = reverb.port ?? 8080;
      const scheme = reverb.scheme || "http";
      const useTLS = scheme === "https";

      window.Echo = new Echo({
        broadcaster: "reverb",
        key,
        wsHost: host,
        wsPort: port,
        wssPort: port,
        forceTLS: useTLS,
        enabledTransports: ["ws", "wss"],
        authEndpoint: `${apiEndpoint || ""}/broadcasting/auth`,
        auth: {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      });

      if (window.Echo.connector?.pusher) {
        window.Echo.connector.pusher.connection.bind("connected", () => {
          console.log("🟢 Connected to Reverb (WebSocket)");
        });
        window.Echo.connector.pusher.connection.bind("disconnected", () => {
          console.log("🔴 Disconnected from Reverb");
        });
        window.Echo.connector.pusher.connection.bind("error", (err) => {
          console.error("❌ Reverb connection error:", err);
        });
      }

      return window.Echo;
    };
  }
});
