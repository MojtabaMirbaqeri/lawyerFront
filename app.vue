<template>
  <UApp>
    <a href="#main" class="skip-link">پرش به محتوا</a>
    <MainLoader />
    <NuxtLoadingIndicator :height="4" />
    <NuxtLayout dir="rtl">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>
const filtersStore = useFiltersStore();

// Fetch filter data in background so first paint is not blocked
const safeData = (res) => (res?.status && res?.data?.data != null ? res.data.data : []);
Promise.all([
  useGet({ url: "lawyer_bases" }),
  useGet({ url: "specialties" }),
  useGet({ url: "services" }),
]).then(([lawyerTypesRes, lawyerSpecialtiesRes, lawyerServicesRes]) => {
  filtersStore.setLawyerTypes(safeData(lawyerTypesRes));
  filtersStore.setLawyerSpecialties(safeData(lawyerSpecialtiesRes));
  filtersStore.setLawyerServices(safeData(lawyerServicesRes));
  filtersStore.setHydrated(true);
});

onMounted(async () => {
  const loaderStore = useLoaderStore();
  const AUTH_TIMEOUT_MS = 10000; // حداکثر ۱۰ ثانیه انتظار برای وضعیت احراز هویت
  try {
    await Promise.race([
      useAuthStore().ensureUser(),
      new Promise((resolve) => setTimeout(resolve, AUTH_TIMEOUT_MS)),
    ]);
  } catch (e) {
    // ensureUser failed; still hide loader so page is usable
  } finally {
    loaderStore.hideLoader();
  }
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
<style>
.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  padding: 0.75rem 1rem;
  background: var(--ui-primary, #1e3a5f);
  color: white;
  z-index: 9999;
  font-size: 0.875rem;
  border-radius: 0 0 0.25rem 0;
  transition: top 0.2s;
}
.skip-link:focus {
  top: 0;
  outline: 2px solid white;
  outline-offset: 2px;
}
</style>
