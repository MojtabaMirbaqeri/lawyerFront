<template>
  <div class="lawyers-menu">
    <div class="menu-section">
      <h2 class="menu-heading">استان ها</h2>
      <hr class="menu-divider" />
      <div class="menu-list">
        <NuxtLink
          v-for="province in provinces"
          :key="province.id"
          :to="province.to"
          class="menu-item"
          @click="closeMenu">
          <UIcon name="lucide:map-pin" class="size-4! text-gray-500 shrink-0" />
          <span>{{ province.label }}</span>
        </NuxtLink>
      </div>
    </div>

    <div v-if="specialties.length > 0" class="menu-section">
      <h2 class="menu-heading">تخصص ها</h2>
      <hr class="menu-divider" />
      <div class="menu-list">
        <NuxtLink
          v-for="specialty in specialties"
          :key="specialty.id"
          :to="specialty.to"
          class="menu-item"
          @click="closeMenu">
          <UIcon name="lucide:target" class="size-4! text-gray-500 shrink-0" />
          <span>{{ specialty.label }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["close"]);

const props = defineProps({
  provinces: {
    type: Array,
    default: () => [],
  },
  specialties: {
    type: Array,
    default: () => [],
  },
});

const closeMenu = () => {
  emit("close");
};
</script>

<style scoped>
@reference "tailwindcss";

.lawyers-menu {
  @apply grid grid-cols-2 gap-6;
}

.menu-section {
  @apply space-y-3;
}

.menu-heading {
  @apply text-base font-bold text-gray-800;
}

.menu-divider {
  @apply border-gray-200;
}

.menu-list {
  @apply space-y-1.5 max-h-[65vh] overflow-y-auto;
  scrollbar-width: thin;
  scrollbar-color: #c0c0c0 transparent;
}

.menu-item {
  @apply flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors no-underline;
}

.menu-item:active {
  @apply bg-gray-100;
}
</style>
