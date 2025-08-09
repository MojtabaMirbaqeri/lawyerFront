<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import { getPaginationRowModel } from "@tanstack/vue-table";

const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const table = useTemplateRef("table");

const lawyersRef = ref((await useGet({ url: "lawyers" })).data);

type Payment = {
  id: string;
  national_code: string;
  fullName: string;
  phone: string;
  base: string;
  edit_id: number;
  is_active: boolean;
};

const data = ref(
  lawyersRef.value.data.map((law) => {
    return {
      id: law.lawyer_info.id,
      national_code: law.lawyer_info.national_code,
      phone: law.phone,
      fullName: `${law.lawyer_info.name} ${law.lawyer_info.family}`,
      base: law.lawyer_info.base_lawyer.title,
      edit_id: law.id,
      is_active: law.is_active,
    };
  })
);

const columns: TableColumn<Payment>[] = [
  {
    accessorKey: "id",
    header: "شماره کاربر",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "national_code",
    header: "کدملی",
  },
  {
    accessorKey: "phone",
    header: "تلفن",
  },
  {
    accessorKey: "fullName",
    header: "نام نام خانوادگی",
  },
  {
    accessorKey: "base",
    header: "پایه",
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

function getRowItems(row: Row<Payment>) {
  return [
    {
      type: "label",
      label: "Actions",
    },
    {
      label: "ویرایش وکیل",
      onSelect() {
        navigateTo(`/dashboard/admin/lawyerlist/edit/${row.original.edit_id}`);
      },
      icon: "solar:pen-outline",
    },
    {
      type: "separator",
    },
    {
      label: row.original.is_active ? "غیر فعال کردن" : "فعال کردن",
      icon: "material-symbols-light:lock",
      async onSelect() {
        const res = await usePatch({
          url: `lawyers/${row.original.edit_id}/toggle-active`,
          includeAuthHeader: true,
          body: undefined,
        });
        console.log(res);
        const lawyersRef = ref((await useGet({ url: "lawyers" })).data);
        data.value = lawyersRef.value.data.map((law) => {
          return {
            id: law.lawyer_info.id,
            national_code: law.lawyer_info.national_code,
            phone: law.phone,
            fullName: `${law.lawyer_info.name} ${law.lawyer_info.family}`,
            base: law.lawyer_info.base_lawyer.title,
            edit_id: law.id,
            is_active: law.is_active,
          };
        });
      },
    },
  ];
}

const globalFilter = ref("");

const pagination = ref({
  pageIndex: 3,
  pageSize: 10,
  total: lawyersRef.value.meta.total,
});

watch(
  () => pagination.value.pageIndex,
  async (page) => {
    const lawyersRef = ref(
      (await useGet({ url: "lawyers", query: { page: page } })).data
    );
    data.value = lawyersRef.value.data.map((law) => {
      return {
        id: law.lawyer_info.id,
        national_code: law.lawyer_info.national_code,
        phone: law.phone,
        fullName: `${law.lawyer_info.name} ${law.lawyer_info.family}`,
        base: law.lawyer_info.base_lawyer.title,
        edit_id: law.id,
        is_active: law.is_active,
      };
    });
  }
);

const searchLawyer = () => {
  if (globalFilter.value === "") {
    console.log("null");

    return;
  } else {
    console.log(globalFilter.value);
  }
};
</script>

<template>
  <div class="bg-white px-4 rounded-[8px]">
    <div class="flex justify-between py-3.5">
      <UInput
        @change="searchLawyer"
        v-model="globalFilter"
        class="max-w-[250px] w-full"
        placeholder="فیلتر..."
        icon="solar:magnifer-linear"
      />

      <UICSecondaryBtn
        @click="navigateTo('/dashboard/admin/lawyerlist/add')"
        class="rounded-[8px]!"
      >
        <span>ایجاد وکیل</span>
      </UICSecondaryBtn>
    </div>
    <UTable
      :data="data"
      :columns="columns"
      class="flex-1"
      :ui="{ root: 'rounded-[7px]', thead: 'bg-primary', th: 'text-white' }"
    />

    <div class="flex justify-center border-t border-default py-4">
      <UPagination
        v-model="pagination.pageIndex"
        :items-per-page="pagination.pageSize"
        :total="pagination.total"
        :ui="{
          first: 'hidden',
          prev: 'scale-x-[-1]',
          next: 'scale-x-[-1]',
          last: 'hidden',
        }"
        @update:page="(p) => (pagination.pageIndex = p)"
      />
    </div>
  </div>
</template>