<template>
  <div class="profile-views-page">
    <div class="page-header">
      <div class="mb-4">
        <h1 class="page-title">آمار بازدید پروفایل وکلا</h1>
        <p class="page-description">خلاصه تعداد بازدید و بازدیدکننده یکتا برای هر وکیل</p>
      </div>
      <NuxtLink to="/dashboard/admin/profile-views/logs" class="btn-secondary">
        <Icon name="lucide:list" class="w-4 h-4" />
        <span>همه لاگ‌های بازدید</span>
      </NuxtLink>
    </div>

    <div class="card-dashboard">
      <div class="card-dashboard-body py-4!">
        <div class="action-bar">
          <div class="action-bar-start">
            <div class="search-box w-72">
              <Icon name="lucide:search" class="icon" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="جستجوی نام وکیل..."
                class="w-full"
              />
            </div>
            <UICSelect
              v-model="sortBy"
              :items="sortOptions"
              placeholder="مرتب‌سازی"
              class="w-44!"
            />
            <button
              type="button"
              class="btn-secondary"
              @click="applyFilters"
            >
              <Icon name="lucide:filter" class="w-4 h-4" />
              <span>فیلتر</span>
            </button>
          </div>
          <span class="text-sm text-gray-500">
            نمایش {{ lawyers.length }} از {{ totalLawyers }} وکیل
          </span>
        </div>
      </div>
    </div>

    <div class="card-dashboard">
      <div class="overflow-x-auto">
        <table class="table-dashboard">
          <thead>
            <tr>
              <th>وکیل</th>
              <th class="text-center">کل بازدید</th>
              <th class="text-center">بازدیدکننده یکتا</th>
              <th class="text-center">تعداد بازدید شماره</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in lawyers" :key="row.id">
              <td>
                <span class="font-medium text-gray-900">{{ row.name }}</span>
              </td>
              <td class="text-center">
                <span class="font-medium">{{ row.profile_views_total }}</span>
              </td>
              <td class="text-center">
                <span class="font-medium">{{ row.profile_views_unique_users }}</span>
              </td>
              <td class="text-center">
                <span class="font-medium">{{ row.profile_views_phone_reveal_count }}</span>
              </td>
              <td class="text-end">
                <NuxtLink
                  :to="`/dashboard/admin/lawyerlist/edit/${row.id}`"
                  class="text-sm text-primary hover:underline ml-2"
                >
                  متریک وکیل
                </NuxtLink>
                <NuxtLink
                  :to="`/dashboard/admin/profile-views/logs?lawyer_id=${row.id}`"
                  class="text-sm text-gray-600 hover:underline"
                >
                  لاگ بازدید
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="totalLawyers > 0"
        class="flex items-center justify-between p-4 border-t border-gray-100"
      >
        <span class="text-sm text-gray-500">
          صفحه {{ page }} از {{ totalPages }}
        </span>
        <UPagination
          :page="page"
          :items-per-page="perPage"
          :total="totalLawyers"
          :sibling-count="1"
          :ui="{
            list: 'gap-1',
            item: 'min-w-8 h-8 text-sm',
            first: 'hidden',
            last: 'hidden',
            prev: 'scale-x-[-1]',
            next: 'scale-x-[-1]',
          }"
          @update:page="page = $event"
        />
      </div>
      <div v-if="lawyers.length === 0 && !pending" class="empty-state py-16">
        <div class="empty-state-icon">
          <Icon name="lucide:eye-off" class="w-8 h-8" />
        </div>
        <h4 class="empty-state-title">داده‌ای یافت نشد</h4>
        <p class="empty-state-description">هنوز بازدیدی ثبت نشده است.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

useHead({
  title: "آمار بازدید پروفایل وکلا | وکیل وکیل",
});

const page = ref(1);
const perPage = 15;
const searchQuery = ref("");
const sortBy = ref("total");
const lawyers = ref([]);
const pending = ref(true);
const meta = ref({});

const sortOptions = [
  { id: "total", label: "بیشترین کل بازدید" },
  { id: "day", label: "بیشترین بازدید روز" },
  { id: "week", label: "بیشترین بازدید هفته" },
  { id: "month", label: "بیشترین بازدید ماه" },
];

function buildQuery(pageNum) {
  const q = {
    page: pageNum,
    per_page: perPage,
    sort: sortBy.value,
  };
  const search = searchQuery.value?.trim();
  if (search) q.search = search;
  return q;
}

const fetchData = async (pageNum = 1) => {
  pending.value = true;
  try {
    const res = await useGet({
      url: "admin/lawyers/metrics",
      includeAuthHeader: true,
      query: buildQuery(pageNum),
    });
    lawyers.value = (res.data?.data ?? []).map((l) => ({
      id: l.id,
      name: [l.name, l.family].filter(Boolean).join(" ") || "—",
      profile_views_total: l.profile_views_total ?? 0,
      profile_views_unique_users: l.profile_views_unique_users ?? 0,
      profile_views_phone_reveal_count: l.profile_views_phone_reveal_count ?? 0,
    }));
    meta.value = res.data?.meta ?? {};
  } catch (e) {
    useToast().add({ title: "خطا در دریافت آمار", color: "error" });
  } finally {
    pending.value = false;
  }
};

const applyFilters = () => {
  page.value = 1;
  fetchData(1);
};

const totalLawyers = computed(() => meta.value.total ?? 0);
const totalPages = computed(() => meta.value.last_page ?? 1);

watch(page, (newPage) => {
  fetchData(newPage);
});

await fetchData(1);
</script>

<style scoped>
.profile-views-page {
  padding: 1rem 0;
}
</style>
