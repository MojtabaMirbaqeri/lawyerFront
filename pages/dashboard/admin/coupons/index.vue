<template>
  <div class="ds-table-con">
    <UICDataTable :columns="columns" :data="couponsRes?.data" />
  </div>
</template>
<script setup>
import { h, resolveComponent } from "vue";
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const columns = [
  {
    accessorKey: "id",
    header: "شماره کپن",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "code",
    header: "کد تخفیف",
  },
  {
    accessorKey: "type",
    header: "نوع کپن",
    cell: ({ row }) => (row.getValue("type") == "amount" ? "مقداری" : "درصدی"),
  },
  {
    accessorKey: "value",
    header: "مقدار",
    cell: ({ row }) => {
      if (row.getValue("type") == "amount") {
        return row.getValue("value").toLocaleString() + " تومان";
      } else {
        return row.getValue("value") + "%";
      }
    },
  },
  {
    accessorKey: "type",
    header: "نوع کپن",
    cell: ({ row }) => (row.getValue("type") == "amount" ? "مقداری" : "درصدی"),
  },
  {
    accessorKey: "is_active",
    header: "وضعیت",
  },
  {
    accessorKey: "usage_limit",
    header: "محدودیت استفاده",
  },
  {
    accessorKey: "used_count",
    header: "تعداد استفاده",
  },
  {
    accessorKey: "expires_at",
    header: "تاریخ انقضا",
    cell: ({ row }) => {
      const date = new Date(row.getValue("expires_at"));
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-right" },
        h(
          UDropdownMenu,
          {
            content: {
              align: "end",
            },

            items: getRowItems(row),
            "aria-label": "Actions dropdown",
          },
          () =>
            h(UButton, {
              icon: "i-lucide-ellipsis-vertical",
              color: "neutral",
              variant: "ghost",
              class: "ml-auto",
              "aria-label": "Actions dropdown",
            })
        )
      );
    },
  },
];

function getRowItems(row) {
  return [
    {
      type: "label",
      label: "فعالیت ها",
    },
    {
      label: "ویرایش کپن",
      onSelect() {
        navigateTo(`/dashboard/admin/coupons/edit/${row.original.id}`);
      },
      icon: "solar:pen-outline",
    },
    {
      type: "separator",
    },
    {
      label: "حذف",
      icon: "solar:trash-bin-minimalistic-outline",
      async onSelect() {
        const res = await useDelete({
          url: `coupons/${row.original.id}`,
          includeAuthHeader: true,
        });
        if (res.statusCode == 200) {
          couponsRes.value.data = await couponsRes.value.refresh();
          console.log(couponsRes.value);
          useToast().add({
            title: "کد تخفیف با موفقیت حذف شد.",
            color: "success",
          });
        }
      },
    },
  ];
}

const couponsRes = ref(
  await useGet({
    url: "coupons",
    includeAuthHeader: true,
  })
);
</script>