<template>
  <section>
    <div class="">
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
              <UAvatar
                class="w-full h-full"
                :src="avatar !== null ? avatar : '/images/null-avatar.png'"
              />
            </UChip>
          </div>
          <div class="person-detail w-full">
            <div
              class="fullname font-semibold flex justify-between lg:justify-start lg:gap-2"
            >
              {{ fullname }}
              <UICBadge
                v-if="active"
                value="فعال"
                icon="mynaui:clock-square-solid"
              />
            </div>
            <div class="education">{{ education }}</div>
            <div class="experience">
              تجربه: {{ experience !== null ? experience : 0 }} سال
            </div>
          </div>
        </div>
        <div class="left flex flex-col lg:items-end gap-3">
          <div class="top flex gap-2">
            <UICBadge
              variant="yellow"
              icon-size="text-[14px]!"
              :value="rate"
              icon="ic:round-star"
            />
            <!-- <UICBadge
              :value="`${visit} ویزیت آنلاین`"
              icon="solar:chat-dots-bold"
            /> -->
            <UICBadge
              variant="gray"
              :value="city"
              icon="material-symbols:location-on-rounded"
            />
          </div>
          <div class="buttons flex gap-2">
            <UICMainBtn>دیدگاه دیگران</UICMainBtn>
            <UICMainBtn @click="shareContent">اشتراک گذاری</UICMainBtn>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const show = ref(true);

const shareContent = async () => {
  const shareData = {
    title: "عنوان مطلب",
    text: "این یک مطلب جالب است!",
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      alert("مرورگر شما از Web Share API پشتیبانی نمی‌کند.");
    }
  } catch (err) {
    console.error("خطا در اشتراک‌گذاری:", err);
  }
};

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