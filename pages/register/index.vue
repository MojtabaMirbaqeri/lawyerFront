<template>
  <section class="px-2">
    <div
      class="primary-box p-6 mx-auto flex flex-col items-center gap-6 w-full"
      :style="{ maxWidth: '450px' }"
    >
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
        :state="state"
        class="space-y-4 flex items-center gap-3 justify-between flex-col w-full"
        @submit="onSubmit"
      >
        <UICInput
          v-model="state.phone"
          name="phone"
          label="لطفا شماره موبایل خود را وارد کنید"
        />

        <UICSecondaryBtn
          class="w-full rounded-[8px]! justify-center h-[46px]"
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

definePageMeta({
  layout: "register",
});

const schema = object({
  phone: string()
  .required("لطفا شماره موبایل را وارد کنید")
  .max(11, "شماره موبایل باید 11 رقم باشد")
  .min(11, "شماره موبایل باید 11 رقم باشد")
  .matches(/^(\+98|0)?9\d{9}$/, "شماره موبایل معتبر نیست")
});
type Schema = InferType<typeof schema>;

const state = reactive({
  phone: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
}
</script>

<style>
</style>