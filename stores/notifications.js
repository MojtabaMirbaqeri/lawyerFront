import { defineStore } from "pinia";
import { ref, computed } from "vue";

const POLL_INTERVAL_MS = 45000;

export const useNotificationStore = defineStore("notifications", () => {
  const unreadCount = ref(0);
  const list = ref([]);
  const recent = ref([]);
  const loading = ref(false);
  const loadingCount = ref(false);
  const loadingRecent = ref(false);
  const meta = ref(null);
  let pollTimer = null;

  const hasUnread = computed(() => unreadCount.value > 0);

  async function fetchUnreadCount(showMessage = false) {
    if (loadingCount.value) return;
    loadingCount.value = true;
    try {
      const res = await useGet(
        { url: "notifications/unread-count", includeAuthHeader: true },
        showMessage
      );
      if (res.data?.data?.count !== undefined) {
        unreadCount.value = res.data.data.count;
      }
    } catch (_) {
      // useGet already shows toast on error when showMessage true
    } finally {
      loadingCount.value = false;
    }
  }

  async function fetchList(params = {}) {
    loading.value = true;
    try {
      const query = {
        page: params.page ?? 1,
        per_page: params.per_page ?? 15,
        filter: params.filter ?? "all",
      };
      const res = await useGet({
        url: "notifications",
        includeAuthHeader: true,
        query,
      });
      if (res.data?.data) {
        list.value = res.data.data;
      }
      if (res.data?.meta) {
        meta.value = res.data.meta;
      }
      return res;
    } finally {
      loading.value = false;
    }
  }

  async function fetchRecent(limit = 10) {
    loadingRecent.value = true;
    try {
      const res = await useGet({
        url: "notifications/recent",
        includeAuthHeader: true,
        query: { limit },
      });
      if (res.data?.data) {
        recent.value = res.data.data;
      }
      return res;
    } finally {
      loadingRecent.value = false;
    }
  }

  async function markAsRead(id) {
    try {
      const res = await usePatch({
        url: `notifications/${id}/read`,
        includeAuthHeader: true,
        body: {},
      });
      if (res.status) {
        unreadCount.value = Math.max(0, unreadCount.value - 1);
        const inList = list.value.find((n) => n.id === id);
        if (inList) inList.read_at = new Date().toISOString();
        const inRecent = recent.value.find((n) => n.id === id);
        if (inRecent) inRecent.read_at = new Date().toISOString();
      }
      return res;
    } catch (_) {
      return { status: false };
    }
  }

  async function markAllAsRead() {
    try {
      const res = await usePatch({
        url: "notifications/mark-all-read",
        includeAuthHeader: true,
        body: {},
      });
      if (res.status) {
        unreadCount.value = 0;
        list.value.forEach((n) => (n.read_at = n.read_at || new Date().toISOString()));
        recent.value.forEach((n) => (n.read_at = n.read_at || new Date().toISOString()));
      }
      return res;
    } catch (_) {
      return { status: false };
    }
  }

  function startPolling() {
    stopPolling();
    pollTimer = setInterval(() => {
      fetchUnreadCount(false);
    }, POLL_INTERVAL_MS);
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  return {
    unreadCount,
    list,
    recent,
    meta,
    loading,
    loadingCount,
    loadingRecent,
    hasUnread,
    fetchUnreadCount,
    fetchList,
    fetchRecent,
    markAsRead,
    markAllAsRead,
    startPolling,
    stopPolling,
  };
});
