<template>
  <UApp>
    <NuxtLoadingIndicator :height="4" />
    <NuxtLayout dir="rtl">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>
import { useFiltersStore } from "./stores/filters";

const jwtToken = useCookie("jwtToken");
jwtToken.value = "46|8b26u5jtAKJKjKS3iawBBs8SuRCsTYUaGxiVsv1Bc8ef5204";

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
