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

// Only run API calls on client side to avoid SSR issues during static generation
const isClient = process.client;

if (isClient) {
  console.log(useCookie("jwtToken"));
}

// Initialize with empty data for static generation
filtersStore.setLawyerTypes([]);
filtersStore.setLawyerSpecialties([]);
filtersStore.setLawyerServices([]);

onMounted(async () => {
  const loaderStore = useLoaderStore();
  
  // Only fetch data on client side
  if (isClient) {
    try {
      const [lawyerTypesRes, lawyerSpecialtiesRes, lawyerServicesRes] =
        await Promise.all([
          useGet({ url: "lawyer_bases" }),
          useGet({ url: "specialties" }),
          useGet({ url: "services" }),
        ]);
      
      if (lawyerTypesRes.status && lawyerTypesRes.data?.data) {
        filtersStore.setLawyerTypes(lawyerTypesRes.data.data);
      }
      if (lawyerSpecialtiesRes.status && lawyerSpecialtiesRes.data?.data) {
        filtersStore.setLawyerSpecialties(lawyerSpecialtiesRes.data.data);
      }
      if (lawyerServicesRes.status && lawyerServicesRes.data?.data) {
        filtersStore.setLawyerServices(lawyerServicesRes.data.data);
      }
    } catch (error) {
      console.warn('Failed to load filter data:', error);
    }
    
    await useAuthStore().ensureUser();
  }

  filtersStore.setHydrated(true);
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
