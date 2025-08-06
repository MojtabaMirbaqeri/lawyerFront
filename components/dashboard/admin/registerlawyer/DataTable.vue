<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import { getPaginationRowModel } from "@tanstack/vue-table";

const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const table = useTemplateRef("table");

const lawyersRef = ref((await useGet({ url: "register-lawyer-list" })).data);

type Payment = {
  id: string;
  national_code: string;
  fullName: string;
  phone: string;
  edit_id: number;
  is_active: boolean;
  status: "pending" | "approved" | "reject";
  license: string;
  nationalCardImage: string;
  licenseImage: string;
};

const data = ref(
  lawyersRef.value.data.map((law) => {
    return {
      id: law.user_id,
      national_code: law.national_code,
      phone: law.user?.phone,
      fullName: `${law.user?.name} ${law.user?.family}`,
      edit_id: law.id,
      license: law.license_number,
      status: law.status,
      nationalCardImage: law.national_card_image,
      licenseImage: law.license_image,
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
    accessorKey: "license",
    header: "شماره پروانه",
  },
  {
    accessorKey: "nationalCardImage",
    header: "عکس کارت ملی",
  },
  {
    accessorKey: "licenseImage",
    header: "عکس پروانه وکیل",
  },
  {
    accessorKey: "fullName",
    header: "نام نام خانوادگی",
  },
  {
    accessorKey: "status",
    header: "وضعیت",
  },
];
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
      (await useGet({ url: "register-lawyer-list", query: { page: page } }))
        .data
    );
    data.value = lawyersRef.value.data.map((law) => {
      return {
        id: law.user_id,
        national_code: law.national_code,
        phone: law.user?.phone,
        fullName: `${law.user?.name} ${law.user?.family}`,
        edit_id: law.id,
        license: law.license_number,
        status: law.status,
        nationalCardImage: law.national_card_image,
        licenseImage: law.license_image,
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
        v-model="globalFilter"
        class="max-w-[250px] w-full"
        placeholder="فیلتر..."
        icon="solar:magnifer-linear"
        @change="searchLawyer"
      />
    </div>
    <UTable
      :data="data"
      :columns="columns"
      class="flex-1"
      :ui="{
        root: 'rounded-[7px]',
        thead: 'bg-primary',
        th: 'text-white text-center!',
        td: 'text-center',
      }"
    >
      <template #status-cell="{ row }">
        <div
          :class="{ 'text-primary!': row.original.status === 'approved' }"
          class="text-red-500"
          v-if="row.original.status != 'pending'"
        >
          {{ row.original.status === "approved" ? "تایید شده" : "تایید نشده" }}
        </div>
        <div v-else class="">
            <UIcon
            name="solar:close-circle-linear"
            class="size-6! text-red-500"
            />
            <UIcon
              name="solar:check-circle-linear"
              class="size-6! text-green-500"
            />
        </div>
      </template>
      <template #licenseImage-cell="{ row }">
        <UICPictureModal
          title="عکس پروانه وکیل"
          :image="row.original.licenseImage"
        />
      </template>
      <template #nationalCardImage-cell="{ row }">
        <UICPictureModal
          title="عکس پروانه وکیل"
          :image="row.original.licenseImage"
        />
      </template>
    </UTable>

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