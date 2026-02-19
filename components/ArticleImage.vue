<template>
  <NuxtImg
    v-if="src"
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :sizes="sizes"
    :fetchpriority="fetchpriority"
    class="block bg-gray-50 object-contain transition group-hover:scale-105"
    :class="imageClass"
  />
</template>

<script setup>
const props = defineProps({
  /** Image path or full URL from API (e.g. /storage/articles/... or full URL) */
  image: { type: String, default: "" },
  alt: { type: String, default: "" },
  /** 'card' = list thumbnail, 'single' = article page */
  variant: { type: String, default: "card" },
  loading: { type: String, default: "lazy" },
  fetchpriority: { type: String, default: undefined },
  imageClass: { type: String, default: "" },
});

const src = computed(() => useArticleImageUrl(props.image));

const width = computed(() => (props.variant === "single" ? 800 : 300));
const height = computed(() => (props.variant === "single" ? 280 : 112));
const sizes = computed(() =>
  props.variant === "single" ? "(min-width: 768px) 800px, 100vw" : "(min-width: 1024px) 300px, (min-width: 768px) 50vw, 100vw"
);
</script>
