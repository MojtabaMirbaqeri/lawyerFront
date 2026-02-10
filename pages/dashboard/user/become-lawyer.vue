<template>
  <section>
    <h1 class="text-xl font-bold text-[#1e3a5f] mb-6">ثبت‌نام به‌عنوان وکیل</h1>

    <!-- Already lawyer -->
    <UAlert
      v-if="authStore.user?.user_type === 'lawyer' && authStore.user?.lawyer_id"
      title="شما وکیل هستید"
      description="حساب شما به‌عنوان وکیل تأیید شده است."
      color="success"
      icon="lucide:check-circle"
      class="mb-6"
    />

    <!-- Pending request -->
    <UAlert
      v-else-if="myRequest && myRequest.status === 'pending'"
      title="در انتظار تأیید"
      description="درخواست شما ثبت شده و در حال بررسی توسط ادمین است. پس از تأیید به تمام امکانات وکیل دسترسی خواهید داشت."
      color="warning"
      variant="subtle"
      icon="lucide:shield-alert"
      class="mb-6"
    />

    <!-- Rejected request -->
    <UAlert
      v-else-if="myRequest && myRequest.status === 'rejected'"
      title="درخواست رد شده"
      :description="myRequest.rejection_reason ? `دلیل: ${myRequest.rejection_reason}` : 'درخواست شما توسط ادمین رد شده است. در صورت تمایل می‌توانید مجدداً درخواست دهید.'"
      color="error"
      variant="subtle"
      icon="lucide:alert-circle"
      class="mb-6"
    />

    <!-- Form: show for regular user when no pending request, or when last request was rejected (can resubmit) -->
    <div
      v-if="
        authStore.user?.user_type === 'user' &&
        (!myRequest || myRequest.status === 'rejected')
      "
      class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <p class="text-gray-600 mb-4">
        با پر کردن فرم زیر درخواست خود را به‌عنوان وکیل ثبت کنید. پس از بررسی توسط ادمین، وضعیت شما به‌روزرسانی می‌شود.
      </p>

      <!-- Read-only user info -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <span class="text-sm text-gray-500">نام و نام خانوادگی</span>
          <p class="font-medium">{{ authStore.user?.name }} {{ authStore.user?.family }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">شماره موبایل</span>
          <p class="font-medium">{{ authStore.user?.phone }}</p>
        </div>
      </div>

      <UForm :schema="schema" :state="state" class="w-full space-y-5" @submit="onSubmit">
        <UICInput v-model="state.nationalCode" name="nationalCode" label="کد ملی" />
        <UICInput v-model="state.licenseNumber" name="licenseNumber" label="شماره پروانه وکالت" />
        <UICInput name="base" label="پایه">
          <template #input>
            <UICSelect v-model="state.base" :items="mappedTypes" />
          </template>
        </UICInput>

        <UICInput v-model="state.nationalCardImage" type="file" name="nationalCardImage" label="تصویر کارت ملی">
          <template #input>
            <UFileUpload
              v-model="state.nationalCardImage"
              icon="i-lucide-image"
              label="تصویر کارت ملی خود را آپلود کنید"
              description="حداکثر ۲ مگابایت (jpeg, png, jpg)"
              layout="list"
              accept="image/*"
              :ui="{ base: 'border-black/30', wrapper: 'py-2' }"
            />
          </template>
        </UICInput>

        <UICInput v-model="state.licenseImage" type="file" name="licenseImage" label="تصویر پروانه وکالت">
          <template #input>
            <UFileUpload
              v-model="state.licenseImage"
              icon="i-lucide-image"
              label="تصویر پروانه وکالت خود را آپلود کنید"
              description="حداکثر ۲ مگابایت (jpeg, png, jpg)"
              layout="list"
              accept="image/*"
              :ui="{ base: 'border-black/30', wrapper: 'py-2' }"
            />
          </template>
        </UICInput>

        <UICSecondaryBtn
          type="submit"
          :disabled="loading"
          class="w-full rounded-xl h-12 text-base font-semibold bg-[#1e3a5f] hover:opacity-90 transition"
        >
          ارسال درخواست
        </UICSecondaryBtn>
      </UForm>
    </div>

    <!-- Lawyer pending (no lawyer_id yet): show same pending message, no form -->
    <div v-else-if="authStore.user?.user_type === 'lawyer' && !authStore.user?.lawyer_id" class="rounded-xl border border-amber-200 bg-amber-50 p-6">
      <p class="text-amber-800 font-medium">درخواست شما در انتظار تأیید است.</p>
      <p class="text-amber-700 text-sm mt-2">پس از تأیید توسط ادمین به تمام امکانات دسترسی خواهید داشت.</p>
    </div>
  </section>
</template>

<script setup>
import * as yup from "yup";

const authStore = useAuthStore();
const filtersStore = useFiltersStore();

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB per backend validation

const mappedTypes = computed(() => {
  const types = [...(filtersStore.lawyerTypes || [])]
    .map((type) => ({ id: type.id, label: type.title }))
    .filter((type) => type.id != 0);
  return types.length ? types : [{ id: null, label: "انتخاب کنید" }];
});

const schema = yup.object({
  nationalCode: yup
    .string()
    .required("کد ملی الزامی است")
    .matches(/^\d{10}$/, "کد ملی باید ۱۰ رقم باشد"),
  licenseNumber: yup
    .string()
    .required("شماره پروانه وکالت الزامی است")
    .min(4, "حداقل ۴ کاراکتر")
    .max(255, "حداکثر ۲۵۵ کاراکتر"),
  base: yup.mixed().required("پایه الزامی است"),
  nationalCardImage: yup
    .mixed()
    .required("تصویر کارت ملی الزامی است")
    .test("fileSize", "حجم فایل نباید بیشتر از ۲ مگابایت باشد", (file) => !file || file.size <= MAX_FILE_SIZE),
  licenseImage: yup
    .mixed()
    .required("تصویر پروانه وکالت الزامی است")
    .test("fileSize", "حجم فایل نباید بیشتر از ۲ مگابایت باشد", (file) => !file || file.size <= MAX_FILE_SIZE),
});

const state = reactive({
  nationalCode: "",
  licenseNumber: "",
  base: mappedTypes.value[0]?.id ?? null,
  nationalCardImage: null,
  licenseImage: null,
});

const myRequest = ref(null);
const loading = ref(false);

// Fetch my request status
const fetchMyRequest = async () => {
  const res = await useGet({
    url: "register-lawyer/my-request",
    includeAuthHeader: true,
  }, false);
  if (res.status && res.data?.data != null) {
    myRequest.value = res.data.data;
  } else {
    myRequest.value = null;
  }
};

onMounted(async () => {
  if (authStore.user?.user_type === "admin") {
    await navigateTo("/dashboard/admin");
    return;
  }
  if (authStore.user?.user_type === "lawyer" && authStore.user?.lawyer_id) {
    return;
  }
  await fetchMyRequest();
  if (!filtersStore.lawyerTypes?.length) {
    const res = await useGet({ url: "lawyer_bases" }, false);
    if (res.status && res.data?.data) {
      filtersStore.setLawyerTypes(res.data.data);
    }
  }
});

// Keep base in sync with mappedTypes when filters load
watch(mappedTypes, (types) => {
  if (types.length && state.base == null && types[0].id != null) {
    state.base = types[0].id;
  }
}, { immediate: true });

async function onSubmit(e) {
  loading.value = true;
  const formData = new FormData();
  formData.append("national_code", state.nationalCode);
  formData.append("license_number", state.licenseNumber);
  formData.append("base", state.base);
  formData.append("national_card_image", e.data.nationalCardImage);
  formData.append("license_image", e.data.licenseImage);

  try {
    const res = await usePost({
      url: "register-lawyer/request",
      body: formData,
      includeAuthHeader: true,
    }, true);

    if (res.statusCode === 201 && res.data?.data != null) {
      useToast().add({
        title: "درخواست ثبت شد",
        description: "درخواست شما با موفقیت ثبت شد و در انتظار تأیید است.",
        icon: "mage:security-shield",
        color: "success",
      });
      await authStore.fetchUser();
      myRequest.value = { status: "pending" };
      await navigateTo("/dashboard");
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

useHead({
  title: "ثبت‌نام به‌عنوان وکیل | داشبورد",
});
</script>
