<template>
  <div class="messages flex flex-col gap-3" v-for="item in items" :key="item">
    <USeparator >
        <template #default>
            <div class="x py-1 px-5 bg-gray-200/55">{{ new Date(item.date).toLocaleDateString('fa') }}</div>
        </template>
    </USeparator>

    <div
      :class="{
        'left-message': authStore.user.user_type != message.user.type,
        'right-message primary-box':
          authStore.user.user_type == message.user.type,
      }"
      class=""
      v-for="message in item.messages"
      :key="message"
    >
      {{ message.message }}
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
.x{
    clip-path: polygon(12% 100%, 88% 100%, 100% 0, 0 0);
}
</style>