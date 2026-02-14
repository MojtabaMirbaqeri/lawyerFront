<template>
  <div class="profile-views-logs-page">
    <div class="page-header">
      <div class="mb-4">
        <h1 class="page-title">لاگ بازدید پروفایل وکلا</h1>
        <p class="page-description">جزئیات تمام بازدیدها با فیلتر وکیل، کاربر، نوع رویداد و بازه تاریخ</p>
      </div>
      <NuxtLink to="/dashboard/admin/profile-views" class="btn-secondary">
        <Icon name="lucide:bar-chart-2" class="w-4 h-4" />
        <span>خلاصه آمار</span>
      </NuxtLink>
    </div>

    <div class="card-dashboard">
      <div class="card-dashboard-body py-4!">
        <div class="action-bar flex flex-wrap gap-3">
          <div class="search-box w-48">
            <Icon name="lucide:hash" class="icon" />
            <input
              v-model="filters.lawyer_id"
              type="text"
              placeholder="شناسه وکیل"
              class="w-full"
            />
          </div>
          <div class="search-box w-48">
            <Icon name="lucide:user" class="icon" />
            <input
              v-model="filters.user_id"
              type="text"
              placeholder="شناسه کاربر"
              class="w-full"
            />
          </div>
          <select
            v-model="filters.event_type"
            class="rounded-lg border border-gray-200 px-3 py-2 text-sm w-44"
          >
            <option value="">همه رویدادها</option>
            <option value="profile_view">بازدید پروفایل</option>
            <option value="phone_reveal">مشاهده شماره تلفن</option>
          </select>
          <input
            v-model="filters.date_from"
            type="date"
            class="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            placeholder="از تاریخ"
          />
          <input
            v-model="filters.date_to"
            type="date"
            class="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            placeholder="تا تاریخ"
          />
          <button class="btn-primary" @click="applyFilters">
            <Icon name="lucide:search" class="w-4 h-4" />
            اعمال فیلتر
          </button>
        </div>
      </div>
    </div>

    <div class="card-dashboard relative">
      <div
        v-if="pending"
        class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80 min-h-[200px]"
      >
        <div class="flex flex-col items-center gap-3">
          <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-gray-500" />
          <p class="text-sm text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
      <div v-show="!pending" class="overflow-x-auto">
        <table class="table-dashboard">
          <thead>
            <tr>
              <th>وکیل</th>
              <th>نوع رویداد</th>
              <th>کاربر</th>
              <th>IP</th>
              <th>زمان</th>
              <th class="max-w-[200px]">User-Agent</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in data" :key="row.id">
              <td>
                <span class="font-medium text-gray-900">{{ row.lawyer_name }}</span>
                <span class="text-gray-400 text-sm mr-1">#{{ row.lawyer_id }}</span>
              </td>
              <td>
                <span v-if="row.event_type === 'phone_reveal'" class="badge badge-info">مشاهده شماره</span>
                <span v-else class="text-gray-600 text-sm">بازدید پروفایل</span>
              </td>
              <td>
                <template v-if="row.user">
                  {{ [row.user.name, row.user.family].filter(Boolean).join(" ") || "—" }}
                  <span class="text-gray-500 text-sm">({{ row.user.phone || row.user.email || "—" }})</span>
                </template>
                <span v-else class="text-gray-500">مهمان</span>
              </td>
              <td class="font-mono text-sm">{{ row.ip || "—" }}</td>
              <td class="text-sm text-gray-600">{{ formatDate(row.viewed_at) }}</td>
              <td class="max-w-[200px] truncate text-xs text-gray-500" :title="row.user_agent">
                {{ row.user_agent || "—" }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="!pending && total > 0"
        class="flex items-center justify-between p-4 border-t border-gray-100"
      >
        <span class="text-sm text-gray-500">
          صفحه {{ currentPage }} از {{ totalPages }} ({{ total }} رکورد)
        </span>
        <UPagination
          :page="currentPage"
          :items-per-page="perPage"
          :total="total"
          :sibling-count="1"
          :ui="{
            list: 'gap-1',
            item: 'min-w-8 h-8 text-sm',
            first: 'hidden',
            last: 'hidden',
            prev: 'scale-x-[-1]',
            next: 'scale-x-[-1]',
          }"
          @update:page="currentPage = $event"
        />
      </div>
      <div v-if="data.length === 0 && !pending" class="empty-state py-16">
        <div class="empty-state-icon">
          <Icon name="lucide:inbox" class="w-8 h-8" />
        </div>
        <h4 class="empty-state-title">بازدیدی یافت نشد</h4>
        <p class="empty-state-description">با تغییر فیلترها دوباره جستجو کنید.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

useHead({
  title: "لاگ بازدید پروفایل وکلا | وکیل وکیل",
});

const route = useRoute();
const data = ref([]);
const pending = ref(true);
const total = ref(0);
const totalPages = ref(1);
const currentPage = ref(1);
const perPage = 15;

const filters = ref({
  lawyer_id: route.query.lawyer_id ?? "",
  user_id: "",
  event_type: "",
  date_from: "",
  date_to: "",
});

const applyFilters = () => {
  currentPage.value = 1;
  fetchData(1);
};

const fetchData = async (page = 1) => {
  pending.value = true;
  try {
    const query = {
      page,
      per_page: perPage,
      ...(filters.value.lawyer_id ? { lawyer_id: filters.value.lawyer_id } : {}),
      ...(filters.value.user_id ? { user_id: filters.value.user_id } : {}),
      ...(filters.value.event_type ? { event_type: filters.value.event_type } : {}),
      ...(filters.value.date_from ? { date_from: filters.value.date_from } : {}),
      ...(filters.value.date_to ? { date_to: filters.value.date_to } : {}),
    };
    const res = await useGet({
      url: "admin/profile-views",
      includeAuthHeader: true,
      query,
    });
    data.value = res.data?.data ?? [];
    const m = res.data?.meta ?? {};
    total.value = m.total ?? 0;
    totalPages.value = m.last_page ?? 1;
  } catch (e) {
    useToast().add({ title: "خطا در دریافت لاگ‌ها", color: "error" });
  } finally {
    pending.value = false;
  }
};

const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

await fetchData(1);

watch(currentPage, (p) => {
  if (p > 0) fetchData(p);
});
</script>

<style scoped>
.profile-views-logs-page {
  padding: 1rem 0;
}
</style>
