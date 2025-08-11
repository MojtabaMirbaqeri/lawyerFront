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
</script>

<template>
  <div class="">
    <UTabs
      :items="items"
      variant="link"
      :ui="{ trigger: 'grow' }"
      class="gap-4 w-full"
    >
      <template #edit="{ item }">
        <DashboardAdminEditLawyerEditForm />
      </template>
      <template #payReport="{ item }"> asdasdad </template>

      <template #actionReport="{ item }"> ششششششششششششش </template>
    </UTabs>
  </div>
</template>

