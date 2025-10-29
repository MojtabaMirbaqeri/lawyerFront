<template>
  <section>
    <div />
  </section>
</template>

<script setup>
onMounted(() => {
  const authStore = useAuthStore();

  switch (authStore.user?.user_type) {
    case "admin":
      navigateTo("/dashboard/admin/lawyerlist");
      break;
    case "lawyer":
      if (authStore.user?.lawyer_id) {
        navigateTo("/dashboard/lawyer/profile");
      }
      break;
  }
});
useHead({
  title: "داشبورد | وکیل وکیل",
});
</script>

<style></style>
