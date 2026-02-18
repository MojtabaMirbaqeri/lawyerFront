<template>
  <section>
    <div class="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div>
        <span class="text-sm text-gray-500">کل بازدید پروفایل</span>
        <p class="text-xl font-bold text-gray-900">{{ profileViewsTotal }}</p>
      </div>
      <div>
        <span class="text-sm text-gray-500">بازدیدکننده یکتا</span>
        <p class="text-xl font-bold text-gray-900">{{ profileViewsUniqueUsers }}</p>
      </div>
      <NuxtLink
        :to="`/dashboard/admin/profile-views/logs?lawyer_id=${lawyerId}`"
        class="btn-secondary mt-2"
      >
        <Icon name="lucide:list" class="w-4 h-4" />
        مشاهده همه لاگ‌ها
      </NuxtLink>
    </div>

    <div class="ds-table-con">
      <div class="overflow-x-auto rounded-lg border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-right text-xs font-medium text-gray-500">نوع</th>
              <th class="px-4 py-2 text-right text-xs font-medium text-gray-500">کاربر</th>
              <th class="px-4 py-2 text-right text-xs font-medium text-gray-500">IP</th>
              <th class="px-4 py-2 text-right text-xs font-medium text-gray-500">زمان بازدید</th>
              <th class="px-4 py-2 text-right text-xs font-medium text-gray-500">User-Agent</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="row in views" :key="row.id" class="text-sm">
              <td class="px-4 py-2">
                <span v-if="row.event_type === 'phone_reveal'" class="text-amber-600 font-medium">مشاهده شماره</span>
                <span v-else class="text-gray-500">بازدید پروفایل</span>
              </td>
              <td class="px-4 py-2">
                <template v-if="row.user">
                  {{ [row.user.name, row.user.family].filter(Boolean).join(" ") || "—" }}
                  <span class="text-gray-500">({{ row.user.phone || row.user.email || "—" }})</span>
                </template>
                <span v-else class="text-gray-500">مهمان</span>
              </td>
              <td class="px-4 py-2 font-mono text-gray-600">{{ row.ip || "—" }}</td>
              <td class="px-4 py-2 text-gray-600">{{ formatDate(row.viewed_at) }}</td>
              <td class="max-w-[200px] truncate px-4 py-2 text-gray-500" :title="row.user_agent">
                {{ row.user_agent || "—" }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="viewsTotal > 0"
        class="flex items-center justify-between border-t border-gray-200 px-4 py-3"
      >
        <span class="text-sm text-gray-500">
          صفحه {{ page }} از {{ lastPage }} ({{ viewsTotal }} رکورد)
        </span>
        <UPagination
          :page="page"
          :items-per-page="perPage"
          :total="viewsTotal"
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
      <div v-if="views.length === 0 && !pending" class="py-12 text-center text-gray-500">
        هنوز بازدیدی برای این وکیل ثبت نشده است.
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  lawyerId: { type: [String, Number], required: true },
  profileViewsTotal: { type: Number, default: 0 },
  profileViewsUniqueUsers: { type: Number, default: 0 },
});

const views = ref([]);
const pending = ref(false);
const viewsTotal = ref(0);
const lastPage = ref(1);
const page = ref(1);
const perPage = 10;

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

const fetchViews = async (p = 1) => {
  pending.value = true;
  try {
    const res = await useGet({
      url: `admin/lawyers/${props.lawyerId}/profile-views`,
      includeAuthHeader: true,
      query: { page: p, per_page: perPage },
    });
    views.value = res.data?.data ?? [];
    const m = res.data?.meta ?? {};
    viewsTotal.value = m.total ?? 0;
    lastPage.value = m.last_page ?? 1;
  } catch (e) {
    useToast().add({ title: "خطا در دریافت بازدیدها", color: "error" });
  } finally {
    pending.value = false;
  }
};

await fetchViews(1);

watch(page, (p) => {
  fetchViews(p);
});
watch(() => props.lawyerId, () => {
  page.value = 1;
  fetchViews(1);
});
</script>
