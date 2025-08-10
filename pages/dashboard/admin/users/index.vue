<template>
  <div class="ds-container">
    <UICDataTable :data="data" :columns="columns"/>
  </div>
</template>

<script setup>
const data = ref([
  {
    id: "4600",
    date: "2024-03-11T15:30:00",
    status: "paid",
    email: "james.anderson@example.com",
    amount: 100000000,
  },
  {
    id: "4599",
    date: "2024-03-11T10:10:00",
    status: "failed",
    email: "mia.white@example.com",
    amount: 276,
  },
  {
    id: "4598",
    date: "2024-03-11T08:50:00",
    status: "refunded",
    email: "william.brown@example.com",
    amount: 315,
  },
  {
    id: "4597",
    date: "2024-03-10T19:45:00",
    status: "paid",
    email: "emma.davis@example.com",
    amount: 529,
  },
  {
    id: "4596",
    date: "2024-03-10T15:55:00",
    status: "paid",
    email: "ethan.harris@example.com",
    amount: 639,
  },
]);

const columns = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.getValue("date")).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: () => h("div", { class: "text-right" }, "موجودی کیف پول"),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"));

      const formatted = new Intl.NumberFormat("fa-IR").format(amount) + " تومان";

      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },
];
</script>

<style>
</style>