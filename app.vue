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

const [lawyerTypesRes, lawyerSpecialtiesRes, lawyerServicesRes] =
  await Promise.all([
    useGet({ url: "lawyer_bases" }),
    useGet({ url: "specialties" }),
    useGet({ url: "services" }),
  ]);
filtersStore.setLawyerTypes(lawyerTypesRes.data.data);
filtersStore.setLawyerSpecialties(lawyerSpecialtiesRes.data.data);
filtersStore.setLawyerServices(lawyerServicesRes.data.data);

filtersStore.setHydrated(true);

onMounted(async () => {
  const loaderStore = useLoaderStore();
  await useAuthStore().ensureUser();
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
