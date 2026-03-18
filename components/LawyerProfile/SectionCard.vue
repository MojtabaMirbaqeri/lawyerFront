<template>
  <section
    :id="sectionId"
    class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
    <div class="border-b border-slate-200/80 bg-slate-50/60 px-4 py-3">
      <h2 class="flex items-center gap-2 text-lg font-bold text-slate-800">
        <span class="h-1 w-1 rounded-full bg-primary" />
        {{ title }}
      </h2>
      <p v-if="subtitle" class="mt-1 text-sm text-slate-500">{{ subtitle }}</p>
    </div>
    <div class="p-4 sm:p-5">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  sectionId: { type: String, default: "" },
});
</script>
