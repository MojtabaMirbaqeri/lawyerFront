<template>
  <div class="right lg:w-[50%] flex items-center gap-2" :class="[ui?.base]">
    <div class="avatar max-w-[74px] w-full" :class="[ui?.avatar]">
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
        :class="[ui?.name]"
      >
        {{ fullname }}
        <div class="flex items-center gap-1">
          <slot name="badges" />
          <UICBadge
            :value="active ? 'فعال' : 'غیرفعال'"
            icon="mynaui:clock-square-solid"
            :variant="active ? 'blue' : 'gray'"
          />
        </div>
      </div>
      <div class="education">{{ education }}</div>
      <div class="experience">تجربه: {{ experience }} سال</div>
    </div>
  </div>
</template>

<script setup>
defineProps([
  "avatar",
  "education",
  "experience",
  "fullname",
  "active",
  "show",
  "ui",
]);
</script>

<style>
</style>