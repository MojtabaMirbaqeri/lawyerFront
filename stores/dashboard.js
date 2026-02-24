// ~/stores/dashboard.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";

export const useDashboardStore = defineStore("dashboard", () => {
  const openSidebar = ref(false);
  const auth = useAuthStore();

  const commonRoutes = [];

  const adminRoutes = [
    { 
      title: "داشبورد", 
      url: "/dashboard/admin", 
      icon: "lucide:layout-dashboard" 
    },
    { 
      title: "مدیریت وکلا", 
      url: "/dashboard/admin/lawyerlist", 
      icon: "lucide:scale" 
    },
    {
      title: "ادغام وکلا",
      url: "/dashboard/admin/lawyerlist/merge",
      icon: "lucide:merge",
    },
    {
      title: "تایید وکلا",
      url: "/dashboard/admin/registerlawyer",
      icon: "lucide:user-check",
    },
    {
      title: "درخواست‌های تایید وکلا",
      url: "/dashboard/admin/lawyer-verification",
      icon: "lucide:badge-check",
    },
    {
      title: "کاربران",
      url: "/dashboard/admin/users",
      icon: "lucide:users",
    },
    {
      title: "تیکت‌ها",
      url: "/dashboard/admin/tickets",
      icon: "lucide:ticket",
    },
    {
      title: "دیدگاه‌ها",
      url: "/dashboard/admin/comments",
      icon: "lucide:message-circle",
    },
    {
      title: "مقالات",
      url: "/dashboard/admin/articles",
      icon: "lucide:file-text",
    },
    {
      title: "سوال و جواب حقوقی",
      url: "/dashboard/admin/legal-qa",
      icon: "lucide:help-circle",
    },
    { 
      title: "کد تخفیف", 
      url: "/dashboard/admin/coupons", 
      icon: "lucide:tag" 
    },
    {
      title: "امور مالی",
      url: "/dashboard/admin/billing",
      icon: "lucide:wallet",
    },
    {
      title: "گزارشات",
      url: "/dashboard/admin/support",
      icon: "lucide:flag",
    },
    {
      title: "آمار بازدید وکلا",
      url: "/dashboard/admin/profile-views",
      icon: "lucide:eye",
    },
    {
      title: "ارسال پیامک",
      url: "/dashboard/admin/sms",
      icon: "lucide:send",
    },
    { 
      title: "چت", 
      url: "/chat", 
      icon: "lucide:message-square" 
    },
    // {
    //   title: "تنظیمات",
    //   url: "/dashboard/admin/settings",
    //   icon: "lucide:settings",
    // },
  ];

  const lawyerRoutes = computed(() => {
    if (auth.user?.lawyer_id) {
      return [
        {
          title: "داشبورد",
          url: "/dashboard/lawyer",
          icon: "lucide:layout-dashboard",
        },
        {
          title: "پروفایل",
          url: "/dashboard/lawyer/profile",
          icon: "lucide:user",
        },
        {
          title: "نوبت‌ها",
          url: "/dashboard/appointments",
          icon: "lucide:calendar",
        },
        {
          title: "مدیریت چت",
          url: "/dashboard/lawyer/chats",
          icon: "lucide:message-square",
        },
        {
          title: "امور مالی",
          url: "/dashboard/lawyer/financial",
          icon: "lucide:wallet",
        },
        {
          title: "مقالات",
          url: "/dashboard/lawyer/articles",
          icon: "lucide:file-text",
        },
        {
          title: "پاسخ‌های حقوقی",
          url: "/dashboard/lawyer/legal-answers",
          icon: "lucide:message-circle-question",
        },
        {
          title: "تیکت‌ها",
          url: "/dashboard/ticket/tickets",
          icon: "lucide:ticket",
        },
      ];
    } else {
      return [
        {
          title: "داشبورد",
          url: "/dashboard",
          icon: "lucide:layout-dashboard",
        },
      ];
    }
  });

  const userRoutes = [
    { 
      title: "نوبت‌های من", 
      url: "/dashboard/appointments", 
      icon: "lucide:calendar" 
    },
    {
      title: "سوالات من",
      url: "/dashboard/user/legal-questions",
      icon: "lucide:help-circle",
    },
    { 
      title: "تراکنش‌ها", 
      url: "/dashboard/user/transactions", 
      icon: "lucide:credit-card" 
    },
    {
      title: "ثبت‌نام به‌عنوان وکیل",
      url: "/dashboard/user/become-lawyer",
      icon: "lucide:scale",
    },
    {
      title: "تیکت‌ها",
      url: "/dashboard/ticket/tickets",
      icon: "lucide:ticket",
    },
    {
      title: "چت",
      url: "/chat",
      icon: "lucide:message-square",
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
