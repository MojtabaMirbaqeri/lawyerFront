<template>
  <section>
    <div class="">
      <div class="bg-white flex flex-col gap-3 p-4 rounded-[14px]">
        <div class="flex flex-col lg:flex-row justify-between gap-3">
          <div class="right lg:w-[50%] flex items-center gap-2">
            <div class="avatar aspect-square! shrink-0!">
              <UChip
                inset
                class="size-[74px]"
                :show="show"
                position="bottom-right"
                :ui="{ base: 'bg-[#1e3a5f] size-3 right-[10%]' }">
                <UAvatar
                  class="size-full"
                  :src="
                    avatar !== null
                      ? config.public.imageBase + avatar
                      : '/images/nullavatar.png'
                  "
                  :alt="fullname"
                  :ui="{ image: 'object-[50%_0%]' }" />
              </UChip>
            </div>
            <div class="person-detail w-full">
              <h1
                class="fullname font-semibold flex justify-between lg:justify-start lg:gap-2">
                {{ fullname }}
                <UICBadge v-if="active" value="فعال" icon="mynaui:clock-square-solid" />
              </h1>
              <div class="education">{{ education }}</div>
              <!-- <div class="experience">
                تجربه: {{ experience !== null ? experience : 0 }} سال
              </div> -->
            </div>
          </div>
          <div class="left flex flex-col lg:items-end gap-3">
            <div class="top flex gap-2">
              <UICBadge
                variant="yellow"
                icon-size="text-[14px]!"
                :value="rate"
                icon="ic:round-star" />
              <!-- <UICBadge
              :value="`${visit} مشاوره آنلاین`"
              icon="solar:chat-dots-bold"
            /> -->
              <UICBadge
                variant="gray"
                :value="city || 'ثبت نشده'"
                icon="material-symbols:location-on-rounded" />
            </div>
            <div class="buttons flex gap-2">
              <UICMainBtn
                @click="
                  navigateTo(
                    `/lawyer/${$route.params.id}/${fullname.trim().replace(/\s+/g, '-')}`
                  )
                "
                >دیدگاه دیگران</UICMainBtn
              >
              <UICMainBtn @click="shareContent">اشتراک گذاری</UICMainBtn>
            </div>
          </div>
        </div>
        <div class="">
          <div class="mb-3">تخصص های من :</div>
          <div class="flex flex-wrap gap-4">
            <div class="" v-for="s in spc" :key="s">
              <UICBadge :value="'# ' + filterStore?.lawyerSpecialties[s]?.title" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const show = ref(true);

const props = defineProps([
  "avatar",
  "education",
  "experience",
  "visit",
  "rate",
  "city",
  "active",
  "fullname",
  "spc",
]);

const filterStore = useFiltersStore();

const config = useRuntimeConfig();
console.log(config.public.apiEndpoint);

const shareContent = async () => {
  const shareData = {
    title: `${props.fullname} ${props.education}`,
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
</script>

<style></style>
