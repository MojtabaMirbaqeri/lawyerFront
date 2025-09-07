<template>
  <RegisterCardHeader title="ورود / ثبت نام" />
  <UICSelectButton
    :items="items"
    class="w-full! flex-nowrap! gap-0!"
    :ui="{
      base: 'rounded-[8px] first:rounded-e-none! last:rounded-s-none! w-full justify-center! items-center!',
    }"
    v-model="defType"
  />
  <UForm
    :schema="schema"
    ref="formRef"
    :state="state"
    class="space-y-4 flex items-center gap-3 justify-between flex-col w-full"
    @submit="onSubmit"
  >
    <UICInput
      v-model="state.phone"
      name="phone"
      label="لطفا شماره موبایل خود را وارد کنید"
      maxlength="11"
      :autofocus="true"
      @input="filterDigits"
    />

    <UICSecondaryBtn
      class="w-full rounded-[8px]! justify-center h-[46px]"
      type="submit"
      :disabled="authStore.loading"
    >
      دریافت کد تایید
    </UICSecondaryBtn>
  </UForm>
</template>

<script setup lang="ts">
import { object, string } from "yup";
import type { InferType } from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";

const registerStore = useRegisterStore();
const authStore = useAuthStore();

const items = ref([
  {
    id: "user",
    title: "کاربر",
  },
  {
    id: "lawyer",
    title: "وکیل",
  },
]);

const formRef = ref();

const defType = ref("user");

const schema = object({
  phone: string()
    .required("لطفا شماره موبایل را وارد کنید")
    .matches(
      /^(098|0098|98|\+98|0)?9(0[0-5]|[1 3]\d|2[0-3]|9[0-9]|41)\d{7}$/g,
      "شماره موبایل معتبر نیست"
    )
    .length(11, "شماره موبایل باید دقیقاً 11 رقم باشد"),
});
type Schema = InferType<typeof schema>;

const state = reactive({
  phone: undefined,
});

async function filterDigits(e: Event) {
  const target = e.target as HTMLInputElement;
  target.value = target.value.replace(/\D/g, ""); // حذف همه کاراکترهای غیراعدادی
  state.phone = target.value.slice(0, 11); // به‌روزرسانی state همزمان
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  authStore.loading = true;
  const res = await usePost({
    url: "auth/send-code",
    body: { phone: event.data.phone },
  });

  if (res.statusCode === 200 || res.statusCode === 429) {
    if (localStorage.getItem("timer") && res.statusCode === 200) {
      localStorage.removeItem("timer");
    }
    registerStore.userInformation.phone = event.data.phone;
    registerStore.userInformation.type = defType.value;
    if (res.statusCode === 200) {
      useToast().add({
        title: "کد تایید برای شما پیامک شد.",
        icon: "solar:phone-linear",
        color: "success",
      });
    } else {
      useToast().add({
        title: "کد تایید برای شما قبلا پیامک شده است.",
        icon: "solar:phone-linear",
        color: "warning",
      });
    }
    registerStore.nextStep();
  } else {
    console.log(res.error);
    useToast().add({
      title: "شماره موبایل شما تایید نشد.",
      icon: "solar:phone-linear",
      color: "error",
    });
  }
  authStore.loading = false;
}

onMounted(() => {
  state.phone = registerStore.userInformation.phone ?? "";
});
</script>



<style>
</style>