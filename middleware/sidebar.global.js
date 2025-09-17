export default defineNuxtRouteMiddleware(() => {
  const globalStore = useGlobalStore();
  const dashboardStore = useDashboardStore();

  if (globalStore.sidebarVisblity) {
    globalStore.toggleSidebar();
  }
  if (dashboardStore.openSidebar) {
    dashboardStore.openSidebar = false;
  }
});
