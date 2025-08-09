import { useAuthStore } from "@/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();

  if (to.path === "/register" && auth.token) {
    return navigateTo("/dashboard", { replace: true });
  }
});
