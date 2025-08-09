// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();

  if (!auth.initialized) {
    await auth.initialize();
  }

  if (auth.token && !auth.user && import.meta.client) {
    await auth.ensureUser();
  }

  const needsAuth = to.path.startsWith("/dashboard") || to.meta.requiresAuth === true;

  if (needsAuth && (!auth.token || !auth.user)) {
    return navigateTo("/register", { replace: true });
  }
});
