<template>
  <RegisterCardHeader title="اطلاعات تکمیلی" />
  <UForm
    :schema="currentSchema"
    :state="state"
    class="w-full space-y-6"
    @submit="submit"
  >
    <UICInput v-model="state.name" name="name" label="نام" />
    <UICInput v-model="state.lastName" name="lastName" label="نام خانوادگی" />

    <template v-if="userType === 'lawyer'">
      <UICInput
        v-model="state.nationalCode"
        name="nationalCode"
        label="کد ملی"
      />
      <UICInput
        v-model="state.licenseNumber"
        name="licenseNumber"
        label="شماره پروانه"
      />
      <UICInput name="lawyerType" label="پایه">
        <template #input>
          <UICSelect v-model="state.lawyerType" :items="mappedTypes" />
        </template>
      </UICInput>
    </template>

    <UICSecondaryBtn type="submit" :disabled="auth.loading">
      تایید
    </UICSecondaryBtn>
  </UForm>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { object, string } from "yup";

const registerStore = useRegisterStore();
const filtersStore = useFiltersStore();

const mappedTypes = [...filtersStore.lawyerTypes]
  .map((type) => ({
    id: type.id,
    label: type.title,
  }))
  .filter((type) => {
    return type.id != 0;
  });

const userType = ref(registerStore.userInformation.type);
const state = reactive({
  name: "",
  lastName: "",
  nationalCode: "",
  licenseNumber: "",
  lawyerType: mappedTypes[0].id,
});

const userSchema = object({
  name: string()
    .required("نام خود را وارد کنید")
    .max(20, "حداکثر 20 کاراکتر مجاز است"),
  lastName: string()
    .required("نام خانوادگی خود را وارد کنید")
    .max(25, "حداکثر 25 کاراکتر مجاز است"),
});

const lawyerSchema = object({
  name: string()
    .required("نام خود را وارد کنید")
    .max(20, "حداکثر 20 کاراکتر مجاز است"),
  lastName: string()
    .required("نام خانوادگی خود را وارد کنید")
    .max(25, "حداکثر 25 کاراکتر مجاز است"),
  nationalCode: string()
    .required("کد ملی خود را وارد کنید")
    .matches(/^\d{10}$/, "کد ملی وارد شده نامعتبر است"),
  licenseNumber: string()
    .required("شماره پروانه خود را وارد کنید")
    .min(4, "حداقل 4 کاراکتر لازم است")
    .max(8, "حداکثر 8 کاراکتر مجاز است"),
});

const currentSchema = computed(() =>
  userType.value === "lawyer" ? lawyerSchema : userSchema
);

const auth = useAuthStore();
const submit = async (e) => {
  if (userType.value === "user") {
    try {
      await auth.registerUser({
        name: e.data.name,
        family: e.data.lastName,
        phone: registerStore.userInformation.phone,
      });
      navigateTo("/dashboard");
    } catch (err) {
      alert("خطا در ثبت‌نام کاربر عادی");
      console.error(err);
    }
  } else {
    registerStore.lawyerInformation = state;
    registerStore.nextStep();
  }
};
</script>
