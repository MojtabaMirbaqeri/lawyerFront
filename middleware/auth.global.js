// ~/middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();

  // همیشه اول store رو initialize کن
  if (!auth.initialized) {
    await auth.initialize();
  }

  // مسیرهای محافظت‌شده
  const protectedPrefixes = ["/dashboard", "/reserve"];
  const protectedExact = [];

  const matchesPrefix = protectedPrefixes.some(
    (prefix) => to.path === prefix || to.path.startsWith(`${prefix}/`)
  );

  const needAuth = matchesPrefix || protectedExact.includes(to.path);

  if (!needAuth) return; // مسیر عمومی؛ نیاز به ادامه نیست

  // اگر توکن نداریم => ریدایرکت
  if (!auth.token) {
    return navigateTo("/register");
  }

  // اگر توکن داریم => لود کاربر
  await auth.ensureUser();

  // فقط در client: اگر بعد از ensureUser هنوز user موجود نیست => ریدایرکت
  if (import.meta.client && !auth.user) {
    return navigateTo("/register");
  }
});
