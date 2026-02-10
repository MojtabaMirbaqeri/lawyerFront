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

type ExistingLawyer = {
  id: number;
  user_id: number;
  name: string;
  family: string;
  phone: string;
  license_number: string;
};

type PossibleLawyer = {
  id: number;
  name: string;
  family: string;
  phone: string | null;
  license_number: string | null;
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
      includeAuthHeader: true,
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
        includeAuthHeader: true,
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
      includeAuthHeader: true,
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

// مودال ادغام هنگام تکراری بودن شماره پروانه
const showMergeModal = ref(false);
const mergeExistingLawyer = ref<ExistingLawyer | null>(null);
const mergeRegisterLawyerId = ref<number | null>(null);
const mergeLoading = ref(false);

// مودال لیست وکلای احتمالی (هم‌نام) هنگام نبود شماره پروانه در سیستم
const showPossibleDuplicateModal = ref(false);
const possibleLawyers = ref<PossibleLawyer[]>([]);
const possibleDuplicateRegisterId = ref<number | null>(null);
const possibleDuplicateLoading = ref(false);
const approveAsNewLoading = ref(false);

const acceptHandle = async (id: number) => {
  const res = await usePut(
    {
      url: `register-lawyer/${id}/approve`,
      includeAuthHeader: true,
      body: undefined,
    },
    false
  );
  if (res.statusCode === 200) {
    refetch(pagination.value.pageIndex);
    useToast().add({ title: "احراز هویت وکیل تایید شد", color: "success" });
  } else if (res.statusCode === 409) {
    const payload = res.data?.data ?? res.data;
    if (payload?.code === "LICENSE_DUPLICATE") {
      mergeExistingLawyer.value = payload.existing_lawyer ?? null;
      mergeRegisterLawyerId.value = payload.register_lawyer_id ?? id;
      showMergeModal.value = true;
    } else if (payload?.code === "POSSIBLE_DUPLICATE_BY_NAME") {
      possibleLawyers.value = payload.possible_lawyers ?? [];
      possibleDuplicateRegisterId.value = payload.register_lawyer_id ?? id;
      showPossibleDuplicateModal.value = true;
    } else {
      const msg = res.message || "مشکلی رخ داده است";
      useToast().add({ title: msg, color: "error" });
    }
  } else {
    const msg = res.message || "مشکلی رخ داده است";
    useToast().add({ title: msg, color: "error" });
  }
};

const closeMergeModal = () => {
  showMergeModal.value = false;
  mergeExistingLawyer.value = null;
  mergeRegisterLawyerId.value = null;
};

const mergeHandle = async () => {
  const id = mergeRegisterLawyerId.value;
  if (id == null) return;
  mergeLoading.value = true;
  const res = await usePut(
    {
      url: `register-lawyer/${id}/merge`,
      includeAuthHeader: true,
      body: undefined,
    },
    false
  );
  mergeLoading.value = false;
  if (res.statusCode === 200) {
    closeMergeModal();
    refetch(pagination.value.pageIndex);
    useToast().add({
      title: "شماره موبایل وکیل قبلی به‌روزرسانی شد و درخواست ادغام با موفقیت انجام شد.",
      color: "success",
    });
  } else {
    useToast().add({
      title: res.message || "خطا در ادغام درخواست.",
      color: "error",
    });
  }
};

const closePossibleDuplicateModal = () => {
  showPossibleDuplicateModal.value = false;
  possibleLawyers.value = [];
  possibleDuplicateRegisterId.value = null;
};

const mergeWithExistingHandle = async (existingLawyerId: number) => {
  const id = possibleDuplicateRegisterId.value;
  if (id == null) return;
  possibleDuplicateLoading.value = true;
  const res = await usePut(
    {
      url: `register-lawyer/${id}/merge-with-existing`,
      includeAuthHeader: true,
      body: { existing_lawyer_id: existingLawyerId },
    },
    false
  );
  possibleDuplicateLoading.value = false;
  if (res.statusCode === 200) {
    closePossibleDuplicateModal();
    refetch(pagination.value.pageIndex);
    useToast().add({
      title: "اطلاعات وکیل به‌روزرسانی شد و درخواست ادغام با موفقیت انجام شد.",
      color: "success",
    });
  } else {
    useToast().add({
      title: res.message || "خطا در ادغام درخواست.",
      color: "error",
    });
  }
};

const approveAsNewHandle = async () => {
  const id = possibleDuplicateRegisterId.value;
  if (id == null) return;
  approveAsNewLoading.value = true;
  const res = await usePut(
    {
      url: `register-lawyer/${id}/approve?force_new=1`,
      includeAuthHeader: true,
      body: undefined,
    },
    false
  );
  approveAsNewLoading.value = false;
  if (res.statusCode === 200) {
    closePossibleDuplicateModal();
    refetch(pagination.value.pageIndex);
    useToast().add({ title: "احراز هویت وکیل تایید شد", color: "success" });
  } else {
    useToast().add({
      title: res.message || "خطا در ثبت وکیل جدید.",
      color: "error",
    });
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

    <!-- مودال ادغام هنگام تکراری بودن شماره پروانه -->
    <UModal v-model:open="showMergeModal" :ui="{ width: 'max-w-md' }">
      <template #content>
        <div class="merge-modal">
          <div class="merge-modal-header">
            <div class="merge-icon">
              <Icon name="lucide:user-cog" class="w-6 h-6" />
            </div>
            <h3 class="merge-title">شماره پروانه تکراری</h3>
            <button type="button" class="close-btn" @click="closeMergeModal" aria-label="بستن">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>
          <div class="merge-modal-body">
            <p class="merge-message">
              شماره پروانه این درخواست قبلاً برای وکیل زیر ثبت شده است. با زدن ادغام، شماره موبایل وکیل قبلی به شمارهٔ این درخواست به‌روزرسانی می‌شود.
            </p>
            <div v-if="mergeExistingLawyer" class="existing-lawyer-card">
              <div class="existing-lawyer-row">
                <span class="label">نام و نام خانوادگی:</span>
                <span class="value">{{ mergeExistingLawyer.name }} {{ mergeExistingLawyer.family }}</span>
              </div>
              <div class="existing-lawyer-row">
                <span class="label">شماره موبایل فعلی:</span>
                <span class="value font-mono">{{ mergeExistingLawyer.phone }}</span>
              </div>
              <div class="existing-lawyer-row">
                <span class="label">شماره پروانه:</span>
                <span class="value">{{ mergeExistingLawyer.license_number }}</span>
              </div>
            </div>
          </div>
          <div class="merge-modal-footer">
            <button type="button" class="btn-cancel" @click="closeMergeModal">
              انصراف
            </button>
            <button
              type="button"
              class="btn-merge"
              :disabled="mergeLoading"
              @click="mergeHandle"
            >
              <Icon v-if="mergeLoading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              ادغام
            </button>
          </div>
        </div>
      </template>
    </UModal>

    <!-- مودال لیست وکلای احتمالی (هم‌نام) -->
    <UModal v-model:open="showPossibleDuplicateModal" :ui="{ width: 'max-w-lg' }">
      <template #content>
        <div class="merge-modal">
          <div class="merge-modal-header">
            <div class="merge-icon">
              <Icon name="lucide:users" class="w-6 h-6" />
            </div>
            <h3 class="merge-title">احتمال تکراری بودن وکیل</h3>
            <button type="button" class="close-btn" @click="closePossibleDuplicateModal" aria-label="بستن">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>
          <div class="merge-modal-body">
            <p class="merge-message">
              وکلایی با همین نام و نام خانوادگی در سیستم وجود دارند. اگر این درخواست مربوط به یکی از وکلای زیر است، با زدن «ادغام» کنار همان وکیل، اطلاعات او با دادهٔ این ثبت‌نام به‌روز و پیامک تایید ارسال می‌شود؛ در غیر این صورت «ثبت وکیل جدید» را بزنید.
            </p>
            <div class="possible-lawyers-list space-y-2 max-h-60 overflow-y-auto">
              <div
                v-for="lawyer in possibleLawyers"
                :key="lawyer.id"
                class="existing-lawyer-card flex items-center justify-between gap-3"
              >
                <div class="flex-1 min-w-0">
                  <div class="existing-lawyer-row">
                    <span class="label">نام و نام خانوادگی:</span>
                    <span class="value">{{ lawyer.name }} {{ lawyer.family }}</span>
                  </div>
                  <div class="existing-lawyer-row">
                    <span class="label">تلفن:</span>
                    <span class="value font-mono">{{ lawyer.phone ?? '—' }}</span>
                  </div>
                  <div class="existing-lawyer-row">
                    <span class="label">شماره پروانه:</span>
                    <span class="value">{{ lawyer.license_number ?? '—' }}</span>
                  </div>
                </div>
                <button
                  type="button"
                  class="btn-merge shrink-0"
                  :disabled="possibleDuplicateLoading"
                  @click="mergeWithExistingHandle(lawyer.id)"
                >
                  <Icon v-if="possibleDuplicateLoading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                  ادغام
                </button>
              </div>
            </div>
          </div>
          <div class="merge-modal-footer">
            <button type="button" class="btn-cancel" @click="closePossibleDuplicateModal">
              انصراف
            </button>
            <button
              type="button"
              class="btn-merge"
              :disabled="approveAsNewLoading"
              @click="approveAsNewHandle"
            >
              <Icon v-if="approveAsNewLoading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              ثبت وکیل جدید
            </button>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
@reference 'tailwindcss';
.register-lawyer-table {
  @apply space-y-4;
}

.merge-modal {
  @apply bg-white rounded-xl w-full overflow-hidden;
}
.merge-modal-header {
  @apply flex items-center gap-4 px-6 py-4 border-b border-gray-100;
}
.merge-icon {
  @apply w-10 h-10 rounded-full flex items-center justify-center bg-amber-100 text-amber-600;
}
.merge-title {
  @apply flex-1 text-lg font-semibold text-gray-900;
}
.close-btn {
  @apply p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors bg-transparent border-none cursor-pointer;
}
.merge-modal-body {
  @apply px-6 py-5;
}
.merge-message {
  @apply text-sm text-gray-600 leading-relaxed mb-4;
}
.existing-lawyer-card {
  @apply bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-100;
}
.existing-lawyer-row {
  @apply flex justify-between gap-2 text-sm;
}
.existing-lawyer-row .label {
  @apply text-gray-500;
}
.existing-lawyer-row .value {
  @apply text-gray-900 font-medium;
}
.merge-modal-footer {
  @apply flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50;
}
.btn-cancel {
  @apply px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors;
}
.btn-merge {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#1e3a5f] hover:bg-[#152a47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>
