<template>
  <div class="ds-container">
    <UICDataTable :data="data" :columns="columns"/>
  </div>
</template>

<script setup>
const res = await useGet({url:'users',includeAuthHeader:true,})
const refData = res.data.data.data
console.log(res.data.data.data);

const data = ref(refData.map((ref) => {
  return {
    fullName : `${ref?.name} ${ref?.family}`,
    phone:ref?.phone,
    amount:ref.wallet_balance || 0,
    activeTicket : ref?.ticket_count,
    orders:ref?.appointment_count,
    comments : ref?.review_count
  }
}));

const columns = [
  {
    accessorKey: "fullName",
    header: "نام نام خانوادگی",
  },
  {
    accessorKey: "phone",
    header: "تلفن",
  },
  {
    accessorKey: "activeTicket",
    header: "تیکت فعال",
  },
  {
    accessorKey: "orders",
    header: "سفارشات",
  },
  {
    accessorKey: "comments",
    header: "دیدگاه",
  },
  {
    accessorKey: "amount",
    header: () => h("div", { class: "text-center" }, "موجودی کیف پول"),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"));

      const formatted = new Intl.NumberFormat("fa-IR").format(amount) + " تومان";

      return h("div", { class: "text-center font-medium" }, formatted);
    },
  },
];
</script>

<style>
</style>