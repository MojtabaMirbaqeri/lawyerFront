<template>
  <div>
    <ChatTest />
  </div>
</template>

<script setup>
// اگر نیاز به محدودیت SSR داری
definePageMeta({
  ssr: false // چون WebSocket فقط client-side هست
})
</script>