<script setup lang="ts">

const items = ref([
  {
    label: 'خانه',
    to: '/'
  },
  {
    label: 'جزییات وکیل',
    to: '/lawyer/4'
  }
])
</script>

<template>
    <section>
    <div class="container">
        <UBreadcrumb :items="items" :ui="{root:'p-1.5',separatorIcon:'rotate-180',link:'text-gray',item:'text-sm font-medium text-gray'}" class=""/>
    </div>
  </section>
</template>
