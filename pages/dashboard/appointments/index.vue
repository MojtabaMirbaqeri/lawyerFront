<!-- eslint-disable vue/no-ref-as-operand -->
<template>
  <section>
    <div class="ds-table-con">
      <!-- جدول داده‌ها -->
      <UICDataTable :data="data" :columns="columns" :total="total" v-model="page" />
    </div>

    <!-- مودال تایید لغو نوبت -->
    <UModal v-model:open="isCancelModalOpen">
      <template #body>
        <div class="">
          <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            لغو نوبت
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              آیا از لغو نوبت خود مطمئن هستید؟ این عمل قابل بازگشت نیست.
            </p>
          </div>
          <div class="mt-4 flex justify-start gap-3">
            <UICSecondaryBtn
              @click="handleConfirmCancel"
              class="rounded-[8px]! py-[10px]!">
              <span>تایید و لغو</span>
            </UICSecondaryBtn>
          </div>
        </div>
      </template>
    </UModal>
  </section>
</template>

<script setup>
import { h, resolveComponent } from "vue";

const authStore = useAuthStore();

// کامپوننت‌های مورد نیاز برای رندر داینامیک در جدول
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UBadge = resolveComponent("UBadge");
const UICTruncatePopover = resolveComponent("UICTruncatePopover");

// وضعیت مودال
const isCancelModalOpen = ref(false);
const appointmentToCancelId = ref(null);

// متغیر برای مدیریت صفحه فعلی
const page = ref(1);

// تابع اصلی برای دریافت داده‌ها از سرور
const refetch = async (page = null, setTotal = false) => {
  try {
    const res = await useGet({
      url: "appointments",
      includeAuthHeader: true,
      query: {
        page: page ? page : undefined,
      },
    });

    // مپ کردن داده‌های دریافت شده برای نمایش در جدول
    data.value = res.data.data.map((appointment) => {
      return {
        id: appointment?.id,
        user: `${appointment?.user?.name} ${appointment?.user?.family}`,
        lawyer: `${appointment?.lawyer?.name} ${appointment?.lawyer?.family}`,
        lawyerId: appointment?.lawyer?.id,
        type: appointment?.type === "inperson" ? "حضوری" : "آنلاین", // ترجمه نوع
        date: new Date(appointment?.date).toLocaleDateString("fa"),
        time: appointment?.time.slice(0, 5), // نمایش ساعت و دقیقه
        status: appointment?.status,
        paymentStatus: appointment?.payment?.status,
      };
    });

    // تنظیم تعداد کل آیتم‌ها برای صفحه‌بندی
    if (setTotal) {
      total.value = res.data.meta.total;
    }
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
  }
};

// واچر برای تغییر صفحه
watch(
  () => page.value,
  async (newPage) => {
    refetch(newPage);
  }
);

const total = ref(0);

// دریافت داده‌های اولیه هنگام بارگذاری کامپوننت
const res = await useGet({
  url: "appointments",
  includeAuthHeader: true,
  query: { page: 1 },
});
total.value = res.data.meta.total;
const appointmentData = ref(res.data.data);

// مپ کردن داده‌های اولیه برای نمایش
const data = ref(
  appointmentData.value.map((appointment) => {
    return {
      id: appointment?.id,
      user: `${appointment?.user?.name} ${appointment?.user?.family}`,
      lawyer: `${appointment?.lawyer?.name} ${appointment?.lawyer?.family}`,
      lawyerId: appointment?.lawyer?.id,
      type: appointment?.type === "inperson" ? "حضوری" : "آنلاین",
      date: new Date(appointment?.date).toLocaleDateString("fa"),
      time: appointment?.time.slice(0, 5),
      status: appointment?.status,
      paymentStatus: appointment?.payment?.status,
      roomId:appointment?.chat_room,
    };
  })
);

// تعریف ستون‌های جدول
const columns = ref([
  {
    accessorKey: "id",
    header: "شناسه",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "user",
    header: "کاربر",
  },
  {
    accessorKey: "lawyer",
    header: "وکیل",
  },
  {
    accessorKey: "type",
    header: "نوع",
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
    accessorKey: "description",
    header: "توضیحات",
    cell: ({ row }) => {
      return h(UICTruncatePopover, {
        text: row.getValue("description") || "----",
      });
    },
  },
  {
    accessorKey: "status",
    header: "وضعیت",
    cell: ({ row }) => {
      const statusValue = row.getValue("status");
      const colorMap = {
        cancelled: "error",
        pending_payment: "warning",
        reserved: "success",
        done: "primary",
      };
      const labelMap = {
        cancelled: "لغو شده",
        pending_payment: "در انتظار پرداخت",
        reserved: "رزرو شده",
        done: "تکمیل شده",
      };

      return h(
        UBadge,
        {
          class: "capitalize",
          variant: "soft",
          color: colorMap[statusValue] || "gray",
        },
        () => labelMap[statusValue] || statusValue
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-right" },
        h(
          UDropdownMenu,
          {
            content: { align: "end" },
            items: getRowItems(row),
            "aria-label": "Actions dropdown",
          },
          () =>
            h(UButton, {
              icon: "i-lucide-ellipsis-vertical",
              color: "neutral",
              variant: "ghost",
              class: "ml-auto",
              "aria-label": "Actions dropdown",
            })
        )
      );
    },
  },
]);
if (authStore.user.user_type != "user") {
  columns.value = columns.value.filter((col) => col?.id !== "actions");
  columns.value = columns.value.filter((col) => col?.accessorKey !== "lawyer");
}
// تابع برای لغو کردن نوبت
const cancelAppointment = async (appointmentId) => {
  try {
    await useDelete({
      url: `appointments/${appointmentId}`,
      includeAuthHeader: true,
    });
    useToast().add({ title: "نوبت شما با موفقیت لغو شد", color: "success" });

    refetch(page.value);
  } catch (error) {
    console.error(`Failed to cancel appointment ${appointmentId}:`, error);
    useToast().add({
      title: "مشکلی رخ داده است لطفا مجددا تلاش کنید.",
      icon: "solar:phone-linear",
      color: "error",
    });
  }
};

// تابع برای اجرای عملیات پس از تایید در مودال
const handleConfirmCancel = async () => {
  if (appointmentToCancelId.value) {
    await cancelAppointment(appointmentToCancelId.value);
  }
  isCancelModalOpen.value = false;
  appointmentToCancelId.value = null;
};

// تعریف آیتم‌های منوی عملیات برای هر ردیف
function getRowItems(row) {
  const items = [];
  if (row.original.status !== "cancelled") {
    items.push({
      label: "لغو نوبت",
      icon: "solar:close-circle-outline",
      onSelect() {
        appointmentToCancelId.value = row.original.id;
        isCancelModalOpen.value = true;
      },
    });
    // if(row.original.roomId){
    //   items.push({
    //   label: "شروع چت",
    //   icon: "solar:chat-round-line-outline",
    //   onSelect() {
    //     appointmentToCancelId.value = row.original.id;
    //     isCancelModalOpen.value = true;
    //   },
    // });
    // }
  } else {
    items.push({
      label: "نوبت مجدد",
      icon: "solar:clock-circle-linear",
      onSelect() {
        navigateTo(`/lawyer/${row.original.lawyerId}`);
      },
    });
  }
  return items;
}
</script>
