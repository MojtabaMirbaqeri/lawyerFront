<template>
  <UModal
    v-model="rejectModal"
    title="رد کردن وکیل"
    description="برای رد وکیل ابتدا علت رو بیان کرده سپس دکمه رو فشار دهید"
  >
    <UButton
      icon="solar:close-circle-linear"
      color="neutral"
      variant="link"
      class=""
      :ui="{ leadingIcon: 'size-6! text-red-500' }"
    />

    <template #body>
      <div class="flex flex-col gap-3">
        <h1>علت رد وکیل را بیان کنید؟</h1>
        <UTextarea
          color="neutral"
          variant="subtle"
          class="w-full outline-0"
          :ui="{
            base: 'focus-visible:ring-ring-color focus-visible:ring-1',
          }"
          placeholder="نظر خود را درباره ی وکیل مورد نظر بنویسید..."
          :maxrows="6"
          v-model="userComment"
          autoresize=""
        />
        <UICSecondaryBtn
          @click="handle"
          :disabled="userComment === ''"
          class="rounded-[8px]! py-[12px]!"
        >
          <span>تایید</span>
        </UICSecondaryBtn>
      </div>
    </template>
  </UModal>
  <UModal
    v-model:open="acceptModal"
    title="تایید کردن وکیل"
    description="برای تایید دکمه بله را کلیک کنید"
  >
    <UButton
      icon="solar:check-circle-linear"
      color="neutral"
      variant="link"
      class=""
      :ui="{ leadingIcon: 'size-6! text-green-500' }"
    />

    <template #body>
      <h1>از تایید وکیل مورد نظر اطمینان دارید؟</h1>
      <UICSecondaryBtn
        @click="acceptHandle"
        class="rounded-[8px]! mt-3 py-[12px]!"
      >
        <span>تایید</span>
      </UICSecondaryBtn>
    </template>
  </UModal>
</template>

<script setup>
const emit = defineEmits(["reject", "accept"]);
const rejectModal = ref(false);
const acceptModal = ref(false);
const userComment = ref("");
const handle = () => {
  emit("reject", userComment.value);
  rejectModal.value = false;
};

const acceptHandle = () => {
  // eslint-disable-next-line vue/require-explicit-emits
  emit("accept");
  acceptModal.value = false
};
</script>