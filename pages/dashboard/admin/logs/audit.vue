<template>
  <div class="logs-page">
    <div class="page-header mb-4">
      <h1 class="page-title">لاگ حسابرسی</h1>
      <p class="page-description">عملیات و تغییرات مهم با فیلتر بر اساس تاریخ، نقش، اکشن و موجودیت</p>
      <div class="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900">
        <span class="font-medium text-amber-800">این صفحه نمایش می‌دهد:</span>
        زمان عملیات، نقش انجام‌دهنده (کاربر، وکیل، ادمین، سیستم)، اکشن، نوع و شناسه موجودیت تحت تأثیر، آدرس IP، شدت (کم، متوسط، بالا)، و در جزئیات: شناسه درخواست، مسیر، متد و مقادیر قبل/بعد تغییر.
      </div>
      <div class="flex gap-2 mt-2">
        <a
          v-if="canExportLogs"
          href="#"
          class="btn-secondary inline-flex items-center gap-2"
          @click.prevent="exportCsv"
        >
          <Icon name="lucide:download" class="w-4 h-4" />
          خروجی CSV
        </a>
        <button
          v-if="canManageRetention"
          type="button"
          class="btn-secondary inline-flex items-center gap-2"
          @click="showRetentionModal = true"
        >
          <Icon name="lucide:trash-2" class="w-4 h-4" />
          حذف بر اساس نگهداری
        </button>
      </div>
    </div>

    <div class="card-dashboard">
      <div class="card-dashboard-body py-4">
        <div class="action-bar flex flex-wrap gap-3">
          <input v-model="filters.date_from" type="date" class="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <input v-model="filters.date_to" type="date" class="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <select v-model="filters.actor_type" class="rounded-lg border border-gray-200 px-3 py-2 text-sm w-32">
            <option value="">همه نقش‌ها</option>
            <option value="user">کاربر</option>
            <option value="lawyer">وکیل</option>
            <option value="admin">ادمین</option>
            <option value="system">سیستم</option>
          </select>
          <input v-model="filters.action" type="text" placeholder="اکشن" class="rounded-lg border border-gray-200 px-3 py-2 text-sm w-40" />
          <input v-model="filters.entity_type" type="text" placeholder="نوع موجودیت" class="rounded-lg border border-gray-200 px-3 py-2 text-sm w-32" />
          <input v-model="filters.entity_id" type="text" placeholder="شناسه موجودیت" class="rounded-lg border border-gray-200 px-3 py-2 text-sm w-28" />
          <input v-model="filters.ip" type="text" placeholder="IP" class="rounded-lg border border-gray-200 px-3 py-2 text-sm w-32" />
          <input v-model="filters.request_id" type="text" placeholder="شناسه درخواست" class="rounded-lg border border-gray-200 px-3 py-2 text-sm w-44" />
          <select v-model="filters.severity" class="rounded-lg border border-gray-200 px-3 py-2 text-sm w-28">
            <option value="">همه شدت‌ها</option>
            <option value="low">کم</option>
            <option value="medium">متوسط</option>
            <option value="high">بالا</option>
          </select>
          <input v-model="filters.search" type="text" placeholder="جستجو" class="rounded-lg border border-gray-200 px-3 py-2 text-sm w-40" />
          <button class="btn-primary" @click="applyFilters">
            <Icon name="lucide:search" class="w-4 h-4" />
            اعمال فیلتر
          </button>
        </div>
      </div>
    </div>

    <div class="card-dashboard relative">
      <div v-if="pending" class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80 min-h-[200px]">
        <div class="flex flex-col items-center gap-3">
          <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-gray-500" />
          <p class="text-sm text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
      <div v-show="!pending" class="overflow-x-auto">
        <table class="table-dashboard">
          <thead>
            <tr>
              <th>زمان</th>
              <th>نقش</th>
              <th>اکشن</th>
              <th>موجودیت</th>
              <th>IP</th>
              <th>شدت</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in data" :key="row.id">
              <td class="text-sm text-gray-600">{{ formatDate(row.created_at) }}</td>
              <td>{{ actorTypeLabel(row.actor_type) }}</td>
              <td class="font-mono text-sm">{{ row.action }}</td>
              <td>{{ row.entity_type }} #{{ row.entity_id ?? "—" }}</td>
              <td class="font-mono text-sm">{{ row.ip || "—" }}</td>
              <td>
                <span :class="severityClass(row.severity)">{{ severityLabel(row.severity) }}</span>
              </td>
              <td>
                <button type="button" class="text-primary-600 text-sm" @click="openDetail(row)">جزئیات</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="!pending && total > 0" class="flex items-center justify-between p-4 border-t border-gray-100">
        <span class="text-sm text-gray-500">صفحه {{ currentPage }} از {{ totalPages }} ({{ total }} رکورد)</span>
        <UPagination
          :page="currentPage"
          :items-per-page="perPage"
          :total="total"
          show-edges
          :sibling-count="1"
          :ui="{ list: 'gap-1', item: 'min-w-8 h-8 text-sm', first: 'scale-x-[-1]', last: 'scale-x-[-1]', prev: 'scale-x-[-1]', next: 'scale-x-[-1]' }"
          @update:page="currentPage = $event"
        />
      </div>
      <div v-if="data.length === 0 && !pending" class="empty-state py-16">
        <Icon name="lucide:inbox" class="w-8 h-8 text-gray-400" />
        <h4 class="empty-state-title">رکوردی یافت نشد</h4>
      </div>
    </div>

    <UModal v-model:open="showDetailModal" title="جزئیات لاگ">
      <template #body>
        <div v-if="selectedLog" class="space-y-3 text-sm">
          <p><span class="font-medium">شناسه درخواست:</span> <code class="bg-gray-100 px-1 rounded">{{ selectedLog.request_id || "—" }}</code></p>
          <p><span class="font-medium">مسیر:</span> {{ selectedLog.metadata?.route || "—" }}</p>
          <p><span class="font-medium">متد:</span> {{ selectedLog.metadata?.method || "—" }}</p>
          <div v-if="selectedLog.before && Object.keys(selectedLog.before).length">
            <p class="font-medium">قبل:</p>
            <pre class="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">{{ JSON.stringify(selectedLog.before, null, 2) }}</pre>
          </div>
          <div v-if="selectedLog.after && Object.keys(selectedLog.after).length">
            <p class="font-medium">بعد:</p>
            <pre class="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">{{ JSON.stringify(selectedLog.after, null, 2) }}</pre>
          </div>
        </div>
      </template>
    </UModal>

    <UModal v-model:open="showRetentionModal" title="حذف بر اساس نگهداری">
      <template #body>
        <p class="text-sm text-gray-600 mb-3">رکوردهای قدیمی‌تر از تعداد روز مشخص حذف می‌شوند (حداقل ۳۰، حداکثر ۳۶۵ روز).</p>
        <input v-model.number="retentionDays" type="number" min="30" max="365" class="rounded-lg border border-gray-200 px-3 py-2 w-full" placeholder="تعداد روز (مثلاً 90)" />
        <div class="flex gap-2 mt-4">
          <button class="btn-primary" :disabled="retentionDays < 30 || retentionDays > 365" @click="runRetention">تایید و حذف</button>
          <button class="btn-secondary" @click="showRetentionModal = false">انصراف</button>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup>
