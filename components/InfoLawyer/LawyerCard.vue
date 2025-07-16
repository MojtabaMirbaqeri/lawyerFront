<template>
  <section>
    <div class="container">
      <div
        class="bg-white flex flex-col lg:flex-row justify-between gap-3 p-4 rounded-[14px]"
      >
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
              <UIBadge
                v-if="active"
                value="فعال"
                icon="mynaui:clock-square-solid"
              />
            </div>
            <div class="education">{{ education }}</div>
            <div class="experience">تجربه: {{ experience }} سال</div>
          </div>
        </div>
        <div class="left flex flex-col lg:items-end gap-3">
          <div class="top flex gap-2">
            <UIBadge
              variant="yellow"
              icon-size="text-[14px]!"
              :value="rate"
              icon="ic:round-star"
            />
            <UIBadge
              :value="`${visit} ویزیت آنلاین`"
              icon="solar:chat-dots-bold"
            />
            <UIBadge
              variant="gray"
              :value="city"
              icon="material-symbols:location-on-rounded"
            />
          </div>
          <div class="buttons flex gap-2">
            <UIMainBtn>دیدگاه دیگران</UIMainBtn>
            <UIMainBtn>اشتراک گذاری</UIMainBtn>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const show = ref(true);

defineProps([
  "avatar",
  "education",
  "experience",
  "visit",
  "rate",
  "city",
  "active",
  "fullname",
]);
</script>

<style></style>