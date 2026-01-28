<template>
  <div class="comment-user">
    <div class="user-avatar">
      <UIcon
        name="hugeicons:user-circle-02"
        class="size-6! absolute -translate-1/2 top-1/2 end-1/2 text-[#1e3a5f]"
      />
    </div>
    <div
      class="user-info"
      :class="{
        'flex-col-reverse!': reverse,
      }"
    >
      <h5 class="text-sm text-gray">{{ detail?.text }}</h5>
      <h3 class="user-name">{{ detail?.name }}</h3>
    </div>
  </div>
</template>
<script setup>
defineProps({
  detail: {
    type: Object,
  },
  reverse: {
    default: false,
    type: Boolean,
  },
});
</script>
<style scoped>
@reference "tailwindcss";
.comment-user {
  @apply flex items-center gap-2.5 min-w-0;
}

.user-avatar {
  @apply size-9 lg:size-10 rounded-full bg-[#e8edf5] relative shrink-0;
}

.user-info {
  @apply min-w-0 flex flex-col;
}

.user-name {
  @apply font-semibold truncate whitespace-nowrap overflow-hidden;
}
</style>