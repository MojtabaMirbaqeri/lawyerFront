<template>
  <main class="legal-ask-page">
    <LegalHero
      title="ثبت سوال حقوقی"
      subtitle="سوال خود را مطرح کنید تا وکلای متخصص پاسخ دهند."
    />

    <div class="container py-8 lg:py-12">
      <div class="legal-ask-layout">
        <div v-if="!isLoggedIn" class="legal-ask-card legal-ask-card--notice">
          <div class="legal-ask-notice-icon">
            <UIcon name="lucide:log-in" class="size-10 text-amber-600" />
          </div>
          <h2 class="text-lg font-semibold text-amber-900">برای ثبت سوال باید وارد شوید</h2>
          <p class="mt-2 text-sm text-amber-800/90">با ورود یا ثبت‌نام می‌توانید سوال خود را ثبت کنید و پاسخ وکلای متخصص را ببینید.</p>
          <NuxtLink to="/register" class="legal-btn legal-btn--primary mt-6 inline-flex">
            <UIcon name="lucide:user" class="size-4" />
            ورود / ثبت‌نام
          </NuxtLink>
        </div>

        <form v-else class="legal-ask-card legal-ask-form" @submit.prevent="submit">
          <div class="legal-form-group">
            <label class="legal-label">دسته‌بندی</label>
            <select v-model="form.category_id" class="legal-input legal-select legal-select--full">
              <option :value="null">انتخاب دسته‌بندی</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div class="legal-form-group">
            <label class="legal-label">عنوان سوال <span class="text-red-500">*</span></label>
            <input
              v-model="form.title"
              type="text"
              class="legal-input"
              placeholder="عنوان سوال را به صورت خلاصه بنویسید"
              required
              minlength="10"
              maxlength="255"
            />
          </div>
          <div class="legal-form-group">
            <label class="legal-label">متن سوال <span class="text-red-500">*</span></label>
            <textarea
              v-model="form.body"
              class="legal-input legal-textarea"
              placeholder="شرح کامل سوال خود را بنویسید. از درج شماره تماس، کد ملی یا ایمیل در متن خودداری کنید."
              required
              minlength="20"
            />
            <p class="mt-2 flex items-center gap-2 text-xs text-amber-700">
              <UIcon name="lucide:info" class="size-3.5 shrink-0" />
              از درج اطلاعات شخصی (شماره تماس، کد ملی، ایمیل) در متن خودداری کنید.
            </p>
          </div>
          <div class="legal-form-group legal-form-group--row">
            <label class="legal-checkbox-wrap">
              <input v-model="form.is_anonymous" type="checkbox" class="legal-checkbox" />
              <span class="legal-checkbox-label">نمایش به صورت ناشناس</span>
            </label>
          </div>
          <div class="legal-form-group legal-form-group--row">
            <label class="legal-checkbox-wrap">
              <input v-model="form.allow_lawyer_dm" type="checkbox" class="legal-checkbox" />
              <span class="legal-checkbox-label">وکلا بتوانند با من تماس بگیرند</span>
            </label>
          </div>
          <div class="legal-disclaimer">
            <UIcon name="lucide:shield-alert" class="size-5 shrink-0 text-amber-600" />
            <p>پاسخ‌ها صرفاً اطلاع‌رسانی عمومی هستند و جایگزین مشاوره حقوقی نیستند.</p>
          </div>
          <button
            type="submit"
            :disabled="sending"
            class="legal-btn legal-btn--primary legal-btn--submit"
          >
            <UIcon v-if="sending" name="lucide:loader-2" class="size-5 animate-spin" />
            <UIcon v-else name="lucide:send" class="size-5" />
            {{ sending ? "در حال ارسال..." : "ثبت سوال" }}
          </button>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
const auth = useAuth();
const isLoggedIn = auth.isAuthenticated;
const categories = ref([]);
const form = ref({
  title: "",
  body: "",
  category_id: null,
  is_anonymous: false,
  allow_lawyer_dm: true,
});
const sending = ref(false);

async function loadCategories() {
  const res = await useGet({ url: "legal/categories", includeAuthHeader: false });
  const raw = res.data?.data ?? res.data;
  categories.value = Array.isArray(raw) ? raw : [];
}

async function submit() {
  if (sending.value) return;
  sending.value = true;
  const res = await usePost({
    url: "legal/questions",
    body: form.value,
    includeAuthHeader: true,
  });
  sending.value = false;
  if (res.data?.data) {
    const q = res.data.data;
    await navigateTo(`/legal/questions/${q.slug || q.id}`);
  }
}

useHead({ title: "ثبت سوال حقوقی | وکیل وکیل" });
await loadCategories();
</script>

<style scoped>
@reference "tailwindcss";

.legal-ask-page {
  @apply min-h-screen bg-[var(--surface-subtle)];
}

.legal-ask-layout {
  @apply max-w-2xl mx-auto;
}

.legal-ask-card {
  @apply rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm;
}

.legal-ask-card--notice {
  @apply text-center;
}

.legal-ask-notice-icon {
  @apply mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-amber-100;
}

.legal-ask-form {
  @apply space-y-6;
}

.legal-form-group {
  @apply flex flex-col gap-2;
}
.legal-form-group--row {
  @apply flex-row items-center;
}
.legal-label {
  @apply text-sm font-medium text-gray-700;
}
.legal-input {
  @apply w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-colors focus:border-[var(--accent)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20;
}
.legal-textarea {
  @apply min-h-[200px] resize-y;
}
.legal-select--full {
  @apply w-full;
}
.legal-select {
  @apply appearance-none bg-no-repeat;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-position: left 0.75rem center;
  background-size: 1.25rem;
  padding-left: 2.5rem;
}
.legal-checkbox-wrap {
  @apply inline-flex cursor-pointer items-center gap-3;
}
.legal-checkbox {
  @apply size-4 rounded border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)]/30;
}
.legal-checkbox-label {
  @apply text-sm text-gray-700;
}

.legal-disclaimer {
  @apply flex gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-800;
}

.legal-btn {
  @apply inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all;
}
.legal-btn--primary {
  @apply bg-[var(--accent)] text-white shadow-sm hover:bg-[var(--accent-dark)] hover:shadow-md disabled:opacity-60;
}
.legal-btn--submit {
  @apply w-full py-3.5 text-base font-semibold;
}
</style>
