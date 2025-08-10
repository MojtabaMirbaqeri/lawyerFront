<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";

const UBadge = resolveComponent("UBadge");
const props = defineProps(["data", "columns"]);

type Payment = {
  id: string;
  date: string;
  status: "paid" | "failed" | "refunded";
  email: string;
  amount: number;
};
</script>

<template> 
  <UTable
    :data="data"
    :ui="{
      root: 'rounded-[7px]',
      thead: 'bg-primary',
      th: 'text-white text-center!',
      td: 'text-center',
    }"
    :columns="columns"
    class="flex-1"
  />
</template>