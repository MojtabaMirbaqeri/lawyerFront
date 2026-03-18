<template>
  <LawyerProfileSectionCard
    v-if="contactItems.length"
    section-id="contact"
    title="اطلاعات تماس">
    <ul class="space-y-2 text-sm">
      <li
        v-for="item in contactItems"
        :key="item.key"
        class="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3">
        <span class="text-slate-500">{{ item.label }}</span>
        <a
          class="font-medium text-primary hover:underline ltr"
          :href="item.href"
          target="_blank"
          rel="noopener noreferrer">
          {{ item.value }}
        </a>
      </li>
    </ul>
  </LawyerProfileSectionCard>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  links: { type: Object, default: () => ({}) },
});

const contactItems = computed(() => {
  const map = [
    { key: "website", label: "وب‌سایت" },
    { key: "linkedin", label: "لینکدین" },
    { key: "instagram", label: "اینستاگرام" },
    { key: "telegram", label: "تلگرام" },
  ];

  return map
    .filter((item) => props.links?.[item.key])
    .map((item) => ({
      ...item,
      value: props.links[item.key],
      href: props.links[item.key],
    }));
});
</script>
