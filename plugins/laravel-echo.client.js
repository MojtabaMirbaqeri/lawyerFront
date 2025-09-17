import Echo from "laravel-echo";
import io from "socket.io-client";

export default defineNuxtPlugin(() => {
  if (process.client) {
    window.io = io;

    // Global Echo instance که بعداً configure میشه
    window.Echo = null;

    // Helper function برای initialize کردن Echo با token
    window.initEcho = (token) => {
      // اگر قبلاً Echo instance وجود داره، disconnect کن
      if (window.Echo) {
        try {
          window.Echo.disconnect();
        } catch (e) {
          console.log("Error disconnecting Echo:", e);
        }
        window.Echo = null;
      }

      if (!token) return;

      const config = useRuntimeConfig();
      const host = config.public.websocketHost || "wss://dev.vakilinja.com";

      window.Echo = new Echo({
        broadcaster: "socket.io",
        host: host,
        auth: {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
        transports: ["websocket", "polling"],
        forceNew: true,
        reconnection: true,
        timeout: 60000,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      console.log("Echo instance created:", window.Echo);

      // Connection listeners
      window.Echo.connector.socket.on("connect", () => {
        console.log("🟢 Connected to Echo Server");
      });

      window.Echo.connector.socket.on("disconnect", (reason) => {
        console.log("🔴 Disconnected from Echo Server:", reason);
      });

      window.Echo.connector.socket.on("connect_error", (error) => {
        console.error("❌ Echo connection error:", error);
      });

      // Debug: Listen for specific events (onAny doesn't exist in v2.x)
      const originalEmit = window.Echo.connector.socket.emit;
      window.Echo.connector.socket.emit = function (...args) {
        console.log("📤 Socket emit:", args);
        return originalEmit.apply(this, args);
      };

      return window.Echo;
    };
  }
});
