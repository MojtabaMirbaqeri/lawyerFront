<template>
  <div class="flex flex-col gap-6 w-full">
    <div class="text-center py-2">
      <div class="inline-flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
        <UIcon name="solar:check-circle-bold" class="size-9" />
      </div>
      <h1 class="text-xl sm:text-2xl font-bold text-slate-800">با موفقیت وارد شدید</h1>
      <p class="mt-1 text-slate-500 text-sm">اکنون می‌توانید از خدمات سامانه استفاده کنید.</p>
    </div>

    <UICSecondaryBtn
      class="w-full rounded-xl h-12 text-base font-semibold bg-[#1e3a5f] hover:opacity-90 transition"
      @click="navigateTo('/')"
    >
      ادامه
    </UICSecondaryBtn>
  </div>
</template>

<script setup>
</script>
