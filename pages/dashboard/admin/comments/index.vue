<template>
  <section>
    <div class="ds-table-con">
      <h2 class="mb-4 text-lg font-bold">مدیریت دیدگاه‌ها</h2>

      <!-- جدول دیدگاه‌ها -->
      <UICDataTable :data="data" :columns="columns" :total="total" v-model="page" />
    </div>
  </section>
</template>

<script setup>
import { h, resolveComponent } from "vue";
const UBadge = resolveComponent("UBadge");
const UICChooseStatusModal = resolveComponent("UICChooseStatusModal");

const page = ref(1);
const data = ref([]);
const total = ref(0);

async function fetchReviews(pageNum = 1, setTotal = false) {
  const res = await useGet({
    url: "admin/reviews",
    includeAuthHeader: true,
    query: { page: pageNum },
  });

  const reviews = res.data.data;
  data.value = reviews.map((rev) => ({
    id: rev.id,
    fullname: `${rev.user?.name} ${rev.user?.family}`,
    lawyer: rev.lawyer?.full_name,
    rating: rev.rating,
    comment: rev.comment,
    status: rev.status,
    created_at: rev.created_at_formatted,
  }));

  if (setTotal) {
    total.value = res.data.meta.total;
  }
}

watch(
  () => page.value,
  (p) => {
    fetchReviews(p);
  }
);

onMounted(() => {
  fetchReviews(page.value, true);
});

// تایید دیدگاه
async function acceptHandle(id) {
  await usePost({
    url: `admin/reviews/${id}/approve`,
    includeAuthHeader: true,
  });
  fetchReviews(page.value, true);
  useToast().add({ title: `دیدگاه با شناسه ${id} تایید شد`, color: "success" });
}

// رد دیدگاه
async function rejectHandle(id) {
  await usePost({
    url: `admin/reviews/${id}/reject`,
    includeAuthHeader: true,
  });
  fetchReviews(page.value, true);
  useToast().add({ title: `دیدگاه با شناسه ${id} رد شد`, color: "success" });
}

const columns = ref([
  {
    accessorKey: "id",
    header: "شناسه",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "fullname",
    header: "کاربر",
  },
  {
    accessorKey: "lawyer",
    header: "وکیل",
  },
  {
    accessorKey: "rating",
    header: "امتیاز",
  },
  {
    accessorKey: "comment",
    header: "دیدگاه",
  },
  {
    accessorKey: "created_at",
    header: "تاریخ",
  },
  {
    accessorKey: "status",
    header: "وضعیت",
    cell: ({ row }) => {
      if (row.original.status === "pending") {
        return h("div", {class:'gap-3 flex items-center justify-center'}, [
          h("button", {
            innerHTML: "تایید",
            class: "text-green-500 mx-2",
            onClick: () => acceptHandle(row.original.id),
          }),
          h("button", {
            innerHTML: "رد",
            class: "text-red-500",
            onClick: () => rejectHandle(row.original.id),
          }),
        ]);
      }

      const statusLabel = row.original.status === "approved" ? "تایید شده" : "رد شده";
      const color = row.original.status === "approved" ? "success" : "error";

      return h(UBadge, { variant: "soft", color }, () => statusLabel);
    },
  },
]);
</script>
