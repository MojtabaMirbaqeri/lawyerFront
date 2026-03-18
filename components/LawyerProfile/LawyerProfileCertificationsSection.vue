<template>
  <LawyerProfileSectionCard
    v-if="items.length"
    section-id="certifications"
    title="گواهی‌ها و مجوزها">
    <div class="grid gap-3">
      <article
        v-for="(item, index) in items"
        :key="item.id || index"
        class="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
        <p class="font-semibold text-slate-800">{{ item.title || item.license_type }}</p>
        <p v-if="item.issuing_body" class="mt-1 text-sm text-slate-600">
          {{ item.issuing_body }}
        </p>
        <p class="mt-1 text-xs text-slate-500">
          <span v-if="item.year">سال {{ item.year }}</span>
          <span v-if="item.verification_status">
            {{ item.year ? " | " : "" }}{{ item.verification_status }}
          </span>
        </p>
        <p v-if="item.description" class="mt-2 text-sm text-slate-600">{{ item.description }}</p>
      </article>
    </div>
  </LawyerProfileSectionCard>
</template>

<script setup>
defineProps({ items: { type: Array, default: () => [] } });
</script>
