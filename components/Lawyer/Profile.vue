<template>
  <div class="right lg:w-[50%] flex items-center gap-2" :class="[ui?.base]">
    <div class="avatar aspect-square! shrink-0!" :class="[ui?.avatar]">
      <UChip
        inset
        class="size-full"
        :show="show"
        position="bottom-right"
        :ui="{ base: 'bg-blue-400 size-3 right-[10%]' }">
        <UAvatar
          class="size-full"
          :src="
            information.lawyer_info.profile_image
              ? `${useRuntimeConfig().public.imageBase}${
                  information.lawyer_info.profile_image
                }`
              : '/images/null-avatar.png'
          "
          :ui="{
            image: 'object-[50%_0%]',
          }" />
      </UChip>
    </div>
    <div class="person-detail w-full">
      <div
        class="fullname font-semibold flex justify-between lg:justify-start lg:gap-2"
        :class="[ui?.name]">
        {{ `${information.lawyer_info.name} ${information.lawyer_info.family}` }}
        <div class="flex items-center gap-1">
          <slot name="badges" />
          <UICBadge
            :value="information.is_active ? 'فعال' : 'غیرفعال'"
            icon="mynaui:clock-square-solid"
            :variant="information.is_active ? 'blue' : 'gray'" />
        </div>
      </div>
      <div class="education">{{ information.base }}</div>
      <div>
        {{
          showExperience
            ? `تجربه: ${information?.years_of_experience ?? "ثبت نشده"} سال`
            : information?.province && information?.city
            ? `محل کار: ${information.province}، ${information.city}`
            : information?.province
            ? `محل کار: ${information.province}`
            : information?.city
            ? `محل کار: ${information.city}`
            : "محل کار: ثبت نشده"
        }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(["information", "show", "ui", "showExperience"]);
</script>

<style></style>
