<template>
  <div class="sms-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">ارسال پیامک به وکلا</h1>
        <p class="page-description">
          وکلا را انتخاب کنید و پیام پترنی یا متنی ارسال کنید.
        </p>
      </div>
    </div>

    <!-- Message type and content card -->
    <div class="card-dashboard">
      <div class="card-dashboard-body">
        <h2 class="section-title">نوع و محتوای پیام</h2>
        <div class="message-type-row">
          <label class="radio-label">
            <input v-model="messageType" type="radio" value="pattern" />
            <span>پیام پترنی (قالب)</span>
          </label>
          <label class="radio-label">
            <input v-model="messageType" type="radio" value="custom" />
            <span>پیام متنی (آزاد)</span>
          </label>
        </div>
        <div v-if="messageType === 'pattern'" class="form-group">
          <label class="form-label">قالب پیام</label>
          <UICSelect
            v-model="patternKey"
            :items="patternOptions"
            placeholder="یک قالب انتخاب کنید"
            class="w-full max-w-md!"
          />
        </div>
        <div v-else class="form-group">
          <label class="form-label">متن پیام (حداکثر ۳۰۰ کاراکتر)</label>
          <textarea
            v-model="customMessage"
            class="message-textarea"
            rows="4"
            placeholder="متن پیامک را وارد کنید..."
            maxlength="300"
          />
          <span class="char-count">{{ customMessage.length }} / 300</span>
        </div>
      </div>
    </div>

    <!-- Lawyers list with selection -->
    <div class="card-dashboard">
      <div class="card-dashboard-body py-4!">
        <div class="action-bar">
          <div class="action-bar-start">
            <div class="search-box">
              <Icon name="lucide:search" class="icon" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="جستجوی نام یا شماره..."
                class="w-72"
                @keyup.enter="fetchLawyers(1, true)"
              />
            </div>
            <button type="button" class="btn-secondary" @click="fetchLawyers(1, true)">
              <Icon name="lucide:filter" class="w-4 h-4" />
              <span>جستجو</span>
            </button>
          </div>
          <div class="action-bar-end">
            <span class="text-sm text-gray-500">
              {{ selectedIds.size }} وکیل انتخاب شده
            </span>
            <button
              v-if="selectedIds.size > 0"
              type="button"
              class="btn-secondary text-gray-600!"
              @click="selectedIds.clear()"
            >
              پاک کردن انتخاب
            </button>
          </div>
        </div>
        <div v-if="selectedIds.size > 0" class="bulk-actions">
          <span class="bulk-count">{{ selectedIds.size }} مورد انتخاب شده</span>
          <button type="button" class="bulk-btn" @click="toggleSelectAll">
            {{ selectedIds.size === lawyers.length ? 'لغو انتخاب همه' : 'انتخاب همه' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Lawyers table -->
    <div class="card-dashboard relative">
      <div
        v-if="tableLoading"
        class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80"
      >
        <div class="flex flex-col items-center gap-3">
          <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-gray-500" />
          <p class="text-sm text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="table-dashboard">
          <thead>
            <tr>
              <th class="w-12">
                <input
                  type="checkbox"
                  :checked="selectedIds.size === lawyers.length && lawyers.length > 0"
                  :indeterminate="selectedIds.size > 0 && selectedIds.size < lawyers.length"
                  @change="toggleSelectAll"
                />
              </th>
              <th>شناسه</th>
              <th>نام و نام خانوادگی</th>
              <th>شماره تماس</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in lawyers" :key="row.id">
              <td class="w-12">
                <input
                  type="checkbox"
                  :checked="selectedIds.has(row.id)"
                  @change="toggleRow(row.id)"
                />
              </td>
              <td class="text-gray-600">#{{ row.id }}</td>
              <td>
                <span class="font-medium text-gray-900">{{ row.fullName }}</span>
              </td>
              <td class="font-mono text-gray-600">{{ row.phone }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="!tableLoading && lawyers.length === 0"
        class="empty-state py-16"
      >
        <div class="empty-state-icon">
          <Icon name="lucide:scale" class="w-8 h-8" />
        </div>
        <h4 class="empty-state-title">وکیلی یافت نشد</h4>
        <p class="empty-state-description">
          با تغییر جستجو یا فیلتر، وکلا را مشاهده کنید.
        </p>
      </div>
      <div
        v-if="!tableLoading && lawyers.length > 0"
        class="flex items-center justify-between p-4 border-t border-gray-100"
      >
        <span class="text-sm text-gray-500">
          صفحه {{ page }} از {{ totalPages }}
        </span>
        <UPagination
          :page="page"
          :items-per-page="pageSize"
          :total="total"
          show-edges
          :sibling-count="1"
          :ui="{
            list: 'gap-1',
            item: 'min-w-8 h-8 text-sm',
            first: 'scale-x-[-1]',
            last: 'scale-x-[-1]',
            prev: 'scale-x-[-1]',
            next: 'scale-x-[-1]',
          }"
          @update:page="page = $event"
        />
      </div>
    </div>

    <!-- Send button -->
    <div class="flex justify-end pt-4">
      <button
        type="button"
        class="btn-primary"
        :disabled="!canSend || sending"
        @click="sendSms"
      >
        <Icon
          v-if="sending"
          name="lucide:loader-2"
          class="w-4 h-4 animate-spin"
        />
        <Icon v-else name="lucide:send" class="w-4 h-4" />
        <span>{{ sending ? 'در حال ارسال...' : 'ارسال پیامک' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

useHead({
  title: 'ارسال پیامک به وکلا | وکیل وکیل',
});

const messageType = ref('pattern');
const patternKey = ref(null);
const customMessage = ref('');
const patterns = ref([]);
const patternOptions = computed(() =>
  patterns.value.map((p) => ({ id: p.key, label: p.title }))
);

const lawyers = ref([]);
const page = ref(1);
const pageSize = ref(15);
const total = ref(0);
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));
const tableLoading = ref(false);
const searchQuery = ref('');
const selectedIds = ref(new Set());
const sending = ref(false);

const canSend = computed(() => {
  if (selectedIds.value.size === 0) return false;
  if (messageType.value === 'pattern') return !!patternKey.value;
  return (customMessage.value || '').trim().length > 0;
});

function toggleRow(id) {
  const next = new Set(selectedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selectedIds.value = next;
}

function toggleSelectAll() {
  if (selectedIds.value.size === lawyers.value.length) {
    selectedIds.value = new Set();
  } else {
    selectedIds.value = new Set(lawyers.value.map((l) => l.id));
  }
}

async function fetchPatterns() {
  const res = await useGet({
    url: 'admin/sms/patterns',
    includeAuthHeader: true,
  });
  if (res?.data?.data) {
    patterns.value = res.data.data;
  }
}

async function fetchLawyers(pageNum = 1, resetTotal = false) {
  tableLoading.value = true;
  try {
    const query = {
      page: pageNum,
      per_page: pageSize.value,
    };
    if (searchQuery.value?.trim()) {
      query.search = searchQuery.value.trim();
    }
    const res = await useGet({
      url: 'admin/lawyers/metrics',
      includeAuthHeader: true,
      query,
    });
    const list = res?.data?.data ?? [];
    lawyers.value = list.map((l) => ({
      id: l.id,
      fullName: [l.name, l.family].filter(Boolean).join(' ').trim() || 'بدون نام',
      phone: l.phone || '-',
    }));
    const meta = res?.data?.meta;
    if (meta?.total !== undefined) {
      total.value = meta.total;
    }
    if (resetTotal) {
      page.value = 1;
    }
  } catch (e) {
    useToast().add({ title: 'خطا در دریافت لیست وکلا', color: 'error' });
  } finally {
    tableLoading.value = false;
  }
}

watch(page, (newPage) => {
  fetchLawyers(newPage);
});

async function sendSms() {
  if (!canSend.value || sending.value) return;
  sending.value = true;
  try {
    const body = {
      lawyer_ids: Array.from(selectedIds.value),
      message_type: messageType.value,
    };
    if (messageType.value === 'pattern') {
      body.pattern_key = patternKey.value;
    } else {
      body.message = customMessage.value.trim();
    }
    const res = await usePost({
      url: 'admin/sms/send',
      includeAuthHeader: true,
      body,
    });
    if (res?.statusCode === 200 && res?.data?.data) {
      const d = res.data.data;
      useToast().add({
        title: res.data.message || `ارسال انجام شد: ${d.sent} موفق`,
        color: 'success',
      });
      selectedIds.value = new Set();
    } else {
      useToast().add({
        title: res?.message || 'خطا در ارسال پیامک',
        color: 'error',
      });
    }
  } catch (e) {
    useToast().add({ title: 'خطا در ارسال پیامک', color: 'error' });
  } finally {
    sending.value = false;
  }
}

await fetchPatterns();
await fetchLawyers(1, true);
</script>

<style scoped>
@reference "tailwindcss";

.sms-page {
  @apply space-y-6;
}

.page-header {
  @apply flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4;
}

.page-title {
  @apply text-xl font-semibold text-gray-900;
}

.page-description {
  @apply text-sm text-gray-500 mt-1;
}

.section-title {
  @apply text-sm font-medium text-gray-700 mb-4;
}

.message-type-row {
  @apply flex flex-wrap gap-4 mb-4;
}

.radio-label {
  @apply inline-flex items-center gap-2 cursor-pointer text-sm text-gray-700;
}

.radio-label input {
  @apply w-4 h-4;
}

.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

.message-textarea {
  @apply w-full max-w-2xl border border-gray-200 rounded-lg p-3 text-sm resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.char-count {
  @apply block text-xs text-gray-400 mt-1;
}

.action-bar {
  @apply flex flex-wrap items-center justify-between gap-4;
}

.action-bar-start,
.action-bar-end {
  @apply flex items-center gap-3;
}

.search-box {
  @apply relative flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white;
}

.search-box .icon {
  @apply absolute right-3 w-4 h-4 text-gray-400 pointer-events-none;
}

.search-box input {
  @apply pl-3 pr-10 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.btn-primary,
.btn-secondary {
  @apply inline-flex items-center gap-2;
}

.bulk-actions {
  @apply flex items-center gap-3 mt-4 pt-4 border-t border-gray-100;
}

.bulk-count {
  @apply text-sm font-medium text-gray-700;
}

.bulk-btn {
  @apply inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors;
}

.empty-state {
  @apply text-center;
}

.empty-state-icon {
  @apply mx-auto mb-3 text-gray-400;
}

.empty-state-title {
  @apply text-sm font-medium text-gray-900;
}

.empty-state-description {
  @apply text-sm text-gray-500 mt-1;
}
</style>
