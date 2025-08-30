// ~/stores/dashboard.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";

export const useDashboardStore = defineStore("dashboard", () => {
  const openSidebar = ref(false);
  const auth = useAuthStore();

  const commonRoutes = [];

  const adminRoutes = [
    { title: "داشبورد", url: "/dashboard/admin", icon: "hugeicons:dashboard-square-01" },
    { title: "لیست وکلا", url: "/dashboard/admin/lawyerlist", icon: "lucide:inbox" },
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
      title: "تیکت ها",
      url: "/dashboard/admin/tickets",
      icon: "hugeicons:message-multiple-02",
    },
    { title: "کد تخفیف", url: "/dashboard/admin/coupons", icon: "hugeicons:coupon-01" },
    {
      title: "صورت حساب",
      url: "/dashboard/admin/billing",
      icon: "solar:bill-list-linear",
    },
    { title: "تنظیمات", url: "/dashboard/admin/settings", icon: "lucide:settings" },
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
    { title: "داشبورد", url: "/dashboard", icon: "hugeicons:dashboard-square-01" },
    { title: "رزرو جلسه", url: "/dashboard/reserve", icon: "lucide:clock" },
    // { title: "پرونده‌های من", url: "/dashboard/cases", icon: "lucide:folder" },
    // { title: "پروفایل", url: "/dashboard/profile", icon: "lucide:user" },
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
