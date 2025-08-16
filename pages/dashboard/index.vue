<template>
  <section>
    <div>
      <!-- <LandingLawyersSection /> -->
      ssads
    </div>
  </section>
</template>

<script setup>
onMounted(() => {
  const authStore = useAuthStore();

  switch (authStore.user?.user_type) {
    case "admin":
      navigateTo("/dashboard/admin");
      break;
    case "lawyer":
      navigateTo("/dashboard/lawyer");
      break;
  }
});
</script>

<style>
</style>