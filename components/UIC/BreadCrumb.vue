<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <section>
    <div class="container">
      <UBreadcrumb
        :items="items"
        :ui="{
          root: 'p-1.5',
          separatorIcon: 'rotate-180',
          link: 'text-gray',
          item: 'text-sm font-medium text-gray',
        }"
        class=""
      />
    </div>
  </section>
</template>
