<template>
  <section class="flex space-y-3 flex-col">
    <a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=663517&Code=PunuMAwnJLT4YZ3JSZhy8HqzdPM1EGqR'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=663517&Code=PunuMAwnJLT4YZ3JSZhy8HqzdPM1EGqR' alt='' style='cursor:pointer' code='PunuMAwnJLT4YZ3JSZhy8HqzdPM1EGqR'></a>
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
