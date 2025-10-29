<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

const items = [
  {
    label: "ویرایش وکیل",
    icon: "i-lucide-user",
    slot: "edit" as const,
  },
  {
    label: "گزارش مالی",
    icon: "carbon:report",
    slot: "payReport" as const,
  },
  {
    label: "گزارش فعالیت",
    icon: "ic:outline-pending-actions",
    slot: "actionReport" as const,
  },
] satisfies TabsItem[];

const res = await useGet({
  url: `admin/lawyers/${useRoute().params.id}/metrics`,
  includeAuthHeader: true,
  query: undefined,
});

const data = ref(res.data.data);
const appointments = ref(res.data.data.appointments_list);
const withdrawals = ref(res.data.data.withdrawals_list);
const wallet = ref(res.data.data.wallet);
console.log(appointments.value);
</script>

<template>
  <div class="">
    <UTabs
      :items="items"
      variant="link"
      :ui="{ trigger: 'grow shrink-0' }"
      class="gap-4 w-full"
    >
      <template #edit="{ item }">
        <DashboardAdminEditLawyerEditForm :lawyer="data" />
      </template>
      <template #payReport="{ item }">
        <DashboardAdminEditLawyerReportWithdrawals
          :walletDetail="wallet"
          :withdrawals="withdrawals"
          :total="res.data.data.withdrawals_meta.total"
        />
      </template>

      <template #actionReport="{ item }">
        <DashboardAdminEditLawyerReportAppointment
          :appointments="appointments"
          :total="res.data.data.appointments_meta.total"
        />
      </template>
    </UTabs>
  </div>
</template>

