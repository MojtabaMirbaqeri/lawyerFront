<template>
  <section class="authentication-section">
    <!-- KYC Status Banner -->
    <div :class="['kyc-status-banner', kycStatus]">
      <div class="status-icon">
        <Icon :name="statusIcon" class="w-6 h-6" />
      </div>
      <div class="status-content">
        <h3 class="status-title">{{ statusTitle }}</h3>
        <p class="status-description">{{ statusDescription }}</p>
      </div>
      <div v-if="kycStatus === 'approved'" class="status-date">
        <span class="text-xs text-green-600">تایید شده</span>
      </div>
    </div>

    <!-- Approved State: Show Documents -->
    <div v-if="kycStatus === 'approved'" class="kyc-approved">
      <UICFormSection
        title="مدارک تایید شده"
        description="مدارک شما توسط تیم پشتیبانی بررسی و تایید شده است"
        icon="lucide:shield-check">
        <div class="approved-docs">
          <div class="doc-item">
            <div class="doc-icon">
              <Icon name="lucide:id-card" class="w-5 h-5" />
            </div>
            <div class="doc-info">
              <span class="doc-label">کد ملی</span>
              <span class="doc-value">{{ maskedNationalCode }}</span>
            </div>
            <Icon name="lucide:check-circle" class="w-5 h-5 text-green-500" />
          </div>
          <div class="doc-item">
            <div class="doc-icon">
              <Icon name="lucide:file-badge" class="w-5 h-5" />
            </div>
            <div class="doc-info">
              <span class="doc-label">شماره پروانه</span>
              <span class="doc-value">{{
                lawyerInformation?.lawyer_info?.license_number || "---"
              }}</span>
            </div>
            <Icon name="lucide:check-circle" class="w-5 h-5 text-green-500" />
          </div>
          <div class="doc-item">
            <div class="doc-icon">
              <Icon name="lucide:scale" class="w-5 h-5" />
            </div>
            <div class="doc-info">
              <span class="doc-label">پایه وکالت</span>
              <span class="doc-value">{{ lawyerBaseName }}</span>
            </div>
            <Icon name="lucide:check-circle" class="w-5 h-5 text-green-500" />
          </div>
        </div>

        <!-- View Documents Button -->
        <div class="view-docs-action">
          <button @click="showDocumentsModal = true" class="btn-secondary">
            <Icon name="lucide:eye" class="w-4 h-4" />
            مشاهده مدارک آپلود شده
          </button>
        </div>
      </UICFormSection>
    </div>

    <!-- Pending State -->
    <div v-else-if="kycStatus === 'pending'" class="kyc-pending">
      <UICFormSection
        title="در انتظار بررسی"
        description="مدارک شما در صف بررسی قرار دارد. این فرآیند معمولاً ۲۴ تا ۴۸ ساعت طول می‌کشد."
        icon="lucide:clock">
        <div class="pending-info">
          <div class="pending-timeline">
            <div class="timeline-item completed">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-title">ارسال مدارک</span>
                <span class="timeline-desc">مدارک شما با موفقیت ارسال شد</span>
              </div>
            </div>
            <div class="timeline-item active">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-title">در حال بررسی</span>
                <span class="timeline-desc">تیم پشتیبانی در حال بررسی مدارک است</span>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-title">تایید نهایی</span>
                <span class="timeline-desc">نتیجه از طریق پیامک اطلاع‌رسانی می‌شود</span>
              </div>
            </div>
          </div>

          <div class="pending-note">
            <Icon name="lucide:info" class="w-4 h-4" />
            <span>در صورت نیاز به اصلاح، از طریق پیامک با شما تماس می‌گیریم</span>
          </div>
        </div>
      </UICFormSection>
    </div>

    <!-- Rejected State -->
    <div v-else-if="kycStatus === 'rejected'" class="kyc-rejected">
      <UICFormSection
        title="نیاز به اصلاح"
        description="مدارک شما نیاز به بازبینی و اصلاح دارد"
        icon="lucide:alert-circle">
        <div class="rejection-info">
          <div class="rejection-reason">
            <Icon name="lucide:alert-triangle" class="w-5 h-5" />
            <div>
              <h4 class="rejection-title">دلیل رد:</h4>
              <p class="rejection-text">
                {{
                  rejectionReason ||
                  "کیفیت تصاویر نامناسب است. لطفاً تصاویر واضح‌تری ارسال کنید."
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- Resubmit Form -->
        <div class="resubmit-form">
          <h4 class="resubmit-title">ارسال مجدد مدارک</h4>
          <UForm :schema="schema" :state="state" @submit="onSubmit">
            <div class="form-grid-2">
              <div class="form-field">
                <UICInput name="lawyerType" label="پایه وکالت" required>
                  <template #input>
                    <UICSelect v-model="state.lawyerType" :items="mappedTypes" />
                  </template>
                </UICInput>
              </div>
              <div class="form-field">
                <UICInput
                  v-model="state.licenseNumber"
                  name="licenseNumber"
                  label="شماره پروانه"
                  placeholder="شماره پروانه وکالت"
                  required />
              </div>
              <div class="form-field">
                <UICInput
                  v-model="state.nationalCode"
                  name="nationalCode"
                  label="کد ملی"
                  placeholder="۱۰ رقم"
                  dir="ltr"
                  required />
              </div>
              <div class="form-field md:col-span-2">
                <label class="form-label"
                  >تصویر کارت ملی <span class="required-star">*</span></label
                >
                <FileUploadArea v-model="state.IDCardPic" accept="image/*" />
              </div>
              <div class="form-field md:col-span-2">
                <label class="form-label"
                  >تصویر پروانه وکالت <span class="required-star">*</span></label
                >
                <FileUploadArea v-model="state.licensePic" accept="image/*" />
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="isLoading">
                <Icon
                  v-if="isLoading"
                  name="lucide:loader-2"
                  class="w-4 h-4 animate-spin" />
                <Icon v-else name="lucide:send" class="w-4 h-4" />
                {{ isLoading ? "در حال ارسال..." : "ارسال مجدد مدارک" }}
              </button>
            </div>
          </UForm>
        </div>
      </UICFormSection>
    </div>

    <!-- Not Submitted State: Show Form -->
    <div v-else class="kyc-form">
      <UICFormSection
        title="احراز هویت"
        description="برای فعال‌سازی پروفایل و دریافت موکل، مدارک خود را ارسال کنید"
        icon="lucide:shield">
        <UForm :schema="schema" :state="state" @submit="onSubmit">
          <div class="form-grid-2">
            <!-- پایه وکیل -->
            <div class="form-field">
              <UICInput name="lawyerType" label="پایه وکالت" required>
                <template #input>
                  <UICSelect v-model="state.lawyerType" :items="mappedTypes" />
                </template>
              </UICInput>
            </div>

            <!-- شماره پروانه -->
            <div class="form-field">
              <UICInput
                v-model="state.licenseNumber"
                name="licenseNumber"
                label="شماره پروانه"
                placeholder="شماره پروانه وکالت"
                required />
            </div>

            <!-- کد ملی -->
            <div class="form-field md:col-span-2">
              <UICInput
                v-model="state.nationalCode"
                name="nationalCode"
                label="کد ملی"
                placeholder="۱۰ رقم"
                dir="ltr"
                class="max-w-xs"
                required />
            </div>

            <!-- تصویر کارت ملی -->
            <div class="form-field">
              <label class="form-label"
                >تصویر کارت ملی <span class="required-star">*</span></label
              >
              <div class="file-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  @change="(e) => handleFileChange(e, 'IDCardPic')"
                  class="file-input" />
                <div v-if="state.IDCardPic" class="file-preview">
                  <img v-if="idCardPreview" :src="idCardPreview" class="preview-image" />
                  <div class="preview-info">
                    <span class="text-sm text-gray-700">{{ state.IDCardPic.name }}</span>
                    <span class="text-xs text-gray-400">{{
                      formatFileSize(state.IDCardPic.size)
                    }}</span>
                  </div>
                  <button
                    type="button"
                    @click="
                      state.IDCardPic = null;
                      idCardPreview = null;
                    "
                    class="btn-icon-sm text-red-500">
                    <Icon name="lucide:x" class="w-4 h-4" />
                  </button>
                </div>
                <div v-else class="file-placeholder">
                  <Icon name="lucide:upload" class="w-8 h-8 text-gray-400" />
                  <span class="text-sm text-gray-600">تصویر را آپلود کنید</span>
                  <span class="text-xs text-gray-400">حداکثر ۵ مگابایت</span>
                </div>
              </div>
            </div>

            <!-- تصویر پروانه -->
            <div class="form-field">
              <label class="form-label"
                >تصویر پروانه وکالت <span class="required-star">*</span></label
              >
              <div class="file-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  @change="(e) => handleFileChange(e, 'licensePic')"
                  class="file-input" />
                <div v-if="state.licensePic" class="file-preview">
                  <img
                    v-if="licensePreview"
                    :src="licensePreview"
                    class="preview-image" />
                  <div class="preview-info">
                    <span class="text-sm text-gray-700">{{ state.licensePic.name }}</span>
                    <span class="text-xs text-gray-400">{{
                      formatFileSize(state.licensePic.size)
                    }}</span>
                  </div>
                  <button
                    type="button"
                    @click="
                      state.licensePic = null;
                      licensePreview = null;
                    "
                    class="btn-icon-sm text-red-500">
                    <Icon name="lucide:x" class="w-4 h-4" />
                  </button>
                </div>
                <div v-else class="file-placeholder">
                  <Icon name="lucide:upload" class="w-8 h-8 text-gray-400" />
                  <span class="text-sm text-gray-600">تصویر را آپلود کنید</span>
                  <span class="text-xs text-gray-400">حداکثر ۵ مگابایت</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="isLoading">
              <Icon
                v-if="isLoading"
                name="lucide:loader-2"
                class="w-4 h-4 animate-spin" />
              <Icon v-else name="lucide:send" class="w-4 h-4" />
              {{ isLoading ? "در حال ارسال..." : "ارسال برای بررسی" }}
            </button>
          </div>
        </UForm>
      </UICFormSection>
    </div>

    <!-- Documents Preview Modal -->
    <UModal v-model:open="showDocumentsModal" :title="'مدارک آپلود شده'">
      <template #body>
        <div class="modal-content">
       
          <div class="modal-body">
            <div class="docs-grid">
              <div class="doc-preview-card">
                <h4 class="doc-preview-title">تصویر کارت ملی</h4>
                <div class="doc-preview-image">
                  <NuxtImg
                    v-if="lawyerData?.lawyer_info?.national_card_image"
                    :src="useImageUrl(lawyerData.lawyer_info.national_card_image)"
                    alt="کارت ملی"
                    width="400"
                    height="250"
                    loading="lazy" />
                  <div v-else class="no-image">
                    <Icon name="lucide:image-off" class="w-8 h-8 text-gray-300" />
                  </div>
                </div>
              </div>
              <div class="doc-preview-card">
                <h4 class="doc-preview-title">تصویر پروانه</h4>
                <div class="doc-preview-image">
                  <NuxtImg
                    v-if="lawyerData?.lawyer_info?.license_image"
                    :src="useImageUrl(lawyerData.lawyer_info.license_image)"
                    alt="پروانه"
                    width="400"
                    height="250"
                    loading="lazy" />
                  <div v-else class="no-image">
                    <Icon name="lucide:image-off" class="w-8 h-8 text-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </section>
</template>

<script setup>
import { object, string, mixed } from "yup";

const props = defineProps({
  lawyerInformation: { type: Object, required: true },
});

const filtersStore = useFiltersStore();
const authStore = useAuthStore();
const toast = useToast();

// Handle both nested {data: {...}} and flat {...} structures
const lawyerData = computed(() => {
  const info = props.lawyerInformation;
  return info?.data || info;
});

// State
const isLoading = ref(false);
const showDocumentsModal = ref(false);
const idCardPreview = ref(null);
const licensePreview = ref(null);
const myKycRequest = ref(null);

// وضعیت درخواست احراز هویت از API (register-lawyer/my-request برای وکیل موجود)
async function fetchMyKycRequest() {
  if (!authStore.user?.lawyer_id) return;
  try {
    const res = await useGet({
      url: "register-lawyer/my-request",
      includeAuthHeader: true,
    }, false);
    if (res?.data?.data != null) {
      myKycRequest.value = res.data.data;
    } else {
      myKycRequest.value = null;
    }
  } catch {
    myKycRequest.value = null;
  }
}

// Computed KYC Status (از user.lawyer_kyc و درخواست ثبت‌نام/کی‌و‌سی برای pending و rejected)
const kycStatus = computed(() => {
  const lawyer = lawyerData.value?.lawyer_info;
  const user = authStore.user;

  if (user?.lawyer_kyc || lawyer?.kyc_approved) return "approved";
  if (myKycRequest.value?.status === "pending" || lawyer?.kyc_submitted || lawyer?.kyc_pending) return "pending";
  if (myKycRequest.value?.status === "rejected" || lawyer?.kyc_rejected) return "rejected";
  return "not_submitted";
});

const statusIcon = computed(() => {
  const icons = {
    approved: "lucide:shield-check",
    pending: "lucide:clock",
    rejected: "lucide:alert-circle",
    not_submitted: "lucide:shield",
  };
  return icons[kycStatus.value];
});

const statusTitle = computed(() => {
  const titles = {
    approved: "احراز هویت تایید شده",
    pending: "در انتظار بررسی",
    rejected: "نیاز به اصلاح مدارک",
    not_submitted: "احراز هویت نشده",
  };
  return titles[kycStatus.value];
});

const statusDescription = computed(() => {
  const descriptions = {
    approved: "مدارک شما تایید شده و پروفایل شما فعال است",
    pending: "مدارک شما در صف بررسی قرار دارد",
    rejected: "لطفاً مدارک خود را اصلاح و مجدداً ارسال کنید",
    not_submitted: "برای فعال‌سازی پروفایل، مدارک خود را ارسال کنید",
  };
  return descriptions[kycStatus.value];
});

const rejectionReason = computed(() => {
  return myKycRequest.value?.rejection_reason || lawyerData.value?.lawyer_info?.kyc_rejection_reason || null;
});

const maskedNationalCode = computed(() => {
  const code = lawyerData.value?.lawyer_info?.national_code || "";
  if (code.length < 4) return "***";
  return code.slice(0, 3) + "****" + code.slice(-3);
});

const lawyerBaseName = computed(() => {
  const baseId = lawyerData.value?.lawyer_info?.base;
  const type = filtersStore.lawyerTypes.find((t) => t.id == baseId);
  return type?.title || "نامشخص";
});

// Form
const mappedTypes = [...filtersStore.lawyerTypes]
  .map((type) => ({ id: type.id, label: type.title }))
  .filter((t) => t.id != 0);

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const state = reactive({
  lawyerType: mappedTypes.length ? mappedTypes[0].id : "",
  licenseNumber: "",
  nationalCode: "",
  IDCardPic: null,
  licensePic: null,
});

onMounted(() => {
  fetchMyKycRequest();
});

const schema = object({
  lawyerType: string().required("پایه وکیل الزامی است"),
  licenseNumber: string()
    .required("شماره پروانه الزامی است")
    .min(4, "حداقل 4 کاراکتر")
    .max(20, "حداکثر 20 کاراکتر"),
  nationalCode: string()
    .required("کد ملی الزامی است")
    .matches(/^\d{10}$/, "کد ملی باید ۱۰ رقم باشد"),
  IDCardPic: mixed()
    .required("تصویر کارت ملی الزامی است")
    .test(
      "fileSize",
      "حجم فایل نباید بیشتر از ۵ مگابایت باشد",
      (file) => file && file.size <= MAX_FILE_SIZE,
    ),
  licensePic: mixed()
    .required("تصویر پروانه الزامی است")
    .test(
      "fileSize",
      "حجم فایل نباید بیشتر از ۵ مگابایت باشد",
      (file) => file && file.size <= MAX_FILE_SIZE,
    ),
});

// Methods
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function handleFileChange(e, field) {
  const file = e.target.files[0];
  if (!file) return;

  state[field] = file;

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    if (field === "IDCardPic") {
      idCardPreview.value = e.target.result;
    } else {
      licensePreview.value = e.target.result;
    }
  };
  reader.readAsDataURL(file);
}

const onSubmit = async (e) => {
  const payload = e?.data ?? { ...state };

  const fd = new FormData();
  fd.append("base", String(payload.lawyerType));
  fd.append("license_number", payload.licenseNumber);
  fd.append("national_code", payload.nationalCode);
  if (payload.IDCardPic) fd.append("national_card_image", payload.IDCardPic);
  if (payload.licensePic) fd.append("license_image", payload.licensePic);

  isLoading.value = true;
  try {
    const res = await usePost({
      url: "lawyers/kyc",
      includeAuthHeader: true,
      body: fd,
    });

    if (res.status || res.statusCode === 200 || res.statusCode === 201) {
      toast.add({
        description:
          "اطلاعات احراز هویت با موفقیت ارسال شد. نتیجه بررسی از طریق پیامک اطلاع‌رسانی می‌شود.",
        color: "success",
      });
      // درخواست به‌صورت pending ذخیره شده؛ پس از تایید ادمین lawyer_kyc به‌روز می‌شود
      await fetchMyKycRequest();
    } else {
      toast.add({
        description: "ارسال اطلاعات احراز هویت با خطا مواجه شد",
        color: "error",
      });
    }
  } catch (err) {
    console.error("submit error:", err);
    const msg = err?.data?.message || err?.message || "خطا در ارسال اطلاعات";
    toast.add({ description: msg, color: "error" });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@reference "tailwindcss";

.authentication-section {
  @apply flex flex-col gap-6;
}

/* KYC Status Banner */
.kyc-status-banner {
  @apply flex items-center gap-4 p-4 rounded-xl border;
}

.kyc-status-banner.approved {
  @apply bg-green-50 border-green-200;
}

.kyc-status-banner.approved .status-icon {
  @apply bg-green-100 text-green-600;
}

.kyc-status-banner.pending {
  @apply bg-amber-50 border-amber-200;
}

.kyc-status-banner.pending .status-icon {
  @apply bg-amber-100 text-amber-600;
}

.kyc-status-banner.rejected {
  @apply bg-red-50 border-red-200;
}

.kyc-status-banner.rejected .status-icon {
  @apply bg-red-100 text-red-600;
}

.kyc-status-banner.not_submitted {
  @apply bg-gray-50 border-gray-200;
}

.kyc-status-banner.not_submitted .status-icon {
  @apply bg-gray-100 text-gray-600;
}

.status-icon {
  @apply w-12 h-12 rounded-xl flex items-center justify-center shrink-0;
}

.status-content {
  @apply flex-1;
}

.status-title {
  @apply text-base font-semibold text-gray-900;
}

.status-description {
  @apply text-sm text-gray-600 mt-0.5;
}

/* Approved Docs */
.approved-docs {
  @apply space-y-3;
}

.doc-item {
  @apply flex items-center gap-4 p-3 bg-gray-50 rounded-lg;
}

.doc-icon {
  @apply w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-500;
}

.doc-info {
  @apply flex-1;
}

.doc-label {
  @apply block text-xs text-gray-500;
}

.doc-value {
  @apply block text-sm font-medium text-gray-900;
}

.view-docs-action {
  @apply mt-4 pt-4 border-t border-gray-100;
}

/* Pending Timeline */
.pending-timeline {
  @apply space-y-4;
}

.timeline-item {
  @apply flex gap-4;
}

.timeline-dot {
  @apply w-3 h-3 rounded-full bg-gray-200 mt-1 shrink-0;
}

.timeline-item.completed .timeline-dot {
  @apply bg-green-500;
}

.timeline-item.active .timeline-dot {
  @apply bg-amber-500;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.timeline-content {
  @apply flex flex-col;
}

.timeline-title {
  @apply text-sm font-medium text-gray-900;
}

.timeline-desc {
  @apply text-xs text-gray-500;
}

.pending-note {
  @apply flex items-center gap-2 mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700;
}

/* Rejection Info */
.rejection-reason {
  @apply flex items-start gap-3 p-4 bg-red-50 rounded-lg text-red-700;
}

.rejection-title {
  @apply font-medium text-sm;
}

.rejection-text {
  @apply text-sm mt-1;
}

.resubmit-form {
  @apply mt-6 pt-6 border-t border-gray-100;
}

.resubmit-title {
  @apply text-base font-semibold text-gray-900 mb-4;
}

/* Form */
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
  @apply flex items-center gap-1 text-xs text-gray-500;
}

.form-actions {
  @apply mt-6 pt-6 border-t border-gray-100;
}

/* File Upload */
.file-upload-area {
  @apply relative border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-400 transition-colors;
}

.file-input {
  @apply absolute inset-0 w-full h-full opacity-0 cursor-pointer;
}

.file-preview {
  @apply flex items-center gap-3;
}

.preview-image {
  @apply w-16 h-16 object-cover rounded-lg;
}

.preview-info {
  @apply flex-1 text-right;
}

.file-placeholder {
  @apply flex flex-col items-center gap-1 py-4;
}

/* Modal */
.modal-content {
  @apply bg-white rounded-xl w-full max-w-2xl overflow-hidden;
}

.modal-header {
  @apply flex items-center justify-between px-6 py-4 border-b border-gray-100;
}

.modal-title {
  @apply text-lg font-semibold text-gray-900;
}

.modal-body {
  @apply p-6 overflow-y-auto!;
}

.docs-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.doc-preview-card {
  @apply border border-gray-100 rounded-xl overflow-hidden;
}

.doc-preview-title {
  @apply text-sm font-medium text-gray-700 p-3 bg-gray-50 border-b border-gray-100;
}

.doc-preview-image {
  @apply aspect-video bg-gray-100 flex items-center justify-center;
}

.doc-preview-image img {
  @apply w-full h-full object-contain;
}

.no-image {
  @apply flex items-center justify-center h-full;
}

.btn-icon-sm {
  @apply p-1.5 rounded-lg hover:bg-gray-100 transition-colors;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .kyc-status-banner {
    @apply flex-col text-center gap-3 p-3;
  }

  .status-icon {
    @apply w-10 h-10;
  }

  .status-title {
    @apply text-sm;
  }

  .status-description {
    @apply text-xs;
  }

  .form-grid-2 {
    @apply grid-cols-1 gap-3;
  }

  .form-actions {
    @apply mt-4 pt-4;
  }

  .form-actions button {
    @apply w-full justify-center;
  }

  .file-upload-area {
    @apply p-3;
  }

  .file-placeholder {
    @apply py-3;
  }

  .file-placeholder span {
    @apply text-xs;
  }

  .doc-item {
    @apply p-2 gap-3;
  }

  .doc-icon {
    @apply w-8 h-8;
  }

  .pending-timeline {
    @apply space-y-3;
  }

  .timeline-title {
    @apply text-xs;
  }

  .timeline-desc {
    @apply text-[10px];
  }

  .modal-body {
    @apply p-4;
  }

  .modal-header {
    @apply px-4 py-3;
  }

  .modal-title {
    @apply text-base;
  }
}
</style>
