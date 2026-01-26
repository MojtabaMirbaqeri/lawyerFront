<template>
  <section v-if="recentComments?.data?.length" id="comments" class="comments-section">
    <!-- Section Header -->
    <div class="section-header">
      <h2 class="sec-header">
        <span class="gradient-text">دیدگاه و نظرات</span> کاربران
      </h2>
      <p class="section-subtitle">نظرات واقعی کاربران درباره تجربه مشاوره با وکلا</p>
    </div>

    <div class="carousel-container">
      <ThingCarousel
        ref="carouselRef"
        :plugins="[Autoplay({ delay: 3500 })]"
        :opts="{ align: 'start', loop: true }"
        class="carousel-wrapper"
        style="direction: ltr !important"
      >
        <button class="handler-button handler-prev" @click="scrollPrev">
          <UIcon name="heroicons:chevron-left-solid" />
        </button>

        <ThingCarouselContent class="p-[1px]" style="direction: ltr !important">
          <ThingCarouselItem
            v-for="comment in recentComments?.data"
            :key="comment?.id"
            grab-cursor
            class="md:basis-1/2 lg:basis-1/3"
          >
            <CommentBox :comment-detail="comment" class="comment-card-enhanced" />
          </ThingCarouselItem>
        </ThingCarouselContent>

        <button class="handler-button handler-next" @click="scrollNext">
          <UIcon name="heroicons:chevron-right-solid" />
        </button>
      </ThingCarousel>
    </div>
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

.comments-section {
  @apply relative py-16 lg:py-20;
}

.section-header {
  @apply text-center mb-10;
}

.section-subtitle {
  @apply text-gray-500 text-base lg:text-lg mt-2;
}

.carousel-container {
  @apply relative;
}

.carousel-wrapper {
  @apply relative flex w-full items-center gap-3;
}

.handler-button {
  @apply hidden xl:flex relative size-12 shrink-0 rounded-full items-center justify-center cursor-pointer transition-all duration-300 text-[#1e3a5f];
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35);
}

.handler-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.45);
}

.handler-button .iconify {
  @apply size-5!;
}

.comment-card-enhanced {
  transition: all 0.3s ease;
}

.comment-card-enhanced:hover {
  transform: translateY(-2px);
}

/* Gradient text utility */
.gradient-text {
  background: linear-gradient(135deg, #1e3a5f, #2d5a87);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>

