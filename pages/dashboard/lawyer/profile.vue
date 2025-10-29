<template>
  <section class="flex space-y-3 flex-col">
    <UTabs
      v-model="activeTab"
      color="primary"
      variant="link"
      :items="tabItems"
      class="ds-table-con">
      <template #profile>
        <DashboardLawyerProfile :lawyer-information="lawyerInformation.data" />
      </template>
      <template #personal_information>
        <DashboardLawyerPersonalInformation
          :lawyer-information="lawyerInformation.data" />
      </template>
      <template #experience>
        <DashboardLawyerExperience />
      </template>
      <template #schedule>
        <DashboardLawyerSchedule />
      </template>
      <template #authentication>
        <DashboardLawyerAuthentication :lawyer-information="lawyerInformation.data" />
      </template>
    </UTabs>
  </section>
</template>

<script setup>
const authStore = useAuthStore();
const lawyerInformation = ref(null);

const lawyerInformationRes = await useGet({
  url: `lawyers/${authStore.user?.lawyer_id}`,
  includeAuthHeader: true,
});
lawyerInformation.value = lawyerInformationRes.data;

const reFetchLawyerInformation = async () => {
  lawyerInformation.value = await lawyerInformationRes.refresh();
};

provide("reFetchLawyerInformation", reFetchLawyerInformation);

const tabItems = ref([
  {
    label: "پروفایل",
    value: "profile",
    slot: "profile",
  },
  {
    label: "اطلاعات شخصی",
    value: "personal_information",
    slot: "personal_information",
  },
  {
    label: "تحصیلات/سابقه کاری",
    value: "experience",
    slot: "experience",
  },
  {
    label: "محل کار/ساعت کاری",
    value: "schedule",
    slot: "schedule",
  },
  {
    label: "احراز هویت مدارک",
    value: "authentication",
    slot: "authentication",
  },
]);

const activeTab = ref(tabItems.value[0].value);
useHead({
  title: "پروفایل | وکیل وکیل",
});
</script>
