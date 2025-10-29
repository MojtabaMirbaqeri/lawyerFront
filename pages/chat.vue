<template>
  <div>
    <nuxt-layout name="dashboard" :chatItems="[chatStore.chatRooms]">
      <ChatTest :roomID="1" />
    </nuxt-layout>
  </div>
</template>

<script setup>
// اگر نیاز به محدودیت SSR داری
definePageMeta({
  ssr: false, // چون WebSocket فقط client-side هست
  layout: false,
});
const chatStore = useChatStore();
useHead({
  title: "گفتگو | وکیل وکیل",
});

const res = await useGet({ url: "chat/rooms/", includeAuthHeader: true });
console.log(res.data);
chatStore.chatRooms = res.data.data.data.rooms;
console.log(chatStore.chatRooms);
</script>
