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
const UPopover = resolveComponent("UPopover"); // <--- استفاده از UPopover

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

await fetchReviews(page.value, true);

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

const MAX_VISIBLE = 20; // تعداد کاراکتر قابل نمایش قبل از سه نقطه

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
    // سلول دیدگاه: کوتاه‌شده + UPopover برای نمایش کامل هنگام هاور
    cell: ({ row }) => {
      const full = row.original.comment || "";
      const truncated =
        full.length > MAX_VISIBLE ? full.slice(0, MAX_VISIBLE) + "…" : full;

      // UPopover: default slot = trigger, #content slot = محتوای پاپ‌اور
      return h(
        UPopover,
        {
          mode: "hover",
          openDelay: 150,
          closeDelay: 100,
          content: { side: "top", sideOffset: 8 },
        },
        {
          default: () =>
            h(
              "span",
              {
                class: "cursor-pointer select-none inline-block max-w-[20ch] truncate",
                
              },
              truncated
            ),
          content: () =>
            h(
              "div",
              { class: "max-w-xs p-2 text-sm leading-relaxed break-words" },
              full || "-"
            ),
        }
      );
    },
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
        return h("div", { class: "gap-4 flex items-center justify-center" }, [
          h("button", {
            innerHTML: "تایید",
            class: "text-green-500 w-10 border rounded-lg py-0.5",
            onClick: () => acceptHandle(row.original.id),
          }),
          h("button", {
            innerHTML: "رد",
            class: "text-red-500 w-10 border rounded-lg py-0.5",
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
