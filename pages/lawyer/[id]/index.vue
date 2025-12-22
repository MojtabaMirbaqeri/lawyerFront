<template>
  <div class="flex justify-center items-center h-screen">
    <MainLoader />
  </div>
</template>

<script setup>
const route = useRoute();
const id = route.params.id;

// Fetch lawyer name to construct the slug
const { data } = await useGet({ url: `lawyers/${id}` }, "");
const lawyer = data.data;

if (lawyer) {
  const fullname = `${lawyer.lawyer_info?.name || ""} ${
    lawyer.lawyer_info?.family || ""
  }`.trim().replace(/\s+/g, "-");
  
  // SEO-friendly 301 Redirect
  await navigateTo(`/lawyer/${id}/${fullname || "profile"}`, {
    redirectCode: 301,
    external: true // Forces full navigation which is safer for SEO redirects
  });
} else {
  // Fallback if lawyer not found
  console.error("Lawyer not found for redirect");
  // Optional: navigate home or 404
}
</script>
