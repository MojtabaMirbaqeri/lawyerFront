<template>
  <div class="right lg:w-[50%] flex items-center gap-2">
    <div class="avatar max-w-[74px] w-full">
      <UChip
        inset
        class="size-full"
        :show="show"
        position="bottom-right"
        :ui="{ base: 'bg-blue-400 size-3 right-[10%]' }"
      >
        <UAvatar class="w-full h-full" :src="avatar" />
      </UChip>
    </div>
    <div class="person-detail w-full">
      <div
        class="fullname font-semibold flex justify-between lg:justify-start lg:gap-2"
      >
        {{ fullname }}
        <UIBadge v-if="active" value="فعال" icon="mynaui:clock-square-solid" />
      </div>
      <div class="education">{{ education }}</div>
      <div class="experience">تجربه: {{ experience }} سال</div>
    </div>
  </div>
</template>

<script setup>
defineProps(["avatar", "education", "experience", "fullname"]);
</script>

<style>
</style>