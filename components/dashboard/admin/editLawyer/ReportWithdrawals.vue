<template>
  <section>
    <div class="ds-table-con">
      <div class="flex gap-2 flex-col md:flex-row">
        <UICInput v-model="earned" label="کل درآمد " :readonly="true" />
        <UICInput v-model="balance" label="موجودی کیف پول" :readonly="true" />
        <UICInput
          v-model="withdrawableBalance"
          label="موجودی قابل برداشت"
          :readonly="true"
        />
      </div>
      <UICDataTable
        :data="tableData"
        :total="total"
        :columns="columns"
        v-model="page"
      />
    </div>
  </section>
</template>

<script setup>
import { h, resolveComponent } from "vue";
const props = defineProps(["withdrawals", "total", "walletDetail"]);
console.log(props.walletDetail);
const earned = ref(
  `${Number(props.walletDetail.total_earned).toLocaleString("fa-IR")} تومان`
);
const balance = ref(
  `${Number(props.walletDetail.balance).toLocaleString("fa-IR")} تومان`
);
const withdrawableBalance = ref(
  `${Number(props.walletDetail.withdrawable_balance).toLocaleString(
    "fa-IR"
  )} تومان`
);

const page = ref(1);
const total = ref(props.total);
const UBadge = resolveComponent("UBadge");

// واکنش به تغییر پیج
watch(
  () => page.value,
  async (page) => {
    const res = await useGet({
      url: `admin/lawyers/${useRoute().params.id}/metrics`,
      includeAuthHeader: true,
      query: { withdrawals_page: page },
    });

    tableData.value = res.data.data.withdrawals_list.map((w) => ({
      id: w.id,
      lawyer: `${w.lawyer?.user?.name} ${w.lawyer?.user?.family}`,
      lawyerPhone: w.lawyer?.user?.phone,
      amount: w.formatted_amount,
      status: w.status,
      statusText: w.status_text,
      createdAt: w.created_at,
    }));
  }
);

// نگاشت اولیه دیتا
const tableData = ref(
  props.withdrawals.map((w) => ({
    id: w.id,
    lawyer: `${w.lawyer?.user?.name} ${w.lawyer?.user?.family}`,
    actionType: "برداشت",
    lawyerPhone: w.lawyer?.user?.phone,
    amount: w.formatted_amount,
    status: w.status,
    statusText: w.status_text,
    createdAt: w.created_at || "─────",
  }))
);

// ستون‌ها
const columns = ref([
  {
    accessorKey: "id",
    header: "کد درخواست",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "lawyer",
    header: "وکیل",
    cell: ({ row }) =>
      h("div", {}, [
        h("div", {}, row.getValue("lawyer")),
        h("small", { class: "text-gray-500" }, row.original.lawyerPhone),
      ]),
  },
  {
    accessorKey: "amount",
    header: "مبلغ",
  },
  {
    accessorKey: "actionType",
    header: "نوع",
  },
  {
    accessorKey: "statusText",
    header: "وضعیت",
    cell: ({ row }) => {
      const statusMap = {
        pending: { color: "warning" },
        approved: { color: "success" },
        rejected: { color: "error" },
      };

      const st = statusMap[row.original.status] || { color: "gray" };

      return h(
        UBadge,
        { class: "capitalize", variant: "soft", color: st.color },
        () => row.getValue("statusText")
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "تاریخ درخواست",
  },
]);
</script>
