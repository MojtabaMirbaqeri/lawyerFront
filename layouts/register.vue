<template>
  <div class="relative h-[100vh] flex justify-center items-center">
    <div class="form w-full">
      <section class="px-2">
        <div
          class="primary-box p-6 mx-auto w-full"
          :style="{ maxWidth: '450px' }"
        >
          <div class="flex flex-col items-center gap-6 w-full">
            <h1 class="sec-header">{{ title }}</h1>
            <slot name="top-header"></slot>
            <UForm
              :schema="schema"
              :state="state"
              class="space-y-4 flex items-center gap-3 justify-between flex-col w-full"
              @submit="onSubmit"
            >
              <slot/>
              <UICSecondaryBtn
                class="w-full rounded-[8px]! justify-center h-[46px]"
                type="submit"
              >
                <slot name="button-title"></slot>
              </UICSecondaryBtn>
            </UForm>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup>
defineProps(["schema", "state", "onSubmit","title"]);
</script>
<style scoped></style>