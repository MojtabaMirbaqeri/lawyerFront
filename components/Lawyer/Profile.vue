<template>
  <div class="right lg:w-[50%] flex items-center gap-2" :class="[ui?.base]">
    <div class="avatar aspect-square! shrink-0!" :class="[ui?.avatar]">
      <UChip
        inset
        class="size-full"
        :show="show"
        position="bottom-right"
        :ui="{ base: 'bg-blue-400 size-3 right-[10%]' }"
      >
        <UAvatar
          class="size-full"
          :src="avatar"
          :ui="{
            image: 'object-[50%_0%]',
          }"
        />
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
      <div>
        {{ experience ? `تجربه: ${experience} سال` : `محل کار: ${location}` }}
      </div>
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
  "location",
]);
</script>

<style>
</style>