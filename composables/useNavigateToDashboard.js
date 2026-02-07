export const useNavigateToDashboard = (otpRedirect = false) => {
  const auth = useAuthStore();

  // بررسی آیا redirect سفارشی از صفحه وکیل ذخیره شده
  if (import.meta.client) {
    const redirectUrl = localStorage.getItem("redirectAfterLogin");
    if (redirectUrl) {
      localStorage.removeItem("redirectAfterLogin");
      return navigateTo(redirectUrl);
    }
  }

  if (auth?.user?.user_type == "lawyer") {
    return navigateTo("/dashboard/lawyer");
  } else if (auth?.user?.user_type == "admin") {
    return navigateTo("/dashboard/admin/lawyerlist");
  } else if (otpRedirect) {
    return navigateTo("/");
  } else {
    return navigateTo("/dashboard/appointments");
  }
};
