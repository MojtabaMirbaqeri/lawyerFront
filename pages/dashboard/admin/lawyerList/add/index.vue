<template>
  <div class="add-lawyer-page">
    <!-- Page Header -->
    <div class="page-header mb-6">
      <div class="flex items-center gap-3">
        <button @click="navigateTo('/dashboard/admin/lawyerlist')" class="btn-icon">
          <Icon name="lucide:arrow-right" class="w-5 h-5" />
        </button>
        <div>
          <h1 class="page-title">افزودن وکیل جدید</h1>
          <p class="page-description">اطلاعات وکیل را وارد کنید</p>
        </div>
      </div>
    </div>

    <!-- Stepper -->
    <div class="stepper-container">
      <div class="stepper">
        <div
          class="step"
          :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
          <div class="step-number">
            <Icon v-if="currentStep > 1" name="lucide:check" class="w-4 h-4" />
            <span v-else>۱</span>
          </div>
          <span class="step-label">اطلاعات پایه</span>
        </div>
        <div class="step-line" :class="{ active: currentStep > 1 }"></div>
        <div
          class="step"
          :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
          <div class="step-number">
            <Icon v-if="currentStep > 2" name="lucide:check" class="w-4 h-4" />
            <span v-else>۲</span>
          </div>
          <span class="step-label">تخصص و تحصیلات</span>
        </div>
        <div class="step-line" :class="{ active: currentStep > 2 }"></div>
        <div class="step" :class="{ active: currentStep >= 3 }">
          <div class="step-number">۳</div>
          <span class="step-label">تایید نهایی</span>
        </div>
      </div>
    </div>

    <!-- Form Card -->
    <div class="card-dashboard">
      <div class="card-dashboard-body">
        <UForm :schema="schema" :state="state" @submit="onSubmit" class="form-container">
          <!-- Step 1: Basic Info -->
          <div v-show="currentStep === 1" class="step-content">
            <h3 class="step-title">اطلاعات پایه</h3>
            <p class="step-description">اطلاعات اولیه وکیل را وارد کنید</p>

            <div class="form-grid">
              <div class="form-group">
                <label class="label-dashboard"
                  >نام <span class="text-red-500">*</span></label
                >
                <input
                  v-model="state.name"
                  type="text"
                  class="input-dashboard"
                  placeholder="نام وکیل" />
              </div>

              <div class="form-group">
                <label class="label-dashboard"
                  >نام خانوادگی <span class="text-red-500">*</span></label
                >
                <input
                  v-model="state.lastName"
                  type="text"
                  class="input-dashboard"
                  placeholder="نام خانوادگی" />
              </div>

              <div class="form-group">
                <label class="label-dashboard"
                  >شماره موبایل <span class="text-red-500">*</span></label
                >
                <input
                  v-model="state.phone"
                  type="tel"
                  class="input-dashboard ltr-force text-left!"
                  placeholder="09123456789"
                  maxlength="11"
                  @input="filterDigits" />
              </div>

              <div class="form-group">
                <label class="label-dashboard">ایمیل</label>
                <input
                  v-model="state.email"
                  type="email"
                  class="input-dashboard ltr-force text-left!"
                  placeholder="email@example.com" />
              </div>
            </div>
          </div>

          <!-- Step 2: Professional Info -->
          <div v-show="currentStep === 2" class="step-content">
            <h3 class="step-title">تخصص و تحصیلات</h3>
            <p class="step-description">اطلاعات حرفه‌ای وکیل را وارد کنید</p>

            <div class="form-grid">
              <div class="form-group">
                <label class="label-dashboard"
                  >پایه وکالت <span class="text-red-500">*</span></label
                >
                <UICSelect
                  v-model="baseModel"
                  :items="bases"
                  placeholder="انتخاب پایه وکالت" />
              </div>

              <div class="form-group">
                <label class="label-dashboard"
                  >مدرک تحصیلی <span class="text-red-500">*</span></label
                >
                <UICSelect
                  v-model="educationModel"
                  :items="education"
                  placeholder="انتخاب مدرک تحصیلی" />
              </div>

              <div class="form-group lg:col-span-2">
                <label class="label-dashboard">درباره وکیل</label>
                <textarea
                  v-model="state.about"
                  class="input-dashboard h-24! resize-none"
                  placeholder="توضیحات کوتاه درباره سوابق و تخصص‌های وکیل..."></textarea>
              </div>
            </div>
          </div>

          <!-- Step 3: Preview & Confirm -->
          <div v-show="currentStep === 3" class="step-content">
            <h3 class="step-title">تایید نهایی</h3>
            <p class="step-description">اطلاعات وارد شده را بررسی و تایید کنید</p>

            <div class="preview-card">
              <div class="preview-header">
                <div class="preview-avatar">
                  <Icon name="lucide:user" class="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h4 class="preview-name">{{ state.name }} {{ state.lastName }}</h4>
                  <span class="preview-badge">{{ getBaseLabel }}</span>
                </div>
              </div>

              <div class="preview-details">
                <div class="preview-item">
                  <Icon name="lucide:phone" class="w-4 h-4 text-gray-400" />
                  <span>{{ state.phone || "-" }}</span>
                </div>
                <div class="preview-item">
                  <Icon name="lucide:mail" class="w-4 h-4 text-gray-400" />
                  <span>{{ state.email || "-" }}</span>
                </div>
                <div class="preview-item">
                  <Icon name="lucide:graduation-cap" class="w-4 h-4 text-gray-400" />
                  <span>{{ getEducationLabel }}</span>
                </div>
              </div>

              <div v-if="state.about" class="preview-about">
                <p>{{ state.about }}</p>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="form-actions">
            <button
              v-if="currentStep > 1"
              type="button"
              @click="prevStep"
              class="btn-secondary">
              <Icon name="lucide:arrow-right" class="w-4 h-4" />
              مرحله قبل
            </button>
            <div class="flex-1"></div>
            <button
              v-if="currentStep < 3"
              type="button"
              @click="nextStep"
              class="btn-primary"
              :disabled="!canProceed">
              مرحله بعد
              <Icon name="lucide:arrow-left" class="w-4 h-4" />
            </button>
            <button v-else type="submit" class="btn-primary" :disabled="isLoading">
              <Icon
                v-if="isLoading"
                name="lucide:loader-2"
                class="w-4 h-4 animate-spin" />
              <Icon v-else name="lucide:check" class="w-4 h-4" />
              ثبت وکیل
            </button>
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { object, string } from "yup";
import type { InferType } from "yup";
import { ref, reactive, computed } from "vue";

