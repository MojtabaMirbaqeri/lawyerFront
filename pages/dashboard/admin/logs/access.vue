<template>
  <div class="logs-page">
    <div class="page-header mb-4">
      <h1 class="page-title">لاگ دسترسی</h1>
      <p class="page-description">بازدید و دسترسی به منابع (مثل پروفایل وکلا)</p>
      <div class="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900">
        <span class="font-medium text-amber-800">این صفحه نمایش می‌دهد:</span>
        زمان دسترسی، نقش بازدیدکننده (مهمان، کاربر، وکیل، ادمین)، نوع و شناسه منبع (مثلاً پروفایل وکیل)، نوع رویداد (بازدید پروفایل، مشاهده شماره)، آدرس IP، و در جزئیات: شناسه درخواست و ارجاع‌دهنده.
      </div>
      <div class="flex gap-2 mt-2">
        <a v-if="canExportLogs" href="#" class="btn-secondary inline-flex items-center gap-2" @click.prevent="exportCsv">
          <Icon name="lucide:download" class="w-4 h-4" />
          خروجی CSV
        </a>
        <button v-if="canManageRetention" type="button" class="btn-secondary inline-flex items-center gap-2" @click="showRetentionModal = true">
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
          <input v-model="filters.resource_type" type="text" placeholder="نوع منبع" class="rounded-lg border border-gray-200 px-3 py-2 text-sm w-36" />
          <input v-model="filters.resource_id" type="text" placeholder="شناسه منبع" class="rounded-lg border border-gray-200 px-3 py-2 text-sm w-28" />
          <input v-model="filters.event" type="text" placeholder="رویداد" class="rounded-lg border border-gray-200 px-3 py-2 text-sm w-32" />
          <input v-model="filters.user_id" type="text" placeholder="شناسه کاربر" class="rounded-lg border border-gray-200 px-3 py-2 text-sm w-28" />
          <input v-model="filters.request_id" type="text" placeholder="شناسه درخواست" class="rounded-lg border border-gray-200 px-3 py-2 text-sm w-44" />
          <button class="btn-primary" @click="applyFilters">
            <Icon name="lucide:search" class="w-4 h-4" />
            اعمال فیلتر
          </button>
        </div>
      </div>
    </div>

    <div class="card-dashboard relative">
      <div v-if="pending" class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80 min-h-[200px]">
        <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-gray-500" />
      </div>
      <div v-show="!pending" class="overflow-x-auto">
        <table class="table-dashboard">
          <thead>
            <tr>
              <th>زمان</th>
              <th>نقش</th>
              <th>منبع</th>
              <th>رویداد</th>
              <th>IP</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in data" :key="row.id">
              <td class="text-sm text-gray-600">{{ formatDate(row.created_at) }}</td>
              <td>{{ actorTypeLabel(row.actor_type) }}</td>
              <td>{{ resourceTypeLabel(row.resource_type) }} #{{ row.resource_id }}</td>
              <td>{{ eventLabel(row.event) }}</td>
              <td class="font-mono text-sm">{{ row.ip || "—" }}</td>
              <td><button type="button" class="text-primary-600 text-sm" @click="openDetail(row)">جزئیات</button></td>
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

    <UModal v-model:open="showDetailModal" title="جزئیات لاگ دسترسی">
      <template #body>
        <div v-if="selectedLog" class="space-y-3 text-sm">
          <p><span class="font-medium">شناسه درخواست:</span> <code class="bg-gray-100 px-1 rounded">{{ selectedLog.request_id || "—" }}</code></p>
          <p><span class="font-medium">ارجاع‌دهنده:</span> <span class="text-xs break-all">{{ selectedLog.referrer || "—" }}</span></p>
          <pre v-if="selectedLog.metadata && Object.keys(selectedLog.metadata).length" class="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">{{ JSON.stringify(selectedLog.metadata, null, 2) }}</pre>
        </div>
      </template>
    </UModal>

    <UModal v-model:open="showRetentionModal" title="حذف بر اساس نگهداری">
      <template #body>
        <p class="text-sm text-gray-600 mb-3">رکوردهای قدیمی‌تر از تعداد روز مشخص حذف می‌شوند (۳۰ تا ۳۶۵ روز).</p>
        <input v-model.number="retentionDays" type="number" min="30" max="365" class="rounded-lg border border-gray-200 px-3 py-2 w-full" />
        <div class="flex gap-2 mt-4">
          <button class="btn-primary" :disabled="retentionDays < 30 || retentionDays > 365" @click="runRetention">تایید و حذف</button>
          <button class="btn-secondary" @click="showRetentionModal = false">انصراف</button>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup>
useHead({ title: "لاگ دسترسی | وکیل وکیل" });
const { canExportLogs, canManageRetention } = usePermissions();

const data = ref([]);
const pending = ref(true);
const total = ref(0);
const totalPages = ref(1);
const currentPage = ref(1);
const perPage = 15;
const filters = ref({ date_from: "", date_to: "", resource_type: "", resource_id: "", event: "", user_id: "", request_id: "" });
const showDetailModal = ref(false);
const showRetentionModal = ref(false);
const selectedLog = ref(null);
const retentionDays = ref(90);

const actorTypeLabels = { guest: "مهمان", user: "کاربر", lawyer: "وکیل", admin: "ادمین" };
function actorTypeLabel(t) {
  return t ? (actorTypeLabels[t] || t) : "—";
}
const eventLabels = { profile_view: "بازدید پروفایل", phone_reveal: "مشاهده شماره" };
function eventLabel(e) {
  return e ? (eventLabels[e] || e) : "—";
}
const resourceTypeLabels = { LawyerProfile: "پروفایل وکیل" };
function resourceTypeLabel(r) {
  return r ? (resourceTypeLabels[r] || r) : "—";
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
    const res = await useGet({ url: "admin/logs/access", includeAuthHeader: true, query: buildQuery() });
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
    const url = new URL(config.public.apiEndpoint + "admin/logs/access/export");
    Object.entries(buildQuery()).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await $fetch(url.toString(), { headers: { Authorization: `Bearer ${jwtToken.value}`, "X-Request-Id": useRequestId() } });
    const blob = new Blob([typeof res === "string" ? res : JSON.stringify(res)], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `access-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    useToast().add({ title: "خروجی دریافت شد", color: "success" });
  } catch (e) {
    useToast().add({ title: "خطا در خروجی CSV", color: "error" });
  }
}

async function runRetention() {
  try {
    const res = await useDelete({ url: "admin/logs/access/retention", includeAuthHeader: true, query: { older_than_days: retentionDays.value } });
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
