<template>
  <section>
    <div class="ds-table-con">
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
const props = defineProps(["appointments", "total"]);
const page = ref(1);
const total = ref(props.total);
const UBadge = resolveComponent("UBadge");

watch(
  () => page.value,
  async (page) => {
    const res = await useGet({
      url: `admin/lawyers/${useRoute().params.id}/metrics`,
      includeAuthHeader: true,
      query: { appointments_page: page },
    });

    tableData.value = res.data.data.appointments_list.map((a) => ({
      id: a.id,
      user: `${a.user?.name} ${a.user?.family}`,
      userPhone: a.user?.phone,
      lawyer: `${a.lawyer?.name} ${a.lawyer?.family}`,
      type: a.type === "inperson" ? "حضوری" : "تلفنی",
      date: a.date,
      time: a.time,
      status: a.status,
      price: `${a.price} تومان`,
      duration: `${a.duration} دقیقه`,
      paymentStatus: a.payment?.status,
    }));
  }
);

// نگاشت دیتا به فرمت جدول
const tableData = ref(
  props.appointments.map((a) => ({
    id: a.id,
    user: `${a.user?.name} ${a.user?.family}`,
    userPhone: a.user?.phone,
    lawyer: `${a.lawyer?.name} ${a.lawyer?.family}`,
    type: a.type === "inperson" ? "حضوری" : "تلفنی",
    date: a.date,
    time: a.time,
    status: a.status,
    price: `${a.price} تومان`,
    duration: `${a.duration} دقیقه`,
    paymentStatus: a.payment?.status,
  }))
);

// ستون‌های جدول
const columns = ref([
  {
    accessorKey: "id",
    header: "کد نوبت",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "user",
    header: "موکل",
    cell: ({ row }) =>
      h("div", {}, [
        h("div", {}, row.getValue("user")),
        h("small", { class: "text-gray-500" }, row.original.userPhone),
      ]),
  },
  {
    accessorKey: "lawyer",
    header: "وکیل",
  },
  {
    accessorKey: "type",
    header: "نوع جلسه",
  },
  {
    accessorKey: "date",
    header: "تاریخ",
  },
  {
    accessorKey: "time",
    header: "ساعت",
  },
  {
    accessorKey: "price",
    header: "هزینه",
  },
  {
    accessorKey: "duration",
    header: "مدت",
  },
  {
    accessorKey: "status",
    header: "وضعیت",
    cell: ({ row }) => {
      const statusMap = {
        pending_payment: { label: "در انتظار پرداخت", color: "warning" },
        confirmed: { label: "تایید شده", color: "success" },
        cancelled: { label: "لغو شده", color: "error" },
      };

      const st = statusMap[row.getValue("status")] || {
        label: row.getValue("status"),
        color: "gray",
      };

      return h(
        UBadge,
        { class: "capitalize", variant: "soft", color: st.color },
        () => st.label
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "پرداخت",
    cell: ({ row }) => {
      const statusMap = {
        pending: { label: "در انتظار", color: "warning" },
        paid: { label: "پرداخت‌شده", color: "success" },
        failed: { label: "ناموفق", color: "error" },
      };

      const st = statusMap[row.getValue("paymentStatus")] || {
        label: row.getValue("paymentStatus"),
        color: "gray",
      };

      return h(
        UBadge,
        { class: "capitalize", variant: "soft", color: st.color },
        () => st.label
      );
    },
  },
]);
</script>
