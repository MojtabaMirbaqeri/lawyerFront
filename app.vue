<template>
  <UApp>
    <NuxtLoadingIndicator :height="4" />
    <NuxtLayout dir="rtl">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>
import { useFiltersStore } from "./store/filters";

const jwtToken = useCookie("jwtToken");
jwtToken.value = "9|G2ekpZdu3hYO4xFjyfbCBMH9JApDxp0yr5cM9pf0c0242e2b";

const filtersStore = useFiltersStore();

const [lawyerTypesRes, lawyerSpecialtiesRes] = await Promise.all([
  useGet({ url: "lawyer_bases" }),
  useGet({ url: "specialties" }),
]);

lawyerTypesRes.data.data.unshift({
  id: 0,
  title: "همه",
});
filtersStore.setLawyerTypes(lawyerTypesRes.data.data);
filtersStore.setLawyerSpecialties(lawyerSpecialtiesRes.data.data);
</script>
