<template>
  <LawyerProfileSectionCard
    v-if="items.length"
    section-id="publications"
    title="مقالات و نوشته‌ها">
    <div class="space-y-3">
      <article
        v-for="item in items"
        :key="item.id"
        class="rounded-xl border border-slate-200 p-4">
        <NuxtLink
          :to="`/articles/${item.slug}`"
          class="text-sm font-semibold text-slate-800 hover:text-primary">
          {{ item.title }}
        </NuxtLink>
        <p v-if="item.summary" class="mt-1 text-sm text-slate-600 line-clamp-2">
          {{ item.summary }}
        </p>
      </article>
    </div>
  </LawyerProfileSectionCard>
</template>

<script setup>
defineProps({ items: { type: Array, default: () => [] } });
</script>
