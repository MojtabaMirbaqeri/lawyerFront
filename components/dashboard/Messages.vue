<template>
  <div class="messages flex flex-col gap-3" v-for="item in items" :key="item">
    <USeparator>
      <template #default>
        <div class="x py-1 px-5 bg-gray-200/55">
          {{
            new Date(item.date).toLocaleDateString("fa") ===
            new Date().toLocaleDateString("fa")
              ? "امروز"
              : new Date(item.date).toLocaleDateString("fa")
          }}
        </div>
      </template>
    </USeparator>

    <div
      :class="{
        'left-message': authStore.user.user_type != message.user?.type || authStore.user.id !== message.user?.id,
        'right-message primary-box':
          authStore.user.user_type == message.user.type || authStore.user.id === message.user?.id,
      }"
      class="flex flex-col"
      v-for="message in item.messages"
      :key="message"
    >
      <div class="">
        {{ message.message }}
      </div>
      <div class="flex flex-col gap-2 mt-2" v-if="message.attachments.length > 0">
        <a
          v-for="image in message.attachments"
          :key="image"
          :href="image.file_url"
          :download="image.original_name"
          target="_blank"
        >
        <div class="flex gap-2 items-center w-[150px] bg-[#F0FAFC] py-3 px-2 text-[#3EC6D9] rounded-[5px]">
          <div class="icon">
            <UIcon name="mage:file-download" class="size-[30px]!"/>
          </div>
          <div class="image-detail flex-col">
            <span class="file-name block truncate max-w-[100px]">{{ image.original_name }}</span>
            <span class="file-size">{{ image.file_size_human }}</span>
          </div>
        </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(["items"]);

const authStore = useAuthStore();
console.log(authStore.user);
</script>

<style>
@reference "tailwindcss";

.left-message {
  @apply ms-auto w-fit max-w-[80%] rounded-[8px] bg-blue-500 text-white py-3 px-4;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
.right-message {
  @apply me-auto w-fit max-w-[80%] rounded-[8px];
}
.x {
  clip-path: polygon(12% 100%, 88% 100%, 100% 0, 0 0);
}
</style>