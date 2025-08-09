<template>
  <UApp>
    <MainLoader />
    <NuxtLoadingIndicator :height="4" />
    <NuxtLayout dir="rtl">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>
const filtersStore = useFiltersStore();

const [lawyerTypesRes, lawyerSpecialtiesRes] = await Promise.all([
  useGet({ url: "lawyer_bases" }),
  useGet({ url: "specialties" }),
]);
filtersStore.setLawyerTypes(lawyerTypesRes.data.data);
filtersStore.setLawyerSpecialties(lawyerSpecialtiesRes.data.data);

onMounted(async () => {
  const loaderStore = useLoaderStore();
  // const authStore = useAuthStore();

  loaderStore.toggleVisiblity();
  document.body.classList.add("overflow-auto!");

  const observer = new MutationObserver(() => {
    document.body.style.setProperty("padding-right", "0px", "important");
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["style"],
  });
});
</script>
