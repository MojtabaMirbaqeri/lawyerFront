<template>
  <div class="steps-con flex flex-col items-center gap-6 w-full">
    <RegisterStepOne v-if="registerStore.formStep == 1" />
    <RegisterOtpCode v-else-if="registerStore.formStep == 2" />
    <RegisterInformationForm v-else-if="registerStore.formStep == 3" />
    <RegisterLawyerForm v-else-if="registerStore.formStep == 4" />
    <RegisterFinish v-else-if="registerStore.formStep == 5" />
  </div>
</template>

<script setup >
import { useRegisterStore } from "~/store/register";

const registerStore = useRegisterStore();

definePageMeta({
  layout: "register",
});
</script>

<style>
@reference "tailwindcss";
.steps-con .secondary-btn {
  @apply w-full rounded-[8px]! justify-center h-[40px] sm:h-[46px];
}
</style>