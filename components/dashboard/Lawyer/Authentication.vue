<template>
  <section class="relative">
    <Transition name="fade">
      <div v-if="authStore.user.lawyer_kyc" class="overlay">
        <UICBadge
          value="احراز هویت شما مورد تایید قرار گرفته است"
          icon="hugeicons:account-setting-03"
          icon-size="size-6!"
          custom-class="text-sm px-3 py-2 rounded-lg border border-green-200"
          variant="green"
        />
      </div>
    </Transition>
    <div>
      <UForm :schema="schema" :state="state" class="ds-form" @submit="onSubmit">
        <div class="ds-form-grid">
          <!-- پایه وکیل -->
          <UICInput name="lawyerType" label="پایه">
            <template #input>
              <UICSelect v-model="state.lawyerType" :items="mappedTypes" />
            </template>
          </UICInput>

          <!-- شماره پروانه -->
          <UICInput
            v-model="state.licenseNumber"
            name="licenseNumber"
            label="شماره پروانه"
          />

          <!-- کد ملی -->
          <UICInput
            v-model="state.nationalCode"
            name="nationalCode"
            label="کد ملی"
            placeholder="۱۰ رقم"
          />

          <!-- تصویر کارت ملی -->
          <UICInput name="IDCardPic" label="تصویر کارت ملی">
            <template #input>
              <UFileUpload
                v-model="state.IDCardPic"
                icon="i-lucide-image"
                label="تصویر کارت ملی خود را آپلود کنید"
                description="Image/* (max. 5MB)"
                layout="list"
                accept="image/*"
                :ui="{ base: 'border-black/30', wrapper: 'py-2' }"
              />
            </template>
          </UICInput>

          <!-- تصویر پروانه -->
          <UICInput name="licensePic" label="تصویر پروانه">
            <template #input>
              <UFileUpload
                v-model="state.licensePic"
                icon="i-lucide-image"
                label="تصویر پروانه خود را آپلود کنید"
                description="Image/* (max. 5MB)"
                layout="list"
                accept="image/*"
                :ui="{ base: 'border-black/30', wrapper: 'py-2' }"
              />
            </template>
          </UICInput>
        </div>

        <UICSecondaryBtn type="submit" :disabled="isLoading">
          {{ isLoading ? "در حال پردازش..." : "ثبت" }}
        </UICSecondaryBtn>
      </UForm>
    </div>
  </section>
</template>

<script setup>
import { object, string, mixed } from "yup";
const props = defineProps({
  lawyerInformation: {
    type: Object,
    required: true,
  },
});

const filtersStore = useFiltersStore();
const authStore = useAuthStore();
console.log(props.lawyerInformation, authStore.user);

// map کردن انواع پایه‌ها (مثل نمونه‌های قبلی)
const mappedTypes = [...filtersStore.lawyerTypes]
  .map((type) => ({ id: type.id, label: type.title }))
  .filter((t) => t.id != 0);

// MAX file size
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

// reactive state (مقادیر اولیه خالی)
const state = reactive({
  lawyerType: mappedTypes.length ? mappedTypes[0].id : "",
  licenseNumber: "",
  nationalCode: "",
  IDCardPic: null, // File
  licensePic: null, // File
});

const isLoading = ref(false);

// yup validation schema
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
    .test("fileSize", "حجم فایل نباید بیشتر از ۲۰ مگابایت باشد", (file) => {
      return file && file.size <= MAX_FILE_SIZE;
    }),
  licensePic: mixed()
    .required("تصویر پروانه الزامی است")
    .test("fileSize", "حجم فایل نباید بیشتر از ۲۰ مگابایت باشد", (file) => {
      return file && file.size <= MAX_FILE_SIZE;
    }),
});

// submit handler — ارسال به backend (lawyers/kyc)
const onSubmit = async (e) => {
  const payload = e?.data ?? { ...state };

  // build FormData
  const fd = new FormData();
  fd.append("base", String(payload.lawyerType));
  fd.append("license_number", payload.licenseNumber);
  fd.append("national_code", payload.nationalCode);
  if (payload.IDCardPic) fd.append("national_card_image", payload.IDCardPic);
  if (payload.licensePic) fd.append("license_image", payload.licensePic);

  // debug log entries
  for (const pair of fd.entries()) {
    console.log(pair[0], pair[1]);
  }

  isLoading.value = true;
  try {
    const res = await usePost({
      url: "lawyers/kyc",
      includeAuthHeader: true,
      body: fd,
    });

    if (res.status || res.statusCode === 200 || res.statusCode === 201) {
      useToast().add({
        description: "اطلاعات احراز هویت با موفقیت ارسال شد",
        color: "success",
      });
      authStore.user.lawyer_kyc = true;
    } else {
      useToast().add({
        description: "ارسال اطلاعات احراز هویت با خطا مواجه شد",
        color: "error",
      });
      console.error("kyc error:", res);
    }
  } catch (err) {
    console.error("submit error:", err);
    useToast().add({ description: "خطا در ارسال اطلاعات", color: "error" });
  } finally {
    isLoading.value = false;
  }
};
</script>
<style scoped>
@reference "tailwindcss";
.overlay {
  @apply absolute inset-[-20px] bg-white/20 backdrop-blur-[3px] rounded-lg overflow-hidden z-10 flex items-center justify-center;
}
</style>