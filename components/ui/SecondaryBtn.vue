<template>
  <button>
    <slot />
  </button>
</template>
  <style scoped>
@reference "tailwindcss";
button {
  @apply text-sm py-2 px-4 rounded-full bg-blue-400 text-white cursor-pointer hover:opacity-80 transition duration-300;
  @apply flex items-center gap-1.5;
}
</style>