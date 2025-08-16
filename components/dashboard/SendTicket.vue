<template>
  <div class="w-full">
    <div class="flex flex-col gap-2">
      <UFileUpload variant="button" class="me-auto"/>

      <ThingTextarea
        id="dis"
        v-model="dismodel"
        :maxlength="1000"
        class=""
        placeholder="پاسخ خود را بنویسید"
      />
      <p class="text-sm text-left text-muted-foreground">
        300 / {{ dismodel.length }}
      </p>
    </div>
  </div>
</template>

<script setup>
const dismodel = ref("");
</script>

<style>
</style>