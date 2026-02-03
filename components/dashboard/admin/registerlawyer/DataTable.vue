<script setup lang="ts">
const filterStore = useFiltersStore();

type RegisterLawyer = {
  id: string;
  national_code: string;
  fullName: string;
  phone: string;
  edit_id: number;
  status: "pending" | "approved" | "reject";
  license: string;
  base: string;
  nationalCardImage: string;
  licenseImage: string;
};

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
  data.value = lawyersRef.value.data.map((law: any) => {
    const base = filterStore.lawyerTypes.find((type: any) => law.base == type.id);
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

const lawyersRef = ref(
  (
    await useGet({
      url: "register-lawyer-list",
      includeAuthHeader: false,
      query: undefined,
    })
  ).data
);

const data = ref<RegisterLawyer[]>(
  lawyersRef.value.data.map((law: any) => {
    const base = filterStore.lawyerTypes.find((type: any) => law.base == type.id);

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

// تعریف ستون‌های جدول
const tableColumns = [
  { key: 'id', label: 'شماره کاربر', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'fullName', label: 'نام نام خانوادگی', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'national_code', label: 'کدملی', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'phone', label: 'تلفن', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'license', label: 'شماره پروانه', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'nationalCardImage', label: 'عکس کارت ملی', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'licenseImage', label: 'عکس پروانه وکیل', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'base', label: 'پایه', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'status', label: 'وضعیت', headerClass: 'text-center', cellClass: 'text-center' },
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
      data.value = res.data.data.map((law: any) => {
        const base = filterStore.lawyerTypes.find((type: any) => law.base == type.id);
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
    data.value = lawyersRef.value.data.map((law: any) => {
      const base = filterStore.lawyerTypes.find((type: any) => law.base == type.id);
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
    data.value = res.data.data.map((law: any) => {
      const base = filterStore.lawyerTypes.find((type: any) => law.base == type.id);

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

const rejectHandle = async (com: string, id: number) => {
  const res = await usePut({
    url: `register-lawyer/${id}/reject`,
    includeAuthHeader: true,
    body: { rejection_reason: com },
  });
  if (res.statusCode === 200) {
    refetch(pagination.value.pageIndex);
    useToast().add({ title: "احراز هویت وکیل رد شد", color: "success" });
  } else if (res.statusCode === 500) {
    useToast().add({ title: "مشکلی رخ داده است", color: "error" });
  }
};

const acceptHandle = async (id: number) => {
  const res = await usePut({
    url: `register-lawyer/${id}/approve`,
    includeAuthHeader: true,
    body: undefined,
  });
  if (res.statusCode === 200) {
    refetch(pagination.value.pageIndex);
    useToast().add({ title: "احراز هویت وکیل تایید شد", color: "success" });
  } else if (res.statusCode === 500) {
    useToast().add({ title: "مشکلی رخ داده است", color: "error" });
  }
};
</script>

<template>
  <div class="register-lawyer-table">
    <!-- Search Bar -->
    <div class="flex justify-between mb-4">
      <UInput
        v-model="globalFilter"
        class="max-w-[250px] w-full"
        placeholder="فیلتر..."
        icon="solar:magnifer-linear"
        @change="searchLawyer"
      />
    </div>

    <!-- Table -->
    <dashboard-admin-generic-table
      :data="data"
      :columns="tableColumns"
      :current-page="pagination.pageIndex"
      :total-items="pagination.total"
      :items-per-page="pagination.pageSize"
      row-key="edit_id"
      empty-title="درخواست ثبت وکیلی یافت نشد"
      empty-message="هیچ درخواست ثبت وکیل جدیدی وجود ندارد"
      empty-icon="lucide:user-check"
      @update:page="pagination.pageIndex = $event"
    >
      <!-- Custom cell for ID -->
      <template #cell-id="{ value }">
        <span class="text-gray-600">#{{ value }}</span>
      </template>

      <!-- Custom cell for fullName -->
      <template #cell-fullName="{ value }">
        <span class="font-medium text-gray-900">{{ value }}</span>
      </template>

      <!-- Custom cell for phone -->
      <template #cell-phone="{ value }">
        <span class="font-mono text-gray-600">{{ value }}</span>
      </template>

      <!-- Custom cell for base -->
      <template #cell-base="{ value }">
        <span class="badge badge-info">{{ value }}</span>
      </template>

      <!-- Custom cell for national card image -->
      <template #cell-nationalCardImage="{ row }">
        <UICPictureModal title="عکس کارت ملی" :image="row.nationalCardImage" />
      </template>

      <!-- Custom cell for license image -->
      <template #cell-licenseImage="{ row }">
        <UICPictureModal title="عکس پروانه وکیل" :image="row.licenseImage" />
      </template>

      <!-- Custom cell for status -->
      <template #cell-status="{ row }">
        <div v-if="row.status !== 'pending'" :class="{ 'text-[#1e3a5f]': row.status === 'approved' }" class="text-red-500">
          {{ row.status === "approved" ? "تایید شده" : "تایید نشده" }}
        </div>
        <div v-else>
          <UICChooseStatusModal
            @reject="(com) => rejectHandle(com, row.edit_id)"
            @accept="acceptHandle(row.edit_id)"
          />
        </div>
      </template>
    </dashboard-admin-generic-table>
  </div>
</template>

<style scoped>
@reference 'tailwindcss';
.register-lawyer-table {
  @apply space-y-4;
}
</style>
