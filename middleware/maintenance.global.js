// ~/middleware/maintenance.global.js
export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig();

  // اگر maintenance mode فعال نیست، ادامه بده
  if (!config.public.maintenanceMode) return;

  // ریدایرکت به صفحه HTML استاتیک در public
  return navigateTo('/maintance.html', { external: true });
});
