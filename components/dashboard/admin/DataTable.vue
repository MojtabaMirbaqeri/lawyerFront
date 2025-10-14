<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import { getPaginationRowModel } from "@tanstack/vue-table";

const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const table = useTemplateRef("table");

const filterStore = useFiltersStore();

const refetch = async (page = null, total = false) => {
  const lawyersRef = ref(
    (
      await useGet({
        url: "lawyers",
        includeAuthHeader: false,
        query: page ? { page: page } : undefined,
      })
    ).data
  );
  data.value = lawyersRef.value.data.map((law) => {
    return {
      id: law.lawyer_info?.id,
      national_code: law.lawyer_info?.national_code,
      phone: law.phone,
      fullName: `${law.lawyer_info?.name} ${law.lawyer_info?.family}`,
      base: law.lawyer_info?.base_lawyer?.title,
      edit_id: law.id,
      is_active: law.is_active,
    };
  });

  if (total) {
    pagination.value.total = lawyersRef.value.meta.total;
    pagination.value.pageIndex = 1;
  }
};

const searchRefetch = async (query, start, page) => {
  const res = await useGet({
    url: "lawyer-search/comprehensive-search",
    includeAuthHeader: true,
    query: { page: page ? page : undefined, query: query },
  });
  const lawyers = ref(res.data.data.data.lawyers);

  data.value = lawyers.value.map((law) => {
    const base = filterStore.lawyerTypes.find((type) => law.base == type.id);
    return {
      id: law?.id,
      national_code: law?.national_code,
      phone: law.phone,
      fullName: `${law?.name} ${law?.family}`,
      base: base?.title,
      edit_id: law.id,
      is_active: law.is_active,
    };
  });

  if (start) {
    pagination.value.pageIndex = 1;
  }

  pagination.value.total = res.data.data.data.pagination.total;
};

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
      id: law.lawyer_info?.id,
      national_code: law.lawyer_info?.national_code,
      phone: law.phone,
      fullName: `${law.lawyer_info?.name} ${law.lawyer_info?.family}`,
      base: law.lawyer_info?.base_lawyer?.title,
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
      label: "فعالیت ها",
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
        refetch(pagination.value.pageIndex);
      },
    },
  ];
}

const globalFilter = ref("");

const pagination = ref({
  pageIndex: 1,
  pageSize: 10,
  total: lawyersRef.value.meta.total,
});

watch(
  () => pagination.value.pageIndex,
  async (page) => {
    if (globalFilter.value) {
      searchRefetch(globalFilter.value, false, page);
      return;
    } else {
      refetch(page);
    }
  }
);

const searchLawyer = async () => {
  if (globalFilter.value === "") {
    refetch(null, true);

    return;
  } else {
    searchRefetch(globalFilter.value, true, null);
  }
};
</script>

<template>
  <div class="ds-table-con">
    <div class="flex justify-between">
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
      :ui="{
        root: 'rounded-[7px] border border-gray-200 overflow-y-hidden',
        thead: 'bg-primary',
        th: 'text-white',
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
  </div>
</template>