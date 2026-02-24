// ~/middleware/auth.global.js
export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();

  // initialize اگر نشده
  if (!auth.initialized) {
    await auth.initialize();
  }

  // مسیرهای محافظت‌شده
  const protectedPrefixes = ["/dashboard", "/reserve", "/legal/ask"];
  const protectedExact = [];

  const matchesPrefix = protectedPrefixes.some(
    (prefix) => to.path === prefix || to.path.startsWith(`${prefix}/`)
  );
  const needAuth = matchesPrefix || protectedExact.includes(to.path);

  if (!needAuth) return; // مسیر عمومی

  // اگر توکن نداریم => ریدایرکت به صفحه ثبت‌نام/لاگین
  if (!auth.token) {
    return navigateTo("/register");
  }

  // سعی کن user رو لود کنی
  await auth.ensureUser();

  // client-side: اگر بعد از ensureUser هنوز user نیست => ریدایرکت
  if (import.meta.client && !auth.user) {
    return navigateTo("/register");
  }

  // --- فقط روی client نقش‌ها را بررسی کن (SSR ممکن است user هنوز نیامده) ---
  if (!import.meta.client) return;

  const roleMap = [
    { prefix: "/dashboard/admin", allowed: ["admin"] },
    { prefix: "/dashboard/lawyer", allowed: ["lawyer"] },
    // مثال: { prefix: '/reserve', allowed: ['user'] },
  ];

  const userType = String(auth.user?.user_type ?? "").toLowerCase();

  const forbidden = roleMap.some(({ prefix, allowed }) => {
    if (to.path === prefix || to.path.startsWith(`${prefix}/`)) {
      const allowedLower = allowed.map((a) => String(a).toLowerCase());
      return !allowedLower.includes(userType);
    }
    return false;
  });

  if (forbidden) {
    throw createError({ statusCode: 404, statusMessage: "Page Not Found" });
  }

  // --- شرط ویژه برای وکیل‌هایی که هنوز lawyer_id ندارند ---
  if (userType === "lawyer" && !auth.user?.lawyer_id) {
    if (to.path !== "/dashboard") {
      return navigateTo("/dashboard");
    }
  }
});
