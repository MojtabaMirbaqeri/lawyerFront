export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();

  // اول store را initialize کن
  if (!auth.initialized) {
    await auth.initialize();
  }

  // بررسی مسیرهای محافظت شده
  if (to.path.startsWith("/dashboard")) {
  

    if (!auth.token) {
      return navigateTo("/register");
    }
    if (auth.token) {
      await auth.ensureUser();
      if (!auth.user && import.meta.client) {
        return navigateTo("/register");
      }
    }
  }


});
