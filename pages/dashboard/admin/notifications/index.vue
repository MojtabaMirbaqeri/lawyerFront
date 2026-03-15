<template>
  <div class="notifications-admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">مدیریت اعلان‌ها</h1>
        <p class="page-description">
          ارسال اعلان درون‌برنامه‌ای به کاربران عادی، وکلا یا ادمین‌ها.
        </p>
      </div>
    </div>

    <div class="card-dashboard">
      <div class="card-dashboard-body">
        <h2 class="section-title">ارسال اعلان</h2>
        <form class="space-y-4" @submit.prevent="submitSend">
          <div>
            <label class="form-label">مخاطبان (الزامی)</label>
            <div class="role-options">
              <label class="radio-label">
                <input v-model="form.role" type="radio" value="user" />
                <span>همه کاربران عادی</span>
              </label>
              <label class="radio-label">
                <input v-model="form.role" type="radio" value="lawyer" />
                <span>همه وکلا</span>
              </label>
              <label class="radio-label">
                <input v-model="form.role" type="radio" value="admin" />
                <span>همه ادمین‌ها</span>
              </label>
            </div>
          </div>
          <div>
            <label class="form-label">عنوان (الزامی)</label>
            <input
              v-model="form.title"
              type="text"
              class="input-field"
              placeholder="عنوان اعلان"
              maxlength="255"
              required
            />
          </div>
          <div>
            <label class="form-label">متن (الزامی)</label>
            <textarea
              v-model="form.message"
              rows="4"
              class="input-field"
              placeholder="متن اعلان"
              maxlength="2000"
              required
            />
            <span class="char-count">{{ form.message.length }} / 2000</span>
          </div>
          <div class="form-row">
            <div>
              <label class="form-label">دسته</label>
              <select v-model="form.category" class="input-field">
                <option value="system">سیستمی</option>
                <option value="admin">ادمین</option>
                <option value="booking">نوبت</option>
                <option value="lawyer">وکیل</option>
                <option value="payment">پرداخت</option>
              </select>
            </div>
            <div>
              <label class="form-label">سطح</label>
              <select v-model="form.severity" class="input-field">
                <option value="info">اطلاع</option>
                <option value="success">موفقیت</option>
                <option value="warning">هشدار</option>
                <option value="error">خطا</option>
              </select>
            </div>
          </div>
          <div>
            <label class="form-label">لینک عملیات (اختیاری)</label>
            <input
              v-model="form.action_url"
              type="text"
              class="input-field"
              placeholder="/dashboard/notifications یا آدرس کامل"
            />
          </div>
          <div v-if="lastSentCount !== null" class="success-message">
            <Icon name="lucide:check-circle" class="w-5 h-5 text-green-600" />
            <span>اعلان با موفقیت به {{ lastSentCount }} نفر ارسال شد.</span>
          </div>
          <div class="form-actions">
            <button
              type="submit"
              class="btn-primary"
              :disabled="loading || !form.title.trim() || !form.message.trim() || !form.role"
            >
              <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <span v-else>ارسال اعلان</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

useHead({
  title: "مدیریت اعلان‌ها | وکیلینجا",
});

const form = reactive({
  role: "user",
  title: "",
  message: "",
  category: "system",
  severity: "info",
  action_url: "",
});

const loading = ref(false);
const lastSentCount = ref(null);

async function submitSend() {
  if (!form.title.trim() || !form.message.trim() || !form.role) return;
  loading.value = true;
  lastSentCount.value = null;
  try {
    const res = await usePost({
      url: "admin/notifications/send",
      includeAuthHeader: true,
      body: {
        role: form.role,
        title: form.title.trim(),
        message: form.message.trim(),
        category: form.category,
        severity: form.severity,
        action_url: form.action_url?.trim() || undefined,
      },
    });
    if (res.status && res.data?.data !== undefined) {
      const count = res.data?.data?.recipient_count;
      lastSentCount.value = count ?? null;
      useToast().add({ title: "اعلان با موفقیت ارسال شد", color: "success" });
      form.title = "";
      form.message = "";
      form.action_url = "";
    } else {
      const msg = res.data?.message || "خطا در ارسال اعلان";
      useToast().add({ title: msg, color: "error" });
    }
  } catch (e) {
    useToast().add({ title: "خطا در ارسال اعلان", color: "error" });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
@reference "tailwindcss";

.notifications-admin-page {
  @apply space-y-6;
}

.page-header {
  @apply flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4;
}

.page-title {
  @apply text-xl font-bold text-gray-900;
}

.page-description {
  @apply text-sm text-gray-500 mt-1;
}

.section-title {
  @apply text-base font-semibold text-gray-800 mb-4;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.input-field {
  @apply w-full rounded-lg border border-gray-200 px-3 py-2 text-sm;
}

.role-options {
  @apply flex flex-wrap gap-4;
}

.radio-label {
  @apply inline-flex items-center gap-2 cursor-pointer text-sm text-gray-700;
}

.radio-label input {
  @apply rounded border-gray-300;
}

.form-row {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-4;
}

.char-count {
  @apply block text-xs text-gray-400 mt-1;
}

.success-message {
  @apply flex items-center gap-2 text-green-700 text-sm;
}

.form-actions {
  @apply pt-2;
}

.btn-primary {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed;
  background-color: var(--ui-primary);
  color: white;
}
</style>
