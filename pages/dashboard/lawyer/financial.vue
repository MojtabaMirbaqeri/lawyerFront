<template>
  <section class="flex space-y-3 flex-col">
    <UTabs
      v-model="activeTab"
      color="primary"
      variant="link"
      :items="tabItems"
      :ui="{ trigger:'shrink-0' }"
      class="ds-table-con overflow-hidden tabs-custom"
    >
      <template #withdraw>
        <DashboardFinancialWithdrawal @addCard="activeTab = 'addAccount'" />
      </template>
      <template #history>
        <DashboardFinancialTransactions />
      </template>
      <template #addAccount>
        <DashboardFinancialAddCard />
      </template>
    </UTabs>
  </section>
</template>

<script setup>
const authStore = useAuthStore();

const tabItems = ref([
  {
    label: "تسویه حساب",
    value: "withdraw",
    slot: "withdraw",
  },
  {
    label: "تاریخچه تراکنش ها",
    value: "history",
    slot: "history",
  },
  {
    label: "افزودن حساب",
    value: "addAccount",
    slot: "addAccount",
  },
]);

const activeTab = ref(tabItems.value[0].value);
useHead({
  title: "امور مالی | وکیل وکیل",
});
</script>
