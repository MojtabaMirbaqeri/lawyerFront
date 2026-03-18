<template>
  <LawyerProfileSectionCard
    v-if="about"
    section-id="about"
    title="معرفی وکیل"
    subtitle="مروری کوتاه بر تخصص و شیوه ارائه خدمات">
    <p class="text-sm leading-7 text-slate-700" v-html="contentToShow" />
    <button
      v-if="isLong"
      type="button"
      class="mt-3 text-sm font-semibold text-primary"
      @click="expanded = !expanded">
      {{ expanded ? "نمایش کمتر" : "نمایش بیشتر" }}
    </button>
  </LawyerProfileSectionCard>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  about: { type: String, default: "" },
});

const expanded = ref(false);
const maxChars = 260;
const normalized = computed(() => (props.about || "").replace(/\n/g, "<br/>"));
const isLong = computed(() => (props.about || "").length > maxChars);
const contentToShow = computed(() =>
  !isLong.value || expanded.value
    ? normalized.value
    : `${normalized.value.slice(0, maxChars)}...`,
);
</script>
