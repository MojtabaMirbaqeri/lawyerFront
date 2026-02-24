/**
 * Composable for permission checks (e.g. logs.view, logs.export).
 * Depends on auth store user having permissions array from API.
 */
export function usePermissions() {
  const authStore = useAuthStore();

  const permissions = computed(() => authStore.user?.permissions ?? []);

  const canViewLogs = computed(() => permissions.value.includes("logs.view"));
  const canExportLogs = computed(() => permissions.value.includes("logs.export"));
  const canManageRetention = computed(() => {
    const user = authStore.user;
    if (!user?.roles) return false;
    return user.roles.some((r) => r?.slug === "super_admin");
  });

  return {
    permissions,
    canViewLogs,
    canExportLogs,
    canManageRetention,
    hasPermission: (slug) => permissions.value.includes(slug),
  };
}
