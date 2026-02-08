<template>
  <section class="flex space-y-3 flex-col">
    <div v-if="profileLoading" class="flex justify-center py-12">
      <UIcon name="svg-spinners:90-ring-with-bg" class="size-8 text-primary" />
    </div>
    <template v-else-if="lawyerInformation">
      <UTabs
        v-model="activeTab"
        color="primary"
        variant="link"
        :items="tabItems"
        class="ds-table-con">
        <template #profile>
          <DashboardLawyerProfile :lawyer-information="lawyerInformation" />
        </template>
        <template #personal_information>
          <DashboardLawyerPersonalInformation
            :lawyer-information="lawyerInformation" />
        </template>
        <template #experience>
          <DashboardLawyerExperience />
        </template>
        <template #schedule>
          <DashboardLawyerSchedule :lawyer-information="lawyerInformation" />
        </template>
        <template #authentication>
          <DashboardLawyerAuthentication :lawyer-information="lawyerInformation" />
        </template>
      </UTabs>
    </template>
    <UAlert
      v-else
      color="warning"
      variant="subtle"
      title="اطلاعات وکیل یافت نشد"
      description="امکان بارگذاری پروفایل وجود ندارد. لطفاً صفحه را رفرش کنید."
    />
  </section>
</template>

<script setup>
const authStore = useAuthStore();
const lawyerInformation = ref(null);
const profileLoading = ref(true);

// تعریف tabItems و activeTab قبل از await برای جلوگیری از مشکل initialization
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

let refreshFn = () => Promise.resolve();
if (authStore.user?.lawyer_id) {
  const lawyerInformationRes = await useGet({
    url: `lawyers/${authStore.user.lawyer_id}`,
    includeAuthHeader: true,
  });
  lawyerInformation.value = lawyerInformationRes.data?.data ?? lawyerInformationRes.data ?? null;
  if (lawyerInformationRes.refresh) {
    refreshFn = async () => {
      const updated = await lawyerInformationRes.refresh();
      lawyerInformation.value = updated?.data ?? updated ?? null;
    };
  }
}
profileLoading.value = false;
provide("reFetchLawyerInformation", refreshFn);
</script>
