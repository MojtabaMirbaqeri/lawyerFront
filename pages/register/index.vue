<template>
  <div
    class="flex flex-col items-center gap-6 w-full"
  >
    <RegisterStepOne v-if="registerStore.formStep == 1" />
    <RegisterOtpCode v-if="registerStore.formStep == 2"/>
    <RegisterUserForm v-if="registerStore.formStep == 3" />
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
</style>