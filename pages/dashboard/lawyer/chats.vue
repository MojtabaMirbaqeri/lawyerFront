<template>
  <div class="ds-table-con">
    <div class="flex justify-end mb-4">
      <!-- اگر دکمه ایجاد جدید لازم شد اینجا قرار می‌گیره -->
    </div>

    <UICDataTable :columns="columns" :data="appointmentsRes?.data?.data" />
  </div>
</template>

<script setup>
import { h, resolveComponent, ref, onMounted, onBeforeUnmount } from "vue";

const UButton = resolveComponent("UButton");

// helpers (فرض بر این است که useGet، usePost، useToast، navigateTo در پروژه‌ات موجودند)
const pad = (n) => String(n).padStart(2, "0");
function getTodayLocalDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  return `${y}-${m}-${day}`;
}

// reactive "now" تا وضعیت دکمه‌ها آپدیت بشه (هر 30 ثانیه آپدیت می‌کنیم)
const now = ref(Date.now());
let ticker = null;
onMounted(() => {
  ticker = setInterval(() => (now.value = Date.now()), 30_000);
});
onBeforeUnmount(() => {
  if (ticker) clearInterval(ticker);
});

// fetch appointments برای تاریخ امروز
const todayStr = getTodayLocalDate();
const appointmentsRes = ref(
  await useGet({
    url: `appointments?status=reserved&type=chat&date_from=${todayStr}&date_to=${todayStr}`,
    includeAuthHeader: true,
  })
);

// بررسی اینکه آیا دکمه آغاز چت برای یک نوبت فعال باشد
function canStartChat(appointment) {
  try {
    // appointment.date (YYYY-MM-DD) و appointment.time (HH:MM:SS)
    const dtStr = `${appointment.date}T${appointment.time}`; // محلی
    const startMs = new Date(dtStr).getTime();
    const allowedMs = startMs - 1000 * 60 * 1000; // نیم ساعت قبل
    return now.value >= allowedMs;
  } catch (e) {
    return false;
  }
}

// تابع ایجاد روم (call API)
async function startChatRoom(appointment) {
  const toast = useToast();
  try {
    const body = {
      user_id: appointment.user.id,
      name: "", // فعلاً خالی (طبق خواسته شما)
    };
    const res = await usePost({
      url: "chat/rooms/lawyer-user",
      body,
      includeAuthHeader: true,
    });

    // موفقیت: فرض می‌کنیم کد 200/201 یا ساختار مشابه داریم
    if (
      res &&
      (res.statusCode === 200 ||
        res.statusCode === 201 ||
        res.status === 200 ||
        res.status === 201)
    ) {
      toast.add({ title: "اتاق گفتگو با موفقیت ایجاد شد.", color: "success" });

      // اگر پاسخ شامل id روم هست، هدایت کن (اختیاری)
      const roomId = res.data?.room?.id ?? res.data?.data?.data?.room?.id ?? 1;
      if (roomId) {
        useChatStore().selectedRoom = roomId;
        useChatStore().roomInfo = res.data?.room ?? res?.data?.data?.data?.room ?? {};
        console.log(useChatStore().selectedRoom);

        navigateTo(`/chat`);
      } else {
        // ریفرش لیست نوبت‌ها (مثل الگوی قبلی)
        appointmentsRes.value.data = await appointmentsRes.value.refresh();
      }
    } else {
      // خطای غیرمنتظره
      toast.add({
        title: "ایجاد اتاق گفتگو با خطا مواجه شد.",
        color: "danger",
      });
      console.error("startChatRoom response:", res);
    }
  } catch (err) {
    console.error(err);
    useToast().add({
      title: "خطا در برقراری ارتباط با سرور.",
      color: "danger",
    });
  }
}

// ستون‌ها برای UICDataTable
const columns = [
  {
    accessorKey: "id",
    header: "شناسه",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "user",
    header: "کاربر",
    cell: ({ row }) => {
      const user = row.original.user;
      const fullName = [user?.name, user?.family].filter(Boolean).join(" ");
      const phone = user?.phone ? ` — ${user.phone}` : "";
      return fullName || `#${user?.id || ""}${phone}`;
    },
  },
  {
    accessorKey: "date",
    header: "تاریخ",
    cell: ({ row }) =>
      new Date(row.getValue("date")).toLocaleDateString("fa-IR", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
  },
  {
    accessorKey: "time",
    header: "ساعت",
    cell: ({ row }) => {
      // اگر نیاز به فرمت دلخواه باشه اینجا تغییر بدید
      const t = row.getValue("time");
      return t ? t.slice(0, 5) : t; // نمایش HH:MM
    },
  },
  {
    accessorKey: "duration",
    header: "مدت (دقیقه)",
    cell: ({ row }) => row.getValue("duration"),
  },
  {
    id: "actions",
    header: "عملیات",
    cell: ({ row }) => {
      const appointment = row.original;
      const disabled = !canStartChat(appointment);
      return h(
        "div",
        { class: "text-center" },
        h(
          UButton,
          {
            onClick: async () => {
              if (disabled) {
                useToast().add({
                  color: "warning",
                  description:
                    "فعالسازی چت تنها ۱۵ دقیقه قبل از زمان رزور شده امکان‌پذیر است",
                });
              } else {
                await startChatRoom(appointment);
              }
            },
            variant: "primary",
            class: [
              "px-4  border! border-primary text-primary",
              disabled ? "opacity-50 border-gray-300 cursor-not-allowed!" : "",
            ],
          },
          () => (disabled ? "آغاز چت (غیرفعال)" : "آغاز چت")
        )
      );
    },
  },
];
useHead({
  title: "چت‌های امروز | وکیل وکیل",
});
</script>

<style scoped>
/* در صورت نیاز استایل‌های جزئی اینجا اضافه کن */
</style>
