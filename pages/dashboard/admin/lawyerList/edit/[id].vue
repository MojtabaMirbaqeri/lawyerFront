<template>
  <section>
    <div class="ds-container">
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 flex items-center gap-3 justify-between items-start flex-col w-full"
        @submit="onSubmit"
      >
        <div class="flex flex-col lg:flex-row justify-between w-full gap-3">
          <UICInput
            v-model="state.phone"
            name="phone"
            label="لطفا شماره موبایل را وارد کنید"
            @input="filterDigits"
            maxlength="11"
          />
          <UICInput
            v-model="state.name"
            name="name"
            label="نام خانوادگی"
          />
          <UICInput
            v-model="state.phone"
            name="phone"
            label="لطفا شماره موبایل خود را وارد کنید"
            @input="filterDigits"
            maxlength="11"
          />
        </div>

        <UICSecondaryBtn
          class="w-fit rounded-[8px]! h-[46px]"
          type="submit"
        >
          دریافت کد تایید
        </UICSecondaryBtn>
      </UForm>
    </div>
  </section>
</template>

<script setup lang="ts">
import { object, string } from "yup";
import type { InferType } from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = object({
  phone: string()
    .required("لطفا شماره موبایل را وارد کنید")
    .matches(/^(\+98|0)?9\d{9}$/, "شماره موبایل معتبر نیست")
    .length(11, "شماره موبایل باید دقیقاً 11 رقم باشد"),
  name:string().required('لطفا نام را وارد کنید'),
});
type Schema = InferType<typeof schema>;

const state = reactive({
  phone: undefined,
  name:undefined,
});

async function filterDigits(e: Event) {
  const target = e.target as HTMLInputElement;
  target.value = target.value.replace(/\D/g, ""); // حذف همه کاراکترهای غیراعدادی
  state.phone = target.value.slice(0, 11); // به‌روزرسانی state همزمان
}

const onSubmit = (event) => {
  console.log(event.data);
};
</script>

<style>
</style>