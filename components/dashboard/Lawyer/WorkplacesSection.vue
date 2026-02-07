<template>
  <div class="workplaces-section">
    <!-- Loading State -->
    <div v-if="isInitialLoading" class="space-y-4">
      <UICSkeletonCard height="150px" />
      <UICSkeletonCard height="200px" />
    </div>

    <!-- Main Content -->
    <div v-else>
      <UICFormSection
        title="محل‌های کار"
        description="آدرس دفتر یا محل‌های کاری که موکلین می‌توانند به شما مراجعه کنند"
        icon="lucide:building-2">
        <template #actions>
          <button
          v-if="workplacesList.length > 0"
          @click="openAddModal" class="btn-sm-primary">
            <Icon name="lucide:plus" class="w-4 h-4" />
            <span class="hidden sm:block">افزودن محل کار</span>
          </button>
        </template>

        <!-- Empty State -->
        <UICEmptyState
          v-if="workplacesList.length === 0"
          icon="lucide:building-2"
          title="محل کاری ثبت نشده"
          description="برای فعال‌سازی رزرو حضوری، حداقل یک محل کار اضافه کنید"
          action-text="افزودن محل کار"
          @action="openAddModal" />

        <!-- Workplaces List -->
        <div v-else class="space-y-4">
          <div
            v-for="workplace in workplacesList"
            :key="workplace.id"
            :class="['workplace-card', { highlighted: highlightedId === workplace.id }]">
            <div class="workplace-icon">
              <Icon name="lucide:building-2" class="w-5 h-5" />
            </div>
            <div class="workplace-info">
              <h4 class="workplace-name">{{ workplace.name }}</h4>
              <p class="workplace-address">{{ workplace.address }}</p>
              <div class="workplace-meta">
                <span>
                  <Icon name="lucide:map-pin" class="w-3 h-3" />
                  {{ workplace.province?.name }} - {{ workplace.city?.name }}
                </span>
                <span v-if="workplace.phone">
                  <Icon name="lucide:phone" class="w-3 h-3" />
                  {{ workplace.phone }}
                </span>
              </div>
            </div>
            <div class="workplace-actions">
              
              <button @click="confirmDelete(workplace)" class="btn-icon-sm text-red-500">
                <Icon name="lucide:trash-2" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </UICFormSection>
    </div>

    <!-- Add/Edit Modal -->
    <UModal v-model:open="showModal" :ui="{ width: 'max-w-2xl' }">
      <template #content>
        <div class="modal-content-lg">
          <div class="modal-header">
            <h3 class="modal-title">
              {{ editingWorkplace ? "ویرایش محل کار" : "افزودن محل کار جدید" }}
            </h3>
            <button @click="showModal = false" class="btn-icon">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <UForm
            :schema="workplaceSchema"
            :state="formState"
            class="modal-body overflow-y-auto"
            @submit="onSubmit">
            <div class="form-grid-2">
              <!-- نام محل کار -->
              <div class="form-field md:col-span-2">
                <UICInput
                  v-model="formState.name"
                  name="name"
                  label="نام محل کار"
                  placeholder="مثال: دفتر وکالت مرکزی"
                  required />
              </div>

              <!-- استان -->
              <div class="form-field">
                <UICInput name="province_id" label="استان" required>
                  <template #input>
                    <UICSelect
                      v-model="formState.province_id"
                      :items="provinces"
                      :loading="isFetchingProvinces"
                      placeholder="انتخاب استان" />
                  </template>
                </UICInput>
              </div>

              <!-- شهر -->
              <div class="form-field">
                <UICInput name="city_id" label="شهر" required>
                  <template #input>
                    <UICSelect
                      v-model="formState.city_id"
                      :items="cities"
                      :loading="isFetchingCities"
                      placeholder="انتخاب شهر"
                      :disabled="!formState.province_id" />
                  </template>
                </UICInput>
              </div>

              <!-- آدرس -->
              <div class="form-field md:col-span-2">
                <label class="form-label"
                  >آدرس کامل <span class="required-star">*</span></label
                >
                <UTextarea
                  v-model="formState.address"
                  placeholder="آدرس دقیق محل کار را وارد کنید"
                  :rows="2" />
              </div>

              <!-- تلفن -->
              <div class="form-field">
                <UICInput
                  v-model="formState.phone"
                  name="phone"
                  label="تلفن ثابت"
                  placeholder="مثال: ۰۲۱-۱۲۳۴۵۶۷۸"
                  dir="ltr" />
              </div>

              <!-- تلفن اضطراری -->
              <div class="form-field">
                <UICInput
                  v-model="formState.emergency_phone"
                  name="emergency_phone"
                  label="تلفن اضطراری"
                  placeholder="شماره موبایل یا ثابت"
                  dir="ltr" />
              </div>

              <!-- نقشه -->
              <div class="form-field md:col-span-2">
                <label class="form-label">موقعیت روی نقشه</label>
                <DashboardLawyerGetLocation
                  v-model="formState.location"
                  class="h-[250px] w-full rounded-lg overflow-hidden border border-gray-200" />
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" @click="showModal = false" class="btn-secondary">
                انصراف
              </button>
              <button type="submit" class="btn-primary" :disabled="isLoading">
                <Icon
                  v-if="isLoading"
                  name="lucide:loader-2"
                  class="w-4 h-4 animate-spin" />
                {{ isLoading ? "در حال ذخیره..." : "ذخیره محل کار" }}
              </button>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <!-- Delete Confirm Modal -->
    <UICConfirmModal
      v-model="showDeleteConfirm"
      title="حذف محل کار"
      :message="`آیا از حذف «${deleteTarget?.name}» اطمینان دارید؟ این عمل قابل بازگشت نیست.`"
      confirm-text="حذف"
      variant="danger"
      :loading="isDeleting"
      @confirm="executeDelete" />
  </div>
</template>

<script setup>
import { object, string } from "yup";

const props = defineProps({
  lawyerInformation: { type: Object, required: true },
});

const emit = defineEmits(["update:changes", "saved"]);
const toast = useToast();

// State
const isInitialLoading = ref(true);
const isLoading = ref(false);
const isDeleting = ref(false);
const workplacesList = ref([]);
const highlightedId = ref(null);

// Modal state
const showModal = ref(false);
const showDeleteConfirm = ref(false);
const editingWorkplace = ref(null);
const deleteTarget = ref(null);

// Form state
const formState = reactive({
  name: "",
  province_id: "",
  city_id: "",
  address: "",
  phone: "",
  emergency_phone: "",
  location: [],
});

// Province/City
const provinces = ref([]);
const cities = ref([]);
const isFetchingProvinces = ref(false);
const isFetchingCities = ref(false);

// Schema
const workplaceSchema = object({
  name: string().required("نام محل کار الزامی است"),
  province_id: string().required("استان الزامی است"),
  city_id: string().required("شهر الزامی است"),
  address: string().required("آدرس الزامی است"),
});

// Fetch initial data
async function fetchInitialData() {
  isInitialLoading.value = true;
  try {
    const [workplacesRes] = await Promise.all([
      useGet({ url: "workplaces", includeAuthHeader: true }),
      fetchProvinces(),
    ]);

    if (workplacesRes.status) {
      workplacesList.value = workplacesRes.data.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch workplaces:", error);
    toast.add({ description: "خطا در دریافت اطلاعات", color: "error" });
  } finally {
    isInitialLoading.value = false;
  }
}

async function fetchProvinces() {
  isFetchingProvinces.value = true;
  try {
    const provincesRes = await fetch("/provinces.json");
    const rawProvinces = await provincesRes.json();
    provinces.value = (rawProvinces || []).map((p) => ({
      id: String(p.id),
      label: p.name,
    }));
  } catch (err) {
    console.error("fetch provinces error:", err);
  } finally {
    isFetchingProvinces.value = false;
  }
}

async function fetchCities(provinceId) {
  if (!provinceId) {
    cities.value = [];
    return;
  }
  isFetchingCities.value = true;
  try {
    const res = await useGet({ url: `area/citiesByProvincesId/${provinceId}` });
    cities.value = (res.data || []).map((c) => ({
      id: String(c.id),
      label: c.name,
    }));
    if (!cities.value.find((c) => c.id === formState.city_id)) {
      formState.city_id = cities.value.length ? cities.value[0].id : "";
    }
  } catch (err) {
    console.error("fetchCities error:", err);
    cities.value = [];
  } finally {
    isFetchingCities.value = false;
  }
}

watch(
  () => formState.province_id,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      formState.city_id = "";
      fetchCities(newVal);
    }
  },
);

// Modal functions
function openAddModal() {
  editingWorkplace.value = null;
  Object.assign(formState, {
    name: "",
    province_id: "",
    city_id: "",
    address: "",
    phone: "",
    emergency_phone: "",
    location: [],
  });

  // Set default province (Tehran)
  const tehran = provinces.value.find((p) => p.label === "تهران");
  if (tehran) {
    formState.province_id = tehran.id;
  } else if (provinces.value.length) {
    formState.province_id = provinces.value[0].id;
  }

  showModal.value = true;
}

function openEditModal(workplace) {
  editingWorkplace.value = workplace;
  Object.assign(formState, {
    name: workplace.name || "",
    province_id: String(workplace.province_id || ""),
    city_id: String(workplace.city_id || ""),
    address: workplace.address || "",
    phone: workplace.phone || "",
    emergency_phone: workplace.emergency_phone || "",
    location: workplace.lat && workplace.lng ? [workplace.lat, workplace.lng] : [],
  });
  fetchCities(formState.province_id);
  showModal.value = true;
}

async function onSubmit() {
  // Manual validation
  if (!formState.name || !formState.name.trim()) {
    toast.add({ description: "نام محل کار الزامی است", color: "error" });
    return;
  }
  if (!formState.province_id) {
    toast.add({ description: "استان الزامی است", color: "error" });
    return;
  }
  if (!formState.city_id) {
    toast.add({ description: "شهر الزامی است", color: "error" });
    return;
  }
  if (!formState.address || !formState.address.trim()) {
    toast.add({ description: "آدرس الزامی است", color: "error" });
    return;
  }

  isLoading.value = true;

  const body = {
    name: formState.name,
    address: formState.address,
    phone: formState.phone || null,
    emergency_phone: formState.emergency_phone || null,
    province_id: parseInt(formState.province_id),
    city_id: parseInt(formState.city_id),
    work_times: [],
    lat: formState.location?.[0] || null,
    lng: formState.location?.[1] || null,
  };

  try {
    if (editingWorkplace.value) {
      // Update
      const res = await usePatch({
        url: `workplaces/${editingWorkplace.value.id}`,
        includeAuthHeader: true,
        body,
      });

      if (res.status) {
        const index = workplacesList.value.findIndex(
          (w) => w.id === editingWorkplace.value.id,
        );
        if (index !== -1) {
          workplacesList.value[index] = {
            ...workplacesList.value[index],
            ...res.data.data,
          };
        }
        toast.add({ description: "محل کار با موفقیت ویرایش شد.", color: "success" });
        showModal.value = false;
        emit("saved");
      } else {
        toast.add({ description: "خطا در ویرایش محل کار.", color: "error" });
      }
    } else {
      // Create
      const res = await usePost({
        url: "workplaces",
        includeAuthHeader: true,
        body,
      });

      if (res.status && res.data.data) {
        workplacesList.value.push(res.data.data);
        highlightedId.value = res.data.data.id;
        setTimeout(() => {
          highlightedId.value = null;
        }, 2000);
        toast.add({ description: "محل کار با موفقیت افزوده شد.", color: "success" });
        showModal.value = false;
        emit("saved");
      } else {
        toast.add({ description: "خطا در افزودن محل کار.", color: "error" });
      }
    }
  } catch (err) {
    console.error("Workplace submit error:", err);
    toast.add({ description: "خطای سرور.", color: "error" });
  } finally {
    isLoading.value = false;
  }
}

// Delete
function confirmDelete(workplace) {
  deleteTarget.value = workplace;
  showDeleteConfirm.value = true;
}

async function executeDelete() {
  if (!deleteTarget.value) return;

  isDeleting.value = true;
  try {
    const res = await useDelete({
      url: `workplaces/${deleteTarget.value.id}`,
      includeAuthHeader: true,
    });

    if (res.status) {
      workplacesList.value = workplacesList.value.filter(
        (w) => w.id !== deleteTarget.value.id,
      );
      toast.add({ description: "محل کار با موفقیت حذف شد.", color: "success" });
      showDeleteConfirm.value = false;
      emit("saved");
    } else {
      toast.add({ description: res.message || "خطا در حذف.", color: "error" });
    }
  } catch (err) {
    console.error("Delete error:", err);
    toast.add({ description: "خطای سرور.", color: "error" });
  } finally {
    isDeleting.value = false;
    deleteTarget.value = null;
  }
}

// Init
fetchInitialData();
</script>

<style scoped>
@reference "tailwindcss";

.workplaces-section {
  @apply flex flex-col gap-6;
}

/* Workplace Card */
.workplace-card {
  @apply flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 transition-all;
}

.workplace-card.highlighted {
  @apply bg-green-50 border-green-200;
  animation: highlight-fade 2s ease-out;
}

@keyframes highlight-fade {
  0% {
    background-color: rgba(34, 197, 94, 0.2);
  }
  100% {
    background-color: rgba(240, 253, 244, 1);
  }
}

.workplace-icon {
  @apply w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0;
}

.workplace-info {
  @apply flex-1 min-w-0;
}

.workplace-name {
  @apply text-sm font-semibold text-gray-900;
}

.workplace-address {
  @apply text-sm text-gray-600 mt-0.5;
}

.workplace-meta {
  @apply flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500;
}

.workplace-meta span {
  @apply flex items-center gap-1;
}

.workplace-actions {
  @apply flex items-center gap-1 shrink-0;
}

/* Buttons */
.btn-sm-primary {
  @apply inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors;
}

.btn-icon-sm {
  @apply p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors;
}

/* Modal */
.modal-content-lg {
  @apply bg-white rounded-xl w-full max-w-2xl overflow-y-auto;
}

.modal-header {
  @apply flex items-center justify-between px-6 py-4 border-b border-gray-100;
}

.modal-title {
  @apply text-lg font-semibold text-gray-900;
}

.modal-body {
  @apply px-6 py-5;
}

.modal-footer {
  @apply flex items-center justify-end gap-3 pt-5 border-t border-gray-100 mt-5;
}

.form-grid-2 {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.form-field {
  @apply flex flex-col gap-2;
}

.form-label {
  @apply text-sm font-medium text-gray-700;
}

.required-star {
  @apply text-red-500;
}

.form-hint {
  @apply text-xs text-gray-500;
}

@media (max-width: 640px) {
  .workplace-card {
    @apply flex-col;
  }

  .workplace-actions {
    @apply w-full justify-end pt-3 border-t border-gray-100 mt-3;
  }
}
</style>
