<template>
  <div class="flex flex-col items-center gap-6 w-full">
    <h1 class="sec-header">ورود / ثبت نام</h1>
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
        @input="filterDigits"
        maxlength="11"
      />

      <UICSecondaryBtn
        class="w-full rounded-[8px]! justify-center h-[46px]"
        type="submit"
      >
        دریافت کد تایید
      </UICSecondaryBtn>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { object, string } from "yup";
import type { InferType } from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";

definePageMeta({
  layout: "register",
});

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

const formRef = ref();

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