<template>
  <section class="lawyer-verification-page">
    <div class="page-header mb-6">
      <h1 class="page-title">درخواست‌های تایید وکلا (مورد تایید سایت)</h1>
      <p class="page-desc">
        وکلایی که درخواست نمایش به عنوان «وکیل تایید شده» داده‌اند. با بررسی اطلاعات و تایید یا رد، بج «تایید شده» در کارت وکیل نمایش داده می‌شود یا خیر.
      </p>
    </div>

    <div class="toolbar">
      <div class="search-wrap">
        <UIcon name="lucide:search" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="جستجو (نام، موبایل، ایمیل)..."
          @input="onSearchInput"
        />
      </div>
      <div class="filter-tabs">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          type="button"
          :class="['tab-btn', { active: statusFilter === tab.value }]"
          @click="statusFilter = tab.value; fetchList()">
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-wrap">
      <UIcon name="lucide:loader-2" class="size-8 animate-spin text-gray-400" />
      <span>در حال بارگذاری...</span>
    </div>

    <div v-else-if="!list.length" class="empty-wrap">
      <Icon name="lucide:inbox" class="w-12 h-12 text-gray-300" />
      <p class="empty-title">درخواستی یافت نشد</p>
      <p class="empty-desc">
        {{ statusFilter === 'pending' ? 'در حال حاضر درخواست در انتظار بررسی وجود ندارد.' : 'برای این وضعیت درخواستی ثبت نشده است.' }}
      </p>
    </div>

    <div v-else-if="!filteredList.length" class="empty-wrap">
      <Icon name="lucide:search-x" class="w-12 h-12 text-gray-300" />
      <p class="empty-title">نتیجه‌ای یافت نشد</p>
      <p class="empty-desc">با عبارت «{{ searchQuery }}» موردی در این لیست یافت نشد. جستجو را تغییر دهید.</p>
    </div>

    <div v-else class="table-wrap">
      <table class="verification-table">
        <thead>
          <tr>
            <th>وکیل</th>
            <th>تماس</th>
            <th>تاریخ درخواست</th>
            <th>وضعیت</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in filteredList" :key="row.id">
            <td>
              <NuxtLink
                :to="`/dashboard/admin/lawyer-verification/${row.id}`"
                class="lawyer-name-link">
                {{ row.lawyer?.name }} {{ row.lawyer?.family }}
              </NuxtLink>
            </td>
            <td class="contact-cell">
              <span class="font-mono text-sm text-gray-700">{{ row.lawyer?.phone || '—' }}</span>
              <span v-if="row.lawyer?.email" class="email-text">{{ row.lawyer.email }}</span>
            </td>
            <td>
              <span class="date-text">{{ formatDate(row.requested_at) }}</span>
            </td>
            <td>
              <span :class="statusClass(row.status)" class="status-badge">{{ statusLabel(row.status) }}</span>
            </td>
            <td class="actions-cell">
              <div class="actions-wrap">
                <NuxtLink
                  :to="`/dashboard/admin/lawyerlist/edit/${row.lawyer_id}`"
                  class="btn-edit">
                  <Icon name="lucide:external-link" class="w-4 h-4 shrink-0" />
                  ویرایش وکیل
                </NuxtLink>
                <template v-if="row.status === 'pending'">
                  <button
                    type="button"
                    class="btn-approve"
                    :disabled="actionLoading === row.id"
                    @click="approve(row.id)">
                    <Icon v-if="actionLoading === row.id" name="lucide:loader-2" class="w-4 h-4 shrink-0 animate-spin" />
                    <Icon v-else name="lucide:check" class="w-4 h-4 shrink-0" />
                    تایید
                  </button>
                  <button
                    type="button"
                    class="btn-reject"
                    :disabled="actionLoading === row.id"
                    @click="reject(row.id)">
                    <Icon v-if="actionLoading === row.id" name="lucide:loader-2" class="w-4 h-4 shrink-0 animate-spin" />
                    <Icon v-else name="lucide:x" class="w-4 h-4 shrink-0" />
                    رد
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="meta.total > meta.per_page" class="pagination-wrap">
        <button
          type="button"
          :disabled="meta.current_page <= 1"
          @click="goPage(meta.current_page - 1)">
          قبلی
        </button>
        <span class="pagination-info">
          صفحه {{ meta.current_page }} از {{ meta.last_page }}
        </span>
        <button
          type="button"
          :disabled="meta.current_page >= meta.last_page"
          @click="goPage(meta.current_page + 1)">
          بعدی
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
const toast = useToast();
const statusFilter = ref('pending');
const searchQuery = ref('');
const list = ref([]);
const meta = ref({ current_page: 1, last_page: 1, per_page: 15, total: 0 });
const loading = ref(false);
const actionLoading = ref(null);

const statusTabs = [
  { value: 'pending', label: 'در انتظار بررسی' },
  { value: 'approved', label: 'تایید شده' },
  { value: 'rejected', label: 'رد شده' },
];

const filteredList = computed(() => {
  const q = (searchQuery.value || '').trim().toLowerCase();
  if (!q) return list.value;
  return list.value.filter((row) => {
    const name = `${row.lawyer?.name ?? ''} ${row.lawyer?.family ?? ''}`.toLowerCase();
    const phone = (row.lawyer?.phone ?? '').toString();
    const email = (row.lawyer?.email ?? '').toLowerCase();
    return name.includes(q) || phone.includes(q) || email.includes(q);
  });
});

function onSearchInput() {
  // filteredList is reactive; no extra action needed
}

async function fetchList(page = 1) {
  loading.value = true;
  try {
    const res = await useGet({
      url: 'admin/lawyer-verification-requests',
      includeAuthHeader: true,
      query: { status: statusFilter.value, per_page: 15, page },
    });
    if (res.data?.data !== undefined) {
      list.value = res.data.data || [];
      list.value = Array.isArray(list.value) ? list.value : [];
    } else {
      list.value = Array.isArray(res.data) ? res.data : [];
    }
    const m = res.data?.meta ?? res.meta ?? {};
    meta.value = {
      current_page: m.current_page ?? 1,
      last_page: m.last_page ?? 1,
      per_page: m.per_page ?? 15,
      total: m.total ?? 0,
    };
  } catch (_) {
    list.value = [];
  } finally {
    loading.value = false;
  }
}

function goPage(page) {
  if (page < 1 || page > meta.value.last_page) return;
  fetchList(page);
}

function formatDate(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short' }).format(d);
  } catch {
    return iso;
  }
}

function statusLabel(s) {
  const map = { pending: 'در انتظار', approved: 'تایید شده', rejected: 'رد شده' };
  return map[s] || s;
}

function statusClass(s) {
  const map = {
    pending: 'badge badge-warning',
    approved: 'badge badge-success',
    rejected: 'badge badge-error',
  };
  return map[s] || 'badge';
}

async function approve(id) {
  actionLoading.value = id;
  try {
    const res = await usePut({
      url: `admin/lawyer-verification-requests/${id}/approve`,
      includeAuthHeader: true,
      body: {},
    });
    if (res.statusCode === 200) {
      toast.add({ title: 'وکیل با موفقیت تایید شد', color: 'success' });
      await fetchList(meta.value.current_page);
    } else {
      toast.add({ title: res.message || 'خطا در تایید', color: 'error' });
    }
  } catch (e) {
    toast.add({ title: 'خطا در تایید', color: 'error' });
  } finally {
    actionLoading.value = null;
  }
}

async function reject(id) {
  actionLoading.value = id;
  try {
    const res = await usePut({
      url: `admin/lawyer-verification-requests/${id}/reject`,
      includeAuthHeader: true,
      body: {},
    });
    if (res.statusCode === 200) {
      toast.add({ title: 'درخواست رد شد', color: 'success' });
      await fetchList(meta.value.current_page);
    } else {
      toast.add({ title: res.message || 'خطا در رد', color: 'error' });
    }
  } catch (e) {
    toast.add({ title: 'خطا در رد', color: 'error' });
  } finally {
    actionLoading.value = null;
  }
}

onMounted(() => {
  fetchList();
});

useHead({
  title: 'درخواست‌های تایید وکلا | وکیل وکیل',
});
</script>

<style scoped>
@reference "tailwindcss";

.lawyer-verification-page {
  @apply w-auto;
}

.page-title {
  @apply text-xl font-bold text-gray-900 mb-1;
}

.page-desc {
  @apply text-sm text-gray-500;
}

.toolbar {
  @apply flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6;
}

.search-wrap {
  @apply relative flex items-center w-full sm:max-w-[280px];
}

.search-icon {
  @apply absolute right-3 w-5 h-5 text-gray-400 pointer-events-none;
}

.search-input {
  @apply w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400;
  @apply focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f];
}

.filter-tabs {
  @apply flex gap-2 flex-wrap;
}

.tab-btn {
  @apply px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition;
}

.tab-btn.active {
  @apply bg-[#1e3a5f] text-white hover:bg-[#1e3a5f];
}

.loading-wrap,
.empty-wrap {
  @apply flex flex-col items-center justify-center py-16 gap-3 text-gray-500;
}

.empty-title {
  @apply font-medium text-gray-700;
}

.empty-desc {
  @apply text-sm text-center max-w-sm;
}

.table-wrap {
  @apply bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm;
}

.verification-table {
  @apply w-full text-right;
}

.verification-table th {
  @apply px-4 py-3 text-xs font-semibold text-gray-500 uppercase bg-gray-50 border-b border-gray-100;
}

.verification-table td {
  @apply px-4 py-3 border-b border-gray-100 text-sm;
}

.verification-table tbody tr:hover {
  @apply bg-gray-50/50;
}

.lawyer-name-link {
  @apply font-medium text-[#1e3a5f] hover:underline hover:text-[#163358];
}

.contact-cell {
  @apply min-w-[120px];
}

.email-text {
  @apply block text-xs text-gray-500 mt-0.5;
}

.date-text {
  @apply text-sm text-gray-600;
}

.status-badge {
  @apply inline-block px-2.5 py-1 rounded-full text-xs font-medium;
}

.actions-cell {
  @apply min-w-[200px];
}

.actions-wrap {
  @apply flex flex-wrap items-center gap-2;
}

.btn-edit {
  @apply inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition shrink-0;
}

.btn-approve {
  @apply inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition shrink-0;
}

.btn-reject {
  @apply inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition shrink-0;
}

.badge {
  @apply px-2 py-0.5 rounded text-xs font-medium;
}

.badge-warning {
  @apply bg-amber-100 text-amber-800;
}

.badge-success {
  @apply bg-green-100 text-green-800;
}

.badge-error {
  @apply bg-red-100 text-red-800;
}

.pagination-wrap {
  @apply flex items-center justify-center gap-4 py-4 border-t border-gray-100;
}

.pagination-info {
  @apply text-sm text-gray-600;
}

.pagination-wrap button {
  @apply px-3 py-1.5 rounded border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>
