<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import { getPaginationRowModel } from "@tanstack/vue-table";

const refetch = async (page = undefined) => {
  const lawyersRef = ref(
    (
      await useGet({
        url: "register-lawyer-list",
        includeAuthHeader: true,
        query: page ? { page: page } : undefined,
      })
    ).data
  );
  data.value = lawyersRef.value.data.map((law) => {
    const base = filterStore.lawyerTypes.find((type) => law.base == type.id);
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
      base: base?.title,
    };
  });
};

const filterStore = useFiltersStore();
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const table = useTemplateRef("table");

const lawyersRef = ref(
  (
    await useGet({
      url: "register-lawyer-list",
      includeAuthHeader: false,
      query: undefined,
    })
  ).data
);

console.log(lawyersRef.value.data);

type Payment = {
  id: string;
  national_code: string;
  fullName: string;
  phone: string;
  edit_id: number;
  is_active: boolean;
  status: "pending" | "approved" | "reject";
  license: string;
  base: string;
  nationalCardImage: string;
  licenseImage: string;
};

const data = ref(
  lawyersRef.value.data.map((law) => {
    const base = filterStore.lawyerTypes.find((type) => law.base == type.id);

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
      base: base?.title,
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
  {
    accessorKey: "base",
    header: "پایه",
  },
];
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
      const res = await useGet({
        url: `register-lawyers/search`,
        query: { q: globalFilter.value, page: pagination.value.pageIndex },
        includeAuthHeader: false,
      });
      console.log(res.data.data);
      data.value = res.data.data.map((law) => {
        const base = filterStore.lawyerTypes.find(
          (type) => law.base == type.id
        );
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
          base: base?.title,
        };
      });
    } else {
      refetch(page);
    }
  }
);

const searchLawyer = async () => {
  if (globalFilter.value === "") {
    const lawyersRef = ref(
      (
        await useGet({
          url: "register-lawyer-list",
          includeAuthHeader: true,
          query: undefined,
        })
      ).data
    );
    data.value = lawyersRef.value.data.map((law) => {
      const base = filterStore.lawyerTypes.find((type) => law.base == type.id);
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
        base: base?.title,
      };
    });
    pagination.value.total = lawyersRef.value.meta.total;
    return;
  } else {
    const res = await useGet({
      url: `register-lawyers/search`,
      query: { q: globalFilter.value },
      includeAuthHeader: false,
    });
    console.log(res.data.data);
    data.value = res.data.data.map((law) => {
      const base = filterStore.lawyerTypes.find((type) => law.base == type.id);

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
        base: base?.title,
      };
    });

    pagination.value.total = res.data.meta.total;
    pagination.value.pageIndex = 1;
  }
};

const rejectHandle = async (com, id) => {
  const res = await usePut({
    url: `register-lawyer/${id}/reject`,
    includeAuthHeader: true,
    body: { rejection_reason: com },
  });
  // console.log(pagination.value.pageIndex);
  if (res.statusCode === 200) {
    refetch(pagination.value.pageIndex);
  }
};

const acceptHandle = async (id) => {
  const res = await usePut({
    url: `register-lawyer/${id}/approve`,
    includeAuthHeader: true,
    body: undefined,
  });
  // console.log(pagination.value.pageIndex);
  if (res.statusCode === 200) {
    refetch(pagination.value.pageIndex);
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
          <UICChooseStatusModal
            @reject="(com) => rejectHandle(com, row.original.edit_id)"
            @accept="acceptHandle(row.original.edit_id)"
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
        v-model:page="pagination.pageIndex"
        :items-per-page="pagination.pageSize"
        :total="pagination.total"
        :default-page="1"
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