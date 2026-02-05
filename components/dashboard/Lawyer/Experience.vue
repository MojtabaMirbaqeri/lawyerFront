<template>
  <div class="experience-section">
    <!-- Loading State -->
    <div v-if="isInitialLoading" class="space-y-6">
      <UICSkeletonCard v-for="i in 3" :key="i" height="200px" />
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="error-card">
      <Icon name="lucide:alert-triangle" class="w-10 h-10 text-red-500 mb-3" />
      <h3 class="text-lg font-semibold text-gray-900 mb-2">خطا در بارگذاری</h3>
      <p class="text-sm text-gray-500 mb-4">{{ loadError }}</p>
      <button @click="fetchInitialData" class="btn-primary">
        <Icon name="lucide:refresh-cw" class="w-4 h-4" />
        تلاش مجدد
      </button>
    </div>

    <!-- Main Content -->
    <div v-else class="experience-content">
      <!-- Education Section -->
      <UICFormSection
        title="سوابق تحصیلی"
        description="مدارک و سوابق تحصیلی شما در حوزه حقوق"
        icon="lucide:graduation-cap"
        :collapsible="true"
        :default-collapsed="false">
        <template #actions>
          <button @click="openEducationModal()" class="btn-sm-primary">
            <Icon name="lucide:plus" class="w-4 h-4" />
            افزودن
          </button>
        </template>

        <!-- Empty State -->
        <UICEmptyState
          v-if="educationHistory.length === 0"
          icon="lucide:graduation-cap"
          title="سابقه تحصیلی ثبت نشده"
          description="با افزودن سوابق تحصیلی، اعتبار پروفایل شما افزایش می‌یابد"
          action-text="افزودن سابقه تحصیلی"
          @action="openEducationModal()" />

        <!-- Desktop Table -->
        <div v-else class="hidden md:block">
          <table class="data-table">
            <thead>
              <tr>
                <th>مدرک</th>
                <th>رشته</th>
                <th>دانشگاه</th>
                <th>محل تحصیل</th>
                <th class="w-20"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in educationHistory"
                :key="item.id"
                :class="{
                  'highlighted-row': highlightedItem === `education-${item.id}`,
                }">
                <td>{{ item.degree_text }}</td>
                <td>{{ item.field_of_study }}</td>
                <td>{{ item.university }}</td>
                <td>{{ item.place_of_study }}</td>
                <td>
                  <div class="flex items-center gap-1 justify-end">
                    <button @click="openEducationModal(item)" class="btn-icon-sm">
                      <Icon name="lucide:pencil" class="w-4 h-4" />
                    </button>
                    <button
                      @click="confirmDelete('education', item)"
                      class="btn-icon-sm text-red-500">
                      <Icon name="lucide:trash-2" class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards (Binance Style) -->
        <div class="md:hidden mobile-cards">
          <div
            v-for="item in educationHistory"
            :key="item.id"
            class="mobile-card"
            :class="{ highlighted: highlightedItem === `education-${item.id}` }">
            <div class="mobile-card-row">
              <span class="mobile-card-label">مدرک</span>
              <span class="mobile-card-value">{{ item.degree_text }}</span>
            </div>
            <div class="mobile-card-row">
              <span class="mobile-card-label">رشته</span>
              <span class="mobile-card-value">{{ item.field_of_study }}</span>
            </div>
            <div class="mobile-card-row">
              <span class="mobile-card-label">دانشگاه</span>
              <span class="mobile-card-value">{{ item.university }}</span>
            </div>
            <div class="mobile-card-row">
              <span class="mobile-card-label">محل تحصیل</span>
              <span class="mobile-card-value">{{ item.place_of_study }}</span>
            </div>
            <div class="mobile-card-actions">
              <button
                @click="confirmDelete('education', item)"
                class="btn-icon-sm text-red-500">
                <UIcon name="lucide:trash-2" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </UICFormSection>

      <!-- Work Experience Section -->
      <UICFormSection
        title="سوابق کاری"
        description="تجربیات کاری شما در حوزه حقوق و وکالت"
        icon="lucide:briefcase"
        :collapsible="true"
        :default-collapsed="true">
        <template #actions>
          <button @click="openWorkModal()" class="btn-sm-primary">
            <Icon name="lucide:plus" class="w-4 h-4" />
            افزودن
          </button>
        </template>

        <!-- Empty State -->
        <UICEmptyState
          v-if="workHistory.length === 0"
          icon="lucide:briefcase"
          title="سابقه کاری ثبت نشده"
          description="با افزودن سوابق کاری، موکلین اعتماد بیشتری به شما پیدا می‌کنند"
          action-text="افزودن سابقه کاری"
          @action="openWorkModal()" />

        <!-- Desktop Table -->
        <div v-else class="hidden md:block">
          <table class="data-table">
            <thead>
              <tr>
                <th>سمت</th>
                <th>سابقه</th>
                <th>ارگان / شرکت</th>
                <th>محل کار</th>
                <th class="w-20"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in workHistory"
                :key="item.id"
                :class="{ 'highlighted-row': highlightedItem === `work-${item.id}` }">
                <td>{{ item.position }}</td>
                <td>{{ item.experience_years_text }}</td>
                <td>{{ item.organization }}</td>
                <td>{{ item.work_place }}</td>
                <td>
                  <div class="flex items-center gap-1 justify-end">
                    <button @click="openWorkModal(item)" class="btn-icon-sm">
                      <Icon name="lucide:pencil" class="w-4 h-4" />
                    </button>
                    <button
                      @click="confirmDelete('work', item)"
                      class="btn-icon-sm text-red-500">
                      <Icon name="lucide:trash-2" class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards (Binance Style) -->
        <div class="md:hidden mobile-cards">
          <div
            v-for="item in workHistory"
            :key="item.id"
            class="mobile-card"
            :class="{ highlighted: highlightedItem === `work-${item.id}` }">
            <div class="mobile-card-row">
              <span class="mobile-card-label">سمت</span>
              <span class="mobile-card-value">{{ item.position }}</span>
            </div>
            <div class="mobile-card-row">
              <span class="mobile-card-label">سابقه</span>
              <span class="mobile-card-value">{{ item.experience_years_text }}</span>
            </div>
            <div class="mobile-card-row">
              <span class="mobile-card-label">ارگان / شرکت</span>
              <span class="mobile-card-value">{{ item.organization }}</span>
            </div>
            <div class="mobile-card-row">
              <span class="mobile-card-label">محل کار</span>
              <span class="mobile-card-value">{{ item.work_place }}</span>
            </div>
            <div class="mobile-card-actions">
              <button @click="openWorkModal(item)" class="btn-icon-sm">
                <Icon name="lucide:pencil" class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete('work', item)"
                class="btn-icon-sm text-red-500">
                <Icon name="lucide:trash-2" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </UICFormSection>

      <!-- Awards Section -->
      <UICFormSection
        title="جوایز و افتخارات"
        description="لوح‌ها، گواهی‌نامه‌ها و افتخارات حرفه‌ای شما"
        icon="lucide:award"
        :collapsible="true"
        :default-collapsed="true">
        <template #actions>
          <button @click="openAwardModal()" class="btn-sm-primary">
            <Icon name="lucide:plus" class="w-4 h-4" />
            افزودن
          </button>
        </template>

        <!-- Empty State -->
        <UICEmptyState
          v-if="awardsHistory.length === 0"
          icon="lucide:award"
          title="افتخاری ثبت نشده"
          description="جوایز و گواهی‌نامه‌های خود را برای افزایش اعتبار اضافه کنید"
          action-text="افزودن افتخار"
          @action="openAwardModal()" />

        <!-- Desktop Table -->
        <div v-else class="hidden md:block">
          <table class="data-table">
            <thead>
              <tr>
                <th>نام افتخار</th>
                <th>صادر کننده</th>
                <th>تصویر</th>
                <th class="w-20"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in awardsHistory"
                :key="item.id"
                :class="{ 'highlighted-row': highlightedItem === `award-${item.id}` }">
                <td>{{ item.award_name }}</td>
                <td>{{ item.issuing_organization }}</td>
                <td>
                  <button
                    v-if="item.image_url"
                    @click="showImagePreview(item.image_url)"
                    class="text-blue-600 hover:underline text-sm">
                    مشاهده تصویر
                  </button>
                  <span v-else class="text-gray-400 text-sm">ندارد</span>
                </td>
                <td>
                  <div class="flex items-center gap-1 justify-end">
                    <button
                      @click="confirmDelete('award', item)"
                      class="btn-icon-sm text-red-500">
                      <Icon name="lucide:trash-2" class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards (Binance Style) -->
        <div class="md:hidden mobile-cards">
          <div
            v-for="item in awardsHistory"
            :key="item.id"
            class="mobile-card"
            :class="{ highlighted: highlightedItem === `award-${item.id}` }">
            <div class="mobile-card-row">
              <span class="mobile-card-label">عنوان جایزه</span>
              <span class="mobile-card-value">{{ item.award_name }}</span>
            </div>
            <div class="mobile-card-row">
              <span class="mobile-card-label">سازمان اعطا کننده</span>
              <span class="mobile-card-value">{{ item.issuing_organization }}</span>
            </div>
            <div v-if="item.image_url" class="mobile-card-row">
              <span class="mobile-card-label">تصویر</span>
              <button
                @click="showImagePreview(item.image_url)"
                class="text-blue-600 hover:underline text-sm">
                <Icon name="lucide:image" class="w-3 h-3" /> مشاهده
              </button>
            </div>
            <div class="mobile-card-actions">
              <button
                @click="confirmDelete('award', item)"
                class="btn-icon-sm text-red-500">
                <Icon name="lucide:trash-2" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </UICFormSection>
    </div>

    <!-- Education Modal -->
    <UModal v-model:open="showEducationModal">
      <template #content>
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">
              {{ editingEducation ? "ویرایش سابقه تحصیلی" : "افزودن سابقه تحصیلی" }}
            </h3>
            <button @click="showEducationModal = false" class="btn-icon">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>
          <UForm
            :schema="educationSchema"
            :state="educationState"
            class="modal-body"
            @submit="onEducationSubmit">
            <div class="form-stack">
              <div class="form-field">
                <UICInput name="degree" label="مدرک تحصیلی" required>
                  <template #input>
                    <UICSelect v-model="educationState.degree" :items="degreeOptions" />
                  </template>
                </UICInput>
              </div>
              <div class="form-field">
                <UICInput
                  v-model="educationState.field_of_study"
                  name="field_of_study"
                  label="رشته تحصیلی"
                  placeholder="مثال: حقوق خصوصی"
                  required />
              </div>
              <div class="form-field">
                <UICInput
                  v-model="educationState.university"
                  name="university"
                  label="دانشگاه"
                  placeholder="نام دانشگاه"
                  required />
              </div>
              <div class="form-field">
                <UICInput
                  v-model="educationState.place_of_study"
                  name="place_of_study"
                  label="محل تحصیل"
                  placeholder="شهر یا کشور"
                  required />
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                @click="showEducationModal = false"
                class="btn-secondary">
                انصراف
              </button>
              <button type="submit" class="btn-primary" :disabled="isEducationLoading">
                <Icon
                  v-if="isEducationLoading"
                  name="lucide:loader-2"
                  class="w-4 h-4 animate-spin" />
                {{ isEducationLoading ? "در حال ذخیره..." : "ذخیره" }}
              </button>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <!-- Work Modal -->
    <UModal v-model:open="showWorkModal">
      <template #content>
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">
              {{ editingWork ? "ویرایش سابقه کاری" : "افزودن سابقه کاری" }}
            </h3>
            <button @click="showWorkModal = false" class="btn-icon">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>
          <UForm
            :schema="workSchema"
            :state="workState"
            class="modal-body"
            @submit="onWorkSubmit">
            <div class="form-stack">
              <div class="form-field">
                <UICInput
                  v-model="workState.position"
                  name="position"
                  label="سمت"
                  placeholder="مثال: وکیل پایه یک"
                  required />
              </div>
              <div class="form-field">
                <UICInput name="experience_years" label="سابقه کاری" required>
                  <template #input>
                    <UICSelect
                      v-model="workState.experience_years"
                      :items="experienceOptions" />
                  </template>
                </UICInput>
              </div>
              <div class="form-field">
                <UICInput
                  v-model="workState.organization"
                  name="organization"
                  label="ارگان / شرکت"
                  placeholder="نام سازمان یا شرکت"
                  required />
              </div>
              <div class="form-field">
                <UICInput
                  v-model="workState.work_place"
                  name="work_place"
                  label="محل کار"
                  placeholder="شهر یا آدرس"
                  required />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" @click="showWorkModal = false" class="btn-secondary">
                انصراف
              </button>
              <button type="submit" class="btn-primary" :disabled="isWorkLoading">
                <Icon
                  v-if="isWorkLoading"
                  name="lucide:loader-2"
                  class="w-4 h-4 animate-spin" />
                {{ isWorkLoading ? "در حال ذخیره..." : "ذخیره" }}
              </button>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <!-- Award Modal -->
    <UModal v-model:open="showAwardModal">
      <template #content>
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">افزودن افتخار</h3>
            <button @click="showAwardModal = false" class="btn-icon">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>
          <UForm
            :schema="awardSchema"
            :state="awardState"
            class="modal-body"
            @submit="onAwardSubmit">
            <div class="form-stack">
              <div class="form-field">
                <UICInput
                  v-model="awardState.award_name"
                  name="award_name"
                  label="عنوان افتخار"
                  placeholder="مثال: وکیل برتر سال"
                  required />
              </div>
              <div class="form-field">
                <UICInput
                  v-model="awardState.issuing_organization"
                  name="issuing_organization"
                  label="ارگان صادر کننده"
                  placeholder="نام سازمان صادر کننده"
                  required />
              </div>
              <div class="form-field">
                <label class="form-label"
                  >تصویر لوح <span class="required-star">*</span></label
                >
                <div class="file-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleAwardImageChange"
                    class="file-input" />
                  <div v-if="awardState.image" class="file-preview">
                    <Icon name="lucide:image" class="w-5 h-5 text-green-500" />
                    <span class="text-sm text-gray-700">{{ awardState.image.name }}</span>
                    <span class="text-xs text-gray-400">{{
                      formatFileSize(awardState.image.size)
                    }}</span>
                  </div>
                  <div v-else class="file-placeholder">
                    <Icon name="lucide:upload" class="w-6 h-6 text-gray-400" />
                    <span class="text-sm text-gray-500">کلیک کنید یا فایل را بکشید</span>
                    <span class="text-xs text-gray-400">حداکثر ۵ مگابایت</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" @click="showAwardModal = false" class="btn-secondary">
                انصراف
              </button>
              <button type="submit" class="btn-primary" :disabled="isAwardLoading">
                <Icon
                  v-if="isAwardLoading"
                  name="lucide:loader-2"
                  class="w-4 h-4 animate-spin" />
                {{ isAwardLoading ? "در حال ذخیره..." : "ذخیره" }}
              </button>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <!-- Confirm Delete Modal -->
    <UICConfirmModal
      v-model="showDeleteConfirm"
      title="حذف آیتم"
      :message="deleteConfirmMessage"
      confirm-text="حذف"
      variant="danger"
      :loading="isDeleting"
      @confirm="executeDelete" />

    <!-- Image Preview Modal -->
    <UModal v-model:open="showImageModal">
      <template #content>
        <div class="image-preview-modal">
          <button @click="showImageModal = false" class="image-close-btn">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
          <img :src="previewImageUrl" alt="تصویر لوح افتخار" class="preview-image" />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup>
import { object, string, mixed } from "yup";

const toast = useToast();

// State
const isInitialLoading = ref(true);
const loadError = ref(null);
const educationHistory = ref([]);
const workHistory = ref([]);
const awardsHistory = ref([]);
const highlightedItem = ref(null);

// Loading states
const isEducationLoading = ref(false);
const isWorkLoading = ref(false);
const isAwardLoading = ref(false);
const isDeleting = ref(false);

// Modal states
const showEducationModal = ref(false);
const showWorkModal = ref(false);
const showAwardModal = ref(false);
const showDeleteConfirm = ref(false);
const showImageModal = ref(false);

// Edit states
const editingEducation = ref(null);
const editingWork = ref(null);
const deleteTarget = ref(null);
const previewImageUrl = ref("");

// Form states
const educationState = reactive({
  degree: "bachelor",
  field_of_study: "",
  university: "",
  place_of_study: "",
});

const workState = reactive({
  position: "",
  experience_years: "1-3",
  organization: "",
  work_place: "",
});

const awardState = reactive({
  award_name: "",
  issuing_organization: "",
  image: null,
});

// Options
const degreeOptions = [
  { id: "bachelor", label: "کارشناسی" },
  { id: "master", label: "کارشناسی ارشد" },
  { id: "phd", label: "دکترا" },
  { id: "law_degree", label: "فوق دکتری" },
];

const experienceOptions = [
  { id: "0-1", label: "کمتر از یک سال" },
  { id: "1-3", label: "۱ تا ۳ سال" },
  { id: "3-5", label: "۳ تا ۵ سال" },
  { id: "5-10", label: "۵ تا ۱۰ سال" },
  { id: "10+", label: "بیشتر از ۱۰ سال" },
];

// Schemas
const educationSchema = object({
  degree: string().required("مدرک تحصیلی الزامی است"),
  field_of_study: string().required("رشته تحصیلی الزامی است"),
  university: string().required("نام دانشگاه الزامی است"),
  place_of_study: string().required("محل تحصیل الزامی است"),
});

const workSchema = object({
  position: string().required("سمت الزامی است"),
  experience_years: string().required("سابقه کاری الزامی است"),
  organization: string().required("نام ارگان الزامی است"),
  work_place: string().required("محل کار الزامی است"),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const awardSchema = object({
  award_name: string().required("عنوان افتخار الزامی است"),
  issuing_organization: string().required("نام ارگان صادر کننده الزامی است"),
  image: mixed()
    .required("تصویر لوح افتخار الزامی است")
    .test(
      "fileSize",
      "حجم فایل نباید بیشتر از ۵ مگابایت باشد",
      (file) => file && file.size <= MAX_FILE_SIZE,
    ),
});

// Computed
const deleteConfirmMessage = computed(() => {
  if (!deleteTarget.value) return "";
  const types = { education: "سابقه تحصیلی", work: "سابقه کاری", award: "افتخار" };
  return `آیا از حذف این ${types[deleteTarget.value.type]} اطمینان دارید؟ این عمل قابل بازگشت نیست.`;
});

// Methods
async function fetchInitialData() {
  isInitialLoading.value = true;
  loadError.value = null;
  try {
    const [educationRes, workRes, awardsRes] = await Promise.all([
      useGet({ url: "lawyer/profile/education", includeAuthHeader: true }),
      useGet({ url: "lawyer/profile/work-experience", includeAuthHeader: true }),
      useGet({ url: "lawyer/profile/awards", includeAuthHeader: true }),
    ]);

    if (educationRes.status && educationRes.data)
      educationHistory.value = educationRes.data.data || [];
    if (workRes.status && workRes.data) workHistory.value = workRes.data.data || [];
    if (awardsRes.status && awardsRes.data)
      awardsHistory.value = awardsRes.data.data || [];
  } catch (error) {
    console.error("Failed to fetch initial data:", error);
    loadError.value = "خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.";
  } finally {
    isInitialLoading.value = false;
  }
}

function highlightNewItem(type, id) {
  highlightedItem.value = `${type}-${id}`;
  setTimeout(() => {
    highlightedItem.value = null;
  }, 2000);
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// Education
function openEducationModal(item = null) {
  editingEducation.value = item;
  if (item) {
    Object.assign(educationState, {
      degree: item.degree || "bachelor",
      field_of_study: item.field_of_study || "",
      university: item.university || "",
      place_of_study: item.place_of_study || "",
    });
  } else {
    Object.assign(educationState, {
      degree: "bachelor",
      field_of_study: "",
      university: "",
      place_of_study: "",
    });
  }
  showEducationModal.value = true;
}

async function onEducationSubmit(event) {
  isEducationLoading.value = true;
  try {
    const res = await usePost({
      url: "lawyer/profile/education",
      includeAuthHeader: true,
      body: event.data,
    });

    if (res.status && res.data && res.data.data) {
      toast.add({ description: "سابقه تحصیلی با موفقیت افزوده شد.", color: "success" });
      educationHistory.value.push(res.data.data);
      highlightNewItem("education", res.data.data.id);
      showEducationModal.value = false;
      Object.assign(educationState, {
        degree: "bachelor",
        field_of_study: "",
        university: "",
        place_of_study: "",
      });
    } else {
      toast.add({ description: "خطا در افزودن سابقه تحصیلی.", color: "error" });
    }
  } catch (err) {
    console.error("Education submit error:", err);
    toast.add({ description: "خطای سرور.", color: "error" });
  } finally {
    isEducationLoading.value = false;
  }
}

// Work
function openWorkModal(item = null) {
  editingWork.value = item;
  if (item) {
    Object.assign(workState, {
      position: item.position || "",
      experience_years: item.experience_years || "1-3",
      organization: item.organization || "",
      work_place: item.work_place || "",
    });
  } else {
    Object.assign(workState, {
      position: "",
      experience_years: "1-3",
      organization: "",
      work_place: "",
    });
  }
  showWorkModal.value = true;
}

async function onWorkSubmit(event) {
  isWorkLoading.value = true;
  try {
    const res = await usePost({
      url: "lawyer/profile/work-experience",
      includeAuthHeader: true,
      body: event.data,
    });

    if (res.status && res.data && res.data.data) {
      toast.add({ description: "سابقه کاری با موفقیت افزوده شد.", color: "success" });
      workHistory.value.push(res.data.data);
      highlightNewItem("work", res.data.data.id);
      showWorkModal.value = false;
      Object.assign(workState, {
        position: "",
        experience_years: "1-3",
        organization: "",
        work_place: "",
      });
    } else {
      toast.add({ description: "خطا در افزودن سابقه کاری.", color: "error" });
    }
  } catch (err) {
    console.error("Work submit error:", err);
    toast.add({ description: "خطای سرور.", color: "error" });
  } finally {
    isWorkLoading.value = false;
  }
}

// Awards
function openAwardModal() {
  Object.assign(awardState, { award_name: "", issuing_organization: "", image: null });
  showAwardModal.value = true;
}

function handleAwardImageChange(e) {
  const file = e.target.files[0];
  if (file) {
    awardState.image = file;
  }
}

async function onAwardSubmit(event) {
  isAwardLoading.value = true;
  const fd = new FormData();
  fd.append("award_name", event.data.award_name);
  fd.append("issuing_organization", event.data.issuing_organization);
  fd.append("image", event.data.image);

  try {
    const res = await usePost({
      url: "lawyer/profile/awards",
      includeAuthHeader: true,
      body: fd,
    });

    if (res.status && res.data && res.data.data) {
      toast.add({ description: "افتخار با موفقیت افزوده شد.", color: "success" });
      awardsHistory.value.push(res.data.data);
      highlightNewItem("award", res.data.data.id);
      showAwardModal.value = false;
      Object.assign(awardState, {
        award_name: "",
        issuing_organization: "",
        image: null,
      });
    } else {
      toast.add({ description: "خطا در افزودن افتخار.", color: "error" });
    }
  } catch (err) {
    console.error("Award submit error:", err);
    toast.add({ description: "خطای سرور.", color: "error" });
  } finally {
    isAwardLoading.value = false;
  }
}

// Delete
function confirmDelete(type, item) {
  deleteTarget.value = { type, item };
  showDeleteConfirm.value = true;
}

async function executeDelete() {
  if (!deleteTarget.value) return;

  const { type, item } = deleteTarget.value;
  let url = "";
  let historyRef = null;

  switch (type) {
    case "education":
      url = `lawyer/profile/education/${item.id}`;
      historyRef = educationHistory;
      break;
    case "work":
      url = `lawyer/profile/work-experience/${item.id}`;
      historyRef = workHistory;
      break;
    case "award":
      url = `lawyer/profile/awards/${item.id}`;
      historyRef = awardsHistory;
      break;
  }

  isDeleting.value = true;
  try {
    const res = await useDelete({ url, includeAuthHeader: true });
    if (res.status) {
      historyRef.value = historyRef.value.filter((i) => i.id !== item.id);
      toast.add({ description: "آیتم با موفقیت حذف شد.", color: "success" });
      showDeleteConfirm.value = false;
    } else {
      toast.add({ description: res.message || "خطا در حذف آیتم.", color: "error" });
    }
  } catch (err) {
    console.error("Delete error:", err);
    toast.add({ description: "خطای سرور.", color: "error" });
  } finally {
    isDeleting.value = false;
    deleteTarget.value = null;
  }
}

// Image preview
function showImagePreview(url) {
  previewImageUrl.value = url;
  showImageModal.value = true;
}

// Init
fetchInitialData();
</script>

<style scoped>
@reference "tailwindcss";

.experience-section {
  @apply flex flex-col gap-6;
}

.experience-content {
  @apply flex flex-col gap-6;
}

.error-card {
  @apply flex flex-col items-center text-center p-8 bg-white rounded-xl border border-gray-100;
}

/* Data Table */
.data-table {
  @apply w-full text-sm;
}

.data-table th {
  @apply text-right font-medium text-gray-500 py-3 px-4 border-b border-gray-100;
}

.data-table td {
  @apply py-3 px-4 border-b border-gray-50 text-gray-700;
}

.data-table tr:hover td {
  @apply bg-gray-50;
}

.highlighted-row td {
  @apply bg-green-50;
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

/* Buttons */
.btn-sm-primary {
  @apply inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors;
}

.btn-icon-sm {
  @apply p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors;
}

/* Modal */
.modal-content {
  @apply bg-white rounded-xl w-full max-w-lg overflow-hidden;
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

.form-stack {
  @apply flex flex-col gap-4;
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

/* File Upload */
.file-upload-area {
  @apply relative border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors;
}

.file-input {
  @apply absolute inset-0 w-full h-full opacity-0 cursor-pointer;
}

.file-preview {
  @apply flex items-center gap-3;
}

.file-placeholder {
  @apply flex flex-col items-center gap-1;
}

/* Image Preview Modal */
.image-preview-modal {
  @apply relative bg-black rounded-xl overflow-hidden;
}

.image-close-btn {
  @apply absolute top-3 left-3 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors z-10;
}

.preview-image {
  @apply max-w-full max-h-[80vh] object-contain;
}

/* Mobile Cards (Binance Style) */
.mobile-cards {
  @apply divide-y divide-gray-100 bg-white rounded-xl border border-gray-100 overflow-hidden;
}

.mobile-card {
  @apply p-4 space-y-2;
}

.mobile-card:nth-child(odd) {
  @apply bg-gray-50/30;
}

.mobile-card.highlighted {
  @apply bg-green-50;
  animation: highlight-fade 2s ease-out;
}

.mobile-card-row {
  @apply flex items-center justify-between gap-4;
}

.mobile-card-label {
  @apply text-xs text-gray-900 font-medium shrink-0;
}

.mobile-card-value {
  @apply text-sm text-gray-500 text-left;
}

.mobile-card-actions {
  @apply flex items-center gap-2 justify-start pt-3 border-t border-gray-100 mt-2;
}
</style>