useHead({
  title: "افزودن وکیل جدید | وکیلینجا",
});

// گرفتن اطلاعات اولیه
const filtersStore = useFiltersStore();
const isLoading = ref(false);
const currentStep = ref(1);

// گرفتن اطلاعات اولیه
const bases = filtersStore.lawyerTypes.map((type) => ({
  id: type.id,
  label: type.title,
}));

const baseModel = ref(bases[0]?.id);

const education = ref([
  { id: 1, label: "کارشناسی" },
  { id: 2, label: "کارشناسی ارشد" },
  { id: 3, label: "دکتری تخصصی" },
  { id: 4, label: "فوق دکتری" },
]);

const educationModel = ref(education.value[0].id);

const state = reactive({
  phone: "",
  name: "",
  lastName: "",
  email: "",
  about: "",
});

// Labels for preview
const getBaseLabel = computed(() => {
  return bases.find((b) => b.id === baseModel.value)?.label || "";
});

const getEducationLabel = computed(() => {
  return education.value.find((e) => e.id === educationModel.value)?.label || "";
});

// Validation
const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return state.name && state.lastName && state.phone?.length === 11;
  }
  if (currentStep.value === 2) {
    return baseModel.value && educationModel.value;
  }
  return true;
});

// Navigation
const nextStep = () => {
  if (currentStep.value < 3 && canProceed.value) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

// Schema
const schema = object({
  phone: string()
    .required("لطفا شماره موبایل را وارد کنید")
    .matches(
      /^(098|0098|98|\+98|0)?9(0[0-5]|[1 3]\d|2[0-3]|9[0-9]|41)\d{7}$/g,
      "شماره موبایل معتبر نیست",
    )
    .length(11, "شماره موبایل باید دقیقاً 11 رقم باشد"),
  name: string().required("نام خود را وارد کنید").max(20, "حداکثر 20 کاراکتر مجاز است"),
  lastName: string()
    .required("نام خانوادگی خود را وارد کنید")
    .max(25, "حداکثر 25 کاراکتر مجاز است"),
});

// Filter digits
function filterDigits(e: Event) {
  const target = e.target as HTMLInputElement;
  target.value = target.value.replace(/\D/g, "");
  state.phone = target.value.slice(0, 11);
}

// Submit
const onSubmit = async () => {
  isLoading.value = true;

  const body = {
    phone: state.phone,
    name: state.name,
    family: state.lastName,
    base: baseModel.value,
    email: state.email || "",
    about: state.about || "",
    education: education.value.find((e) => e.id === educationModel.value)?.label || "",
  };

  const res = await usePost({
    url: `lawyers`,
    includeAuthHeader: true,
    body: body,
  });

  if (res.statusCode === 201 || res.statusCode === 200) {
    useToast().add({ title: "وکیل با موفقیت ایجاد شد", color: "success" });
    navigateTo("/dashboard/admin/lawyerlist");
  } else if (res.statusCode === 422) {
    useToast().add({ title: "این شماره تلفن قبلا ثبت شده است", color: "error" });
    currentStep.value = 1;
  } else {
    useToast().add({
      title: "مشکلی رخ داده است. لطفا مجددا امتحان کنید",
      color: "error",
    });
  }

  isLoading.value = false;
};
</script>

<style scoped>
@reference "tailwindcss";

.add-lawyer-page {
  @apply max-w-3xl mx-auto;
}

.stepper-container {
  @apply mb-8;
}

.form-container {
  @apply space-y-8;
}

.step-content {
  @apply space-y-6;
}

.step-title {
  @apply text-lg font-semibold text-gray-900;
}

.step-description {
  @apply text-sm text-gray-500 -mt-4;
}

.form-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-5;
}

.form-group {
  @apply space-y-1.5;
}

/* Preview Card */
.preview-card {
  @apply bg-gray-50 rounded-xl p-6 border border-gray-200;
}

.preview-header {
  @apply flex items-center gap-4 pb-4 border-b border-gray-200 mb-4;
}

.preview-avatar {
  @apply w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center;
}

.preview-name {
  @apply text-lg font-semibold text-gray-900;
}

.preview-badge {
  @apply inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mt-1;
}

.preview-details {
  @apply grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4;
}

.preview-item {
  @apply flex items-center gap-2 text-sm text-gray-600;
}

.preview-about {
  @apply pt-4 border-t border-gray-200 text-sm text-gray-600;
}

/* Form Actions */
.form-actions {
  @apply flex items-center gap-3 pt-6 border-t border-gray-100;
}

.btn-primary,
.btn-secondary {
  @apply inline-flex items-center gap-2;
}

.btn-primary:disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>