useHead({ title: "لاگ حسابرسی | وکیل وکیل" });

const { canExportLogs, canManageRetention } = usePermissions();

const data = ref([]);
const pending = ref(true);
const total = ref(0);
const totalPages = ref(1);
const currentPage = ref(1);
const perPage = 15;
const filters = ref({
  date_from: "",
  date_to: "",
  actor_type: "",
  action: "",
  entity_type: "",
  entity_id: "",
  ip: "",
  request_id: "",
  severity: "",
  search: "",
});
const showDetailModal = ref(false);
const showRetentionModal = ref(false);
const selectedLog = ref(null);
const retentionDays = ref(90);

const actorTypeLabels = { user: "کاربر", lawyer: "وکیل", admin: "ادمین", system: "سیستم" };
function actorTypeLabel(t) {
  return t ? (actorTypeLabels[t] || t) : "—";
}
const severityLabels = { low: "کم", medium: "متوسط", high: "بالا" };
function severityLabel(s) {
  return s ? (severityLabels[s] || s) : "کم";
}
function severityClass(s) {
  if (s === "high") return "text-red-600";
  if (s === "medium") return "text-amber-600";
  return "text-gray-600";
}

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("fa-IR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

const buildQuery = () => {
  const q = { page: currentPage.value, per_page: perPage };
  Object.entries(filters.value).forEach(([k, v]) => { if (v) q[k] = v; });
  return q;
};

async function fetchData(page = 1) {
  currentPage.value = page;
  pending.value = true;
  try {
    const res = await useGet({ url: "admin/logs/audit", includeAuthHeader: true, query: buildQuery() });
    const payload = res.data?.data ?? res.data;
    data.value = payload?.data ?? [];
    const meta = payload?.meta ?? {};
    total.value = meta.total ?? 0;
    totalPages.value = meta.last_page ?? 1;
  } catch (e) {
    useToast().add({ title: "خطا در دریافت لاگ‌ها", color: "error" });
  } finally {
    pending.value = false;
  }
}

function applyFilters() {
  fetchData(1);
}

function openDetail(row) {
  selectedLog.value = row;
  showDetailModal.value = true;
}

async function exportCsv() {
  try {
    const config = useRuntimeConfig();
    const jwtToken = useCookie("jwtToken");
    const url = new URL(config.public.apiEndpoint + "admin/logs/audit/export");
    Object.entries(buildQuery()).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await $fetch(url.toString(), {
      headers: { Authorization: `Bearer ${jwtToken.value}`, "X-Request-Id": useRequestId() },
    });
    const blob = new Blob([typeof res === "string" ? res : JSON.stringify(res)], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    useToast().add({ title: "خروجی دریافت شد", color: "success" });
  } catch (e) {
    useToast().add({ title: "خطا در خروجی CSV", color: "error" });
  }
}

async function runRetention() {
  try {
    const res = await useDelete({
      url: "admin/logs/audit/retention",
      includeAuthHeader: true,
      query: { older_than_days: retentionDays.value },
    });
    if (res.status) {
      useToast().add({ title: `حذف انجام شد (${res.data?.data?.deleted ?? 0} رکورد)`, color: "success" });
      showRetentionModal.value = false;
      fetchData(currentPage.value);
    }
  } catch (e) {
    useToast().add({ title: "خطا در حذف", color: "error" });
  }
}

await fetchData(1);
watch(currentPage, (p) => { if (p > 0) fetchData(p); });
</script>
