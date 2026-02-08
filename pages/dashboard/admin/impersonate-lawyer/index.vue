<template>
  <div class="ds-table-con">
    <h1 class="text-lg font-semibold mb-4">ورود به پنل وکیل</h1>
    <p class="text-gray-600 mb-4">
      با انتخاب یک وکیل می‌توانید به‌عنوان ادمین به پنل آن وکیل وارد شوید و همان دسترسی‌ها را داشته باشید.
    </p>
    <div class="flex justify-between mb-4">
      <UInput
        v-model="globalFilter"
        class="max-w-[250px] w-full"
        placeholder="جستجو (نام، تلفن)..."
        icon="solar:magnifer-linear"
        @keyup.enter="searchLawyer"
      />
      <UICSecondaryBtn class="rounded-[8px]!" @click="searchLawyer">
        جستجو
      </UICSecondaryBtn>
    </div>
    <div v-if="pending" class="flex justify-center py-8">
      <UIcon name="svg-spinners:90-ring-with-bg" class="size-8 text-primary" />
    </div>
    <template v-else>
      <UTable
        :data="tableData"
        :columns="columns"
        class="flex-1"
        :ui="{
          root: 'rounded-[7px] border border-gray-200 overflow-y-hidden',
          thead: 'bg-primary',
          th: 'text-white whitespace-nowrap',
        }"
      />
      <div class="flex justify-center py-4">
        <UPagination
          v-model:page="pagination.pageIndex"
          :items-per-page="pagination.pageSize"
          :total="pagination.total"
          show-edges
          :sibling-count="0"
          :ui="{
            first: 'hidden',
            prev: 'scale-x-[-1]',
            next: 'scale-x-[-1]',
            last: 'hidden',
          }"
          @update:page="(p) => (pagination.pageIndex = p)"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { h, resolveComponent } from "vue";

const UButton = resolveComponent("UButton");
const authStore = useAuthStore();

const globalFilter = ref("");
const pending = ref(true);
const listData = ref([]);
const pagination = ref({
  pageIndex: 1,
  pageSize: 15,
  total: 0,
});

async function fetchLawyers(page = 1) {
  pending.value = true;
  try {
    const query = { per_page: 15, page };
    if (globalFilter.value?.trim()) query.search = globalFilter.value.trim();
    const res = await useGet({
      url: "admin/lawyers/metrics",
      includeAuthHeader: true,
      query,
    });
    const raw = res.data?.data ?? [];
    listData.value = (Array.isArray(raw) ? raw : []).map((law) => ({
      id: law.id,
      fullName: [law.name, law.family].filter(Boolean).join(" ") || "—",
      phone: law.phone || "—",
      base: law.base || "—",
      city: law.city || "—",
      is_active: law.is_active,
    }));
    const meta = res.data?.meta;
    if (meta?.total != null) pagination.value.total = meta.total;
  } finally {
    pending.value = false;
  }
}

await fetchLawyers(1);

const tableData = computed(() => listData.value);

watch(
  () => pagination.value.pageIndex,
  (page) => {
    fetchLawyers(page);
  }
);

const columns = [
  { accessorKey: "id", header: "شناسه", cell: ({ row }) => `#${row.original.id}` },
  { accessorKey: "fullName", header: "نام و نام خانوادگی" },
  { accessorKey: "phone", header: "تلفن" },
  { accessorKey: "base", header: "پایه" },
  { accessorKey: "city", header: "شهر" },
  {
    accessorKey: "is_active",
    header: "وضعیت",
    cell: ({ row }) => (row.original.is_active ? "فعال" : "غیرفعال"),
  },
  {
    id: "actions",
    header: "عملیات",
    cell: ({ row }) => {
      return h(
        UButton,
        {
          color: "primary",
          variant: "soft",
          size: "sm",
          loading: authStore.loading,
          onClick: async () => {
            const { ok } = await authStore.impersonateLawyer(row.original.id);
            if (ok && import.meta.client) {
              await navigateTo("/dashboard/lawyer");
            }
          },
        },
        () => "ورود به پنل"
      );
    },
  },
];

const searchLawyer = () => {
  pagination.value.pageIndex = 1;
  fetchLawyers(1);
};

useHead({
  title: "ورود به پنل وکیل | وکیل وکیل",
});
</script>
