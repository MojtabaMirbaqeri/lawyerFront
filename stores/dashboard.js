// ~/stores/dashboard.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";

export const useDashboardStore = defineStore("dashboard", () => {
  const openSidebar = ref(false);
  const auth = useAuthStore();

  const commonRoutes = [];

  const adminRoutes = [
    // { title: "داشبورد", url: "/dashboard/admin", icon: "hugeicons:dashboard-square-01" },
    { title: "لیست وکلا", url: "/dashboard/admin/lawyerlist", icon: "lucide:inbox" },
    {
      title: "ورود به پنل وکیل",
      url: "/dashboard/admin/impersonate-lawyer",
      icon: "solar:login-2-outline",
    },
    { title: "چت", url: "/chat", icon: "lucide:inbox" },
    {
      title: "انتظار تایید",
      url: "/dashboard/admin/registerlawyer",
      icon: "material-symbols:fingerprint",
    },
    {
      title: "لیست کاربران",
      url: "/dashboard/admin/users",
      icon: "solar:users-group-two-rounded-linear",
    },
    {
      title: "تیکت‌ها",
      url: "/dashboard/admin/tickets",
      icon: "hugeicons:message-multiple-02",
    },
    {
      title: "دیدگاه‌ها",
      url: "/dashboard/admin/comments",
      icon: "hugeicons:comment-01",
    },
    { title: "کد تخفیف", url: "/dashboard/admin/coupons", icon: "hugeicons:coupon-01" },
    {
      title: "صورت حساب",
      url: "/dashboard/admin/billing",
      icon: "solar:bill-list-linear",
    },
    {
      title: "پشتیبانی",
      url: "/dashboard/admin/support",
      icon: "solar:headphones-round-outline",
    },
  ];

  const lawyerRoutes = computed(() => {
    if (auth.user?.lawyer_id) {
      return [
        {
          title: "داشبورد",
          url: "/dashboard/lawyer",
          icon: "hugeicons:dashboard-square-01",
        },
        {
          title: "پروفایل",
          url: "/dashboard/lawyer/profile",
          icon: "solar:user-circle-linear",
        },
        {
          title: "امور مالی",
          url: "/dashboard/lawyer/financial",
          icon: "solar:wallet-money-linear",
        },
        {
          title: "فعالیت ها",
          url: "/dashboard/appointments",
          icon: "solar:history-linear",
        },
        {
          title: "تیکت‌ها",
          url: "/dashboard/ticket/tickets",
          icon: "hugeicons:message-multiple-02",
        },
        {
          title: "مدیریت چت",
          url: "/dashboard/lawyer/chats",
          icon: "hugeicons:message-multiple-02",
        },
      ];
    } else {
      return [
        {
          title: "داشبورد",
          url: "/dashboard",
          icon: "hugeicons:dashboard-square-01",
        },
      ];
    }
  });

  const userRoutes = [
    // { title: "داشبورد", url: "/dashboard", icon: "hugeicons:dashboard-square-01" },
    { title: "تراکنش ها", url: "/dashboard/user/transactions", icon: "lucide:clock" },
    {
      title: "تیکت‌ها",
      url: "/dashboard/ticket/tickets",
      icon: "hugeicons:message-multiple-02",
    },
    {
      title: "نوبت‌های من",
      url: "/dashboard/appointments",
      icon: "lucide:calendar-clock",
    },
    {
      title: "لیست چت ها",
      url: "/chat",
      icon: "solar:chat-round-line-outline",
    },
  ];

  const sidebarRoutes = computed(() => {
    const t = auth.user?.user_type;
    if (t === "admin") return [...commonRoutes, ...adminRoutes];
    if (t === "lawyer") return [...commonRoutes, ...lawyerRoutes.value];
    return [...commonRoutes, ...userRoutes]; // default -> user
  });

  return {
    openSidebar,
    sidebarRoutes,
    adminRoutes,
    lawyerRoutes,
    userRoutes,
  };
});
