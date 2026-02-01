<template>
  <div class="flex flex-col gap-6 w-full">
    <RegisterCardHeader title="ورود / ثبت‌نام" />

    <div class="space-y-2">
      <label class="text-sm font-medium text-slate-600">نوع حساب</label>
      <div class="rounded-2xl bg-slate-100/70 p-1.5">
        <UICSelectButton
          v-model="defType"
          :items="items"
          class="w-full flex !gap-0"
          :ui="{
            base: 'flex-1 rounded-xl py-3 border-0 bg-transparent justify-center font-medium text-slate-600 transition-all duration-200',
            active: 'bg-white text-[#1e3a5f] shadow-sm shadow-slate-200/50',
          }"
        />
      </div>
    </div>

    <UForm
      :schema="schema"
      ref="formRef"
      :state="state"
      class="space-y-5"
      @submit="onSubmit"
    >
      <UICInput
        v-model="state.phone"
        name="phone"
        label="شماره موبایل"
        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
        maxlength="11"
        :autofocus="true"
        inputmode="numeric"
        @input="filterDigits"
      />

      <UICSecondaryBtn
        class="w-full rounded-xl h-12 text-base font-semibold bg-[#1e3a5f] hover:opacity-90 transition"
        type="submit"
        :disabled="authStore.loading"
      >
        دریافت کد تأیید
      </UICSecondaryBtn>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { object, string } from "yup";
import type { InferType } from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";

const registerStore = useRegisterStore();
const authStore = useAuthStore();

const items = ref([
  { id: "user", title: "کاربر" },
  { id: "lawyer", title: "وکیل" },
]);

const formRef = ref();
const defType = ref("user");

// فرمت: ۰۹ + کد اپراتور (مثلاً ۹۱۲، ۹۳۰، ۹۱۰) + ۷ رقم — جمعاً ۱۱ رقم
const schema = object({
  phone: string()
    .required("لطفا شماره موبایل را وارد کنید")
    .length(11, "شماره موبایل باید دقیقاً ۱۱ رقم باشد")
    .matches(
      /^09(0[0-5]|[13]\d|2[0-3]|9[0-9]|41)\d{7}$/,
      "شماره موبایل معتبر نیست (فرمت: ۰۹۱۲۳۴۵۶۷۸۹)"
    ),
});
type Schema = InferType<typeof schema>;

const state = reactive({
  phone: undefined,
});

async function filterDigits(e: Event) {
  const target = e.target as HTMLInputElement;
  target.value = target.value.replace(/\D/g, "");
  state.phone = target.value.slice(0, 11);
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
        title: "کد تأیید برای شما پیامک شد.",
        icon: "solar:phone-linear",
        color: "success",
      });
    } else {
      useToast().add({
        title: "کد تأیید قبلاً برای شما پیامک شده است.",
        icon: "solar:phone-linear",
        color: "warning",
      });
    }
    registerStore.nextStep();
  } else {
    useToast().add({
      title: "شماره موبایل شما تأیید نشد.",
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
