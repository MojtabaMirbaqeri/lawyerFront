/**
 * Composable for notification state and actions.
 * Uses the notifications Pinia store; use from dashboard layout for polling.
 */
export function useNotifications() {
  const store = useNotificationStore();

  return {
    unreadCount: store.unreadCount,
    list: store.list,
    recent: store.recent,
    meta: store.meta,
    loading: store.loading,
    loadingCount: store.loadingCount,
    loadingRecent: store.loadingRecent,
    hasUnread: store.hasUnread,
    fetchUnreadCount: store.fetchUnreadCount,
    fetchList: store.fetchList,
    fetchRecent: store.fetchRecent,
    markAsRead: store.markAsRead,
    markAllAsRead: store.markAllAsRead,
    startPolling: store.startPolling,
    stopPolling: store.stopPolling,
  };
}
