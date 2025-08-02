<template>
  <h1 class="sec-header">اطلاعات تکمیلی</h1>
  <UForm
    :schema="currentSchema"
    :state="state"
    class="w-full space-y-7"
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
    </template>

    <UICSecondaryBtn type="submit">تایید</UICSecondaryBtn>
  </UForm>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { object, string } from "yup";

const registerStore = useRegisterStore();
const userType = ref(registerStore.userInformation.type);
const state = reactive({
  name: "",
  lastName: "",
  nationalCode: "",
  licenseNumber: "",
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

const submit = async (e) => {
  if (userType.value == "user") {
    const res = await usePost({
      url: "register-lawyer",
      body: {
        is_lawyer: false,
        name: e.data.name,
        family: e.data.lastName,
        phone: registerStore.userInformation.phone,
      },
    });
    if (res.statusCode == 201) {
      //       {
      //     "status": 201,
      //     "data": {
      //         "name": "مجتبی",
      //         "family": "میرباقری",
      //         "phone": "09999047688",
      //         "updated_at": "2025-08-02T07:58:28.000000Z",
      //         "created_at": "2025-08-02T07:58:28.000000Z",
      //         "id": 119
      //     },
      //     "message": "کاربر با موفقیت ثبت شد."
      // }
      registerStore.formStep = 5;
    }
  } else {
    registerStore.lawyerInformation = state;
    registerStore.nextStep();
  }
};
</script>
