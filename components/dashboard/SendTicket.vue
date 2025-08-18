<template>
  <div class="w-full" ref="elRef">
    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <div class="flex gap-2 items-center">
          <!-- <label for="">پیوست فایل :</label> -->
          <UFileUpload
            v-model="fileModel"
            label="پیوست فایل"
            multiple
            :ui="{
              wrapper: 'flex-row items-center w-[140px]! py-[6px] px-[10px]',
              base: 'p-0 w-[140px]!',
              avatar: 'bg-transparent scale-[1.2]',
              label: 'm-0',
              root: 'lg:flex-row',
              fileName: 'hidden lg:block',
              file: 'w-fit gap-1',
              fileSize: 'hidden lg:block',
              files: 'flex-row items-start flex-wrap',
            }"
            icon="line-md:uploading-loop"
            variant="button"
            :disabled="fileModel.length === 4"
            position="outside"
            class="me-auto"
            layout="list"
          >
          </UFileUpload>
        </div>
      </div>

      <ThingTextarea
        id="dis"
        v-model="dismodel"
        :maxlength="1000"
        class=""
        placeholder="پاسخ خود را بنویسید"
      />

      <div class="flex items-center">
        <UICSecondaryBtn :disabled="status === 'closed'" @click="ticket" class="rounded-[8px]!">
          <UIcon name="system-uicons:paper-plane" />
          ارسال پیام
        </UICSecondaryBtn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useElementSize } from "@vueuse/core";
defineProps(['status'])
const dismodel = ref("");
const fileModel = ref("");
const emit = defineEmits(["sendTicket"]);
const elRef = ref();

const h = ref()

onMounted(async () => {
  await nextTick();
  h.value = useElementSize(elRef);
  useAuthStore().height = h.value
});

onUpdated(async () => {
  await nextTick();
  h.value = useElementSize(elRef);
  useAuthStore().height = h.value
});
const ticket = () => {
  emit("sendTicket", { file: fileModel.value, dis: dismodel.value });
};
</script>

<style>
</style>