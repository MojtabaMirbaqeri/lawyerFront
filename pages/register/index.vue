<template>
  <div class="">
    <NuxtLayout
      name="register"
      :state="state"
      :schema="schema"
      title="ورود / ثبت نام"
      :onSubmit="onSubmit"
    >
      <template #top-header>
        <UICSelectButton
          :items="items"
          class="w-full! flex-nowrap! gap-0!"
          :ui="{
            base: 'rounded-[8px] first:rounded-e-none! last:rounded-s-none! w-full justify-center! items-center!',
          }"
          v-model="defType"
        />
      </template>
  
        <UICInput
          v-model="state.phone"
          name="phone"
          label="لطفا شماره موبایل خود را وارد کنید"
          @input="filterDigits"
          maxlength="11"
        />
  
  
      <template #button-title> دریافت کد تایید </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { object, string } from "yup";
import type { InferType } from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";

definePageMeta({
  layout:false
})

const items = ref([
  {
    id: "1",
    title: "کاربر",
  },
  {
    id: "2",
    title: "وکیل",
  },
]);

const defType = ref("1");

const schema = object({
  phone: string()
    .required("لطفا شماره موبایل را وارد کنید")
    .matches(/^(\+98|0)?9\d{9}$/, "شماره موبایل معتبر نیست")
    .length(11, "شماره موبایل باید دقیقاً 11 رقم باشد"),
});
type Schema = InferType<typeof schema>;

const state = reactive({
  phone: undefined,
});

const valid = ref(false);

async function filterDigits(e: Event) {
  const target = e.target as HTMLInputElement;
  target.value = target.value.replace(/\D/g, ""); // حذف همه کاراکترهای غیراعدادی
  state.phone = target.value.slice(0, 11); // به‌روزرسانی state همزمان
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
}
</script>

<style>
</style>