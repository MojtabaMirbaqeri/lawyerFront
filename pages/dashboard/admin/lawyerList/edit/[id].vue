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
    icon: "i-lucide-lock",
    slot: "payReport" as const,
  },
  {
    label: "گزارش فعالیت",
    icon: "i-lucide-lock",
    slot: "actionReport" as const,
  },
] satisfies TabsItem[];
</script>

<template>
  <UTabs
    :items="items"
    variant="link"
    :ui="{ trigger: 'grow' }"
    class="gap-4 w-full"
  >
    <template #edit="{ item }">
      <DashboardAdminEditLawyerEditForm/>
    </template>

    <template #payReport="{ item }">
      asdasdad
    </template>
    <template #actionReport="{ item }">
      ششششششششششششش
    </template>
  </UTabs>
</template>

