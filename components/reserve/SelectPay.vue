<template>
  <div class="flex flex-col gap-3">
    <div class="off primary-box flex justify-between">
      <UCollapsible :unmount-on-hide="false" class="flex flex-col w-full">
        <UButton
          label="افزودن کد تخفیف"
          color="primary"
          variant="link"
          trailing-icon="hugeicons:add-02"
          class="p-0 flex justify-between w-full" />

        <template #content>
          <div class="w-full mt-5">
            <UForm
              :schema="schema"
              :state="state"
              class="space-y-4 flex items-start gap-2 justify-between"
              @submit="onSubmit">
              <UFormField name="code" class="w-full">
                <UInput v-model="state.code" class="w-full" />
              </UFormField>

              <UButton
                @click="$emit('subCopun', state.code)"
                :disabled="state.code === ''"
                class="w-30 justify-center"
                type="submit">
                اعمال کد
              </UButton>
            </UForm>
          </div>
        </template>
      </UCollapsible>
    </div>
    <div class="payment primary-box flex flex-col gap-3">
      <div class="title">شیوه پرداخت</div>
      <div class="buttons">
        <ReserveSelectPayBtn v-model="selectDargah" :items="paymentMethodItems" />
      </div>
      <div class="checkbox hidden lg:block">
        <UCheckbox v-model="checkBoxVal">
          <template #label>
            با ثبت نام
            <UICDrawer title="read more">
              <template #button>
                <UButton
                  label=" قوانین و مقررات"
                  color="primary"
                  variant="link"
                  class="p-0 ps-1 cursor-pointer" />
              </template>
              <template #default> قوانین و مقررات </template>
            </UICDrawer>
            وکیل وکیل را میپذیرم.
          </template>
        </UCheckbox>
      </div>
      <div class="sidebar-btn">
        <div class="checkbox block lg:hidden">
          <UCheckbox v-model="checkBoxVal">
            <template #label>
              با ثبت نوبت
              <UICDrawer title="read more">
                <template #button>
                  <UButton
                    label=" قوانین و مقررات"
                    color="primary"
                    variant="link"
                    class="p-0 ps-1 cursor-pointer" />
                </template>
                <template #default> قوانین و مقررات </template>
              </UICDrawer>
              وکیل وکیل را میپذیرم.
            </template>
          </UCheckbox>
        </div>
        <UICSecondaryBtn
          :disabled="!checkBoxVal"
          :class="{ 'mix-blend-luminosity': !checkBoxVal }"
          class="rounded-[8px]! justify-center! w-full"
          @click="$emit('subReserve')">
          <span class="text-center text-base">
            {{ isOnlinePaymentOnly ? "پرداخت" : (selectDargah === "1" ? "ثبت نوبت" : "پرداخت") }}
          </span>
        </UICSecondaryBtn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { object, string } from "yup";
import type { InferType } from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";

const props = defineProps<{
  /** وقتی پیش‌پرداخت یا پرداخت کامل لازم است، فقط درگاه‌ها نمایش داده می‌شوند */
  bookingPolicy?: { policy?: string } | null;
}>();

const selectDargah = ref("1");

const checkBoxVal = ref(false);

const allPaymentOptions = [
  { id: "1", title: "پرداخت حضوری", src: "office.png", disabled: false },
  { id: "2", title: "درگاه به پرداخت بانک ملت", src: "behpardakht.webp", disabled: true },
  { id: "3", title: "درگاه بانک سامان", src: "samanBank.webp", disabled: true },
];

/** در حالت پیش‌پرداخت یا پرداخت کامل فقط درگاه‌های پرداخت */
const isOnlinePaymentOnly = computed(
  () =>
    props.bookingPolicy?.policy === "deposit_required" ||
    props.bookingPolicy?.policy === "full_payment_required"
);

const paymentMethodItems = computed(() => {
  if (isOnlinePaymentOnly.value) {
    return allPaymentOptions.filter((o) => o.id !== "1");
  }
  return allPaymentOptions;
});

watch(
  () => [paymentMethodItems.value, isOnlinePaymentOnly.value],
  () => {
    if (isOnlinePaymentOnly.value && selectDargah.value === "1") {
      selectDargah.value = paymentMethodItems.value[0]?.id ?? "2";
    }
  },
  { immediate: true }
);

const schema = object({
  code: string().required("لطفا کد تخفیف را وارد کنید"),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  code: "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
}
</script>

<style scoped>
@reference "tailwindcss";

.sidebar-btn {
  @apply fixed lg:shadow-none lg:z-0 shadow-[0_35px_35px_20px_rgba(0,0,0,0.25)] gap-6 rounded-t-[14px] lg:static bottom-0 right-0 mx-auto lg:mx-0 bg-white py-4 z-50 left-0 flex flex-col;
}
</style>
