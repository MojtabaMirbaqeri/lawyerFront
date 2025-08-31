<template>
  <section v-if="recentComments?.data?.length" id="commments">
    <h2 class="sec-header mb-2 lg:mb-3">دیدگاه و نظرات کاربران</h2>

    <ThingCarousel
      ref="carouselRef"
      :plugins="[Autoplay({ delay: 3500 })]"
      :opts="{ align: 'start', loop: true }"
      class="carousel-wrapper"
      style="direction: ltr !important"
    >
      <button class="handler-button" @click="scrollPrev">
        <UIcon name="proicons:chevron-left" />
      </button>

      <ThingCarouselContent class="p-[1px]" style="direction: ltr !important">
        <ThingCarouselItem
          v-for="comment in recentComments?.data"
          :key="comment?.id"
          grab-cursor
          class="md:basis-1/2 lg:basis-1/3"
        >
          <CommentBox :comment-detail="comment" />
        </ThingCarouselItem>
      </ThingCarouselContent>

      <button class="handler-button" @click="scrollNext">
        <UIcon name="proicons:chevron-right" />
      </button>
    </ThingCarousel>
  </section>
</template>

<script setup>
import { ref } from "vue";
import Autoplay from "embla-carousel-autoplay";

const carouselRef = ref(null);

const scrollPrev = () => {
  carouselRef.value?.scrollPrev?.();
};

const scrollNext = () => {
  carouselRef.value?.scrollNext?.();
};

const { data: recentComments } = await useGet({ url: "reviews/recent" });
</script>

<style scoped>
@reference "tailwindcss";

.carousel-wrapper {
  @apply relative flex w-full items-center gap-3;
}

.handler-button {
  @apply hidden xl:block relative size-9 shrink-0 rounded-full border border-gray-200 bg-white cursor-pointer transition hover:border-gray-300;
}

.handler-button .iconify {
  @apply absolute top-1/2 end-1/2 -translate-1/2 size-4!;
}
</style>
