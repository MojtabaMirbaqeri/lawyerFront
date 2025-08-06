<template>
  <Transition name="page">
    <div v-if="loaderStore.isVisible" class="loader-con">
      <div class="dots"></div>
    </div>
  </Transition>
</template>
<script setup>
const loaderStore = useLoaderStore();
</script>



<style scoped>
@reference "tailwindcss";
.loader-con {
  @apply h-svh w-svw bg-white flex items-center justify-center fixed top-0 start-0 z-[101];
}
.dots {
  width: 56px;
  height: 26.9px;
  background: radial-gradient(circle closest-side, var(--ui-primary) 90%, #0000) 0% 50%,
    radial-gradient(circle closest-side, var(--ui-primary) 90%, #0000) 50% 50%,
    radial-gradient(circle closest-side, var(--ui-primary) 90%, #0000) 100% 50%;
  background-size: calc(100% / 3) 13.4px;
  background-repeat: no-repeat;
  animation: dots-7ar3yq 1s infinite linear;
}

@keyframes dots-7ar3yq {
  20% {
    background-position: 0% 0%, 50% 50%, 100% 50%;
  }

  40% {
    background-position: 0% 100%, 50% 0%, 100% 50%;
  }

  60% {
    background-position: 0% 50%, 50% 100%, 100% 0%;
  }

  80% {
    background-position: 0% 50%, 50% 50%, 100% 100%;
  }
}
</style>