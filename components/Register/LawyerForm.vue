<template>
  <RegisterCardHeader title="آپلود مدارک" />

  <UForm
    :schema="schema"
    :state="state"
    class="w-full space-y-7"
    @submit="onSubmit"
  >
    <UICInput
      v-model="state.IDCardPic"
      type="file"
      name="IDCardPic"
      label="تصویر کارت ملی"
    >
      <template #input>
        <UFileUpload
          v-model="state.IDCardPic"
          icon="i-lucide-image"
          label="تصویر کارت ملی خود را آپلود کنید"
          description="Image/* (max. 5MB)"
          layout="list"
          accept="image/*"
          :ui="{
            base: 'border-black/30',
            wrapper: 'py-2',
          }"
        />
      </template>
    </UICInput>

    <UICInput
      v-model="state.licensePic"
      type="file"
      name="licensePic"
      label="تصویر پروانه وکالت"
    >
      <template #input>
        <UFileUpload
          v-model="state.licensePic"
          icon="i-lucide-image"
          label="تصویر پروانه وکالت خود را آپلود کنید"
          description="Image/* (max. 5MB)"
          layout="list"
          accept="image/*"
          :ui="{
            base: 'border-black/30',
            wrapper: 'py-2',
          }"
        />
      </template>
    </UICInput>
    <UICSecondaryBtn
      type="submit"
      :disabled="auth.loading"
    > تایید </UICSecondaryBtn>
  </UForm>
</template>
<script setup>
import * as yup from "yup";

const registerStore = useRegisterStore();
const lawyerInformation = registerStore.lawyerInformation;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const schema = yup.object({
  IDCardPic: yup
    .mixed()
    .required("تصویر کارت ملی الزامی است")
    .test("fileSize", "حجم فایل نباید بیشتر از ۵ مگابایت باشد", (file) => {
      return file && file.size <= MAX_FILE_SIZE;
    }),
  licensePic: yup
    .mixed()
    .required("تصویر پروانه وکالت الزامی است")
    .test("fileSize", "حجم فایل نباید بیشتر از ۵ مگابایت باشد", (file) => {
      return file && file.size <= MAX_FILE_SIZE;
    }),
});

const state = reactive({
  IDCardPic: null,
  licensePic: null,
});

const auth = useAuthStore();

async function onSubmit(e) {
  const formData = new FormData();
  formData.append("is_lawyer", true);
  formData.append("national_code", lawyerInformation.nationalCode);
  formData.append("license_number", lawyerInformation.licenseNumber);
  formData.append("name", lawyerInformation.name);
  formData.append("family", lawyerInformation.lastName);
  formData.append("phone", registerStore.userInformation.phone);
  formData.append("license_image", e.data.licensePic);
  formData.append("national_card_image", e.data.IDCardPic);
  formData.append("base", lawyerInformation.lawyerType);
  try {
    await auth.registerLawyer(formData);
    navigateTo("/dashboard/lawyer");
  } catch (err) {
    alert("خطا در ثبت‌نام وکیل");
    console.error(err);
  }
}
</script>
