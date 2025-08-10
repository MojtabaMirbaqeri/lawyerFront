import { defineStore } from "pinia";
export const useDashboardStore = defineStore("dashboard", () => {
  const openSidebar = false;
  const adminRoute = [
    { title: "داشبورد", url: "/dashboard", icon: "lucide:home" },
    { title: "لیست وکلا", url: "/dashboard/admin/lawyerlist", icon: "lucide:inbox" },
    {
      title: "انتظار تایید",
      url: "/dashboard/admin/registerlawyer",
      icon: "material-symbols:fingerprint",
    },
    { title: "لیست کاربران", url: "/dashboard/admin/users", icon: "solar:users-group-two-rounded-linear" },
    {
      title: "کد تخفیف",
      url: "/dashboard/admin/coupons",
      icon: "hugeicons:coupon-01",
    },
    { title: "صورت حساب", url: "#", icon: "lucide:search" },
    { title: "تنظیمات", url: "#", icon: "lucide:settings" },
  ];
  return { openSidebar, adminRoute };
});
