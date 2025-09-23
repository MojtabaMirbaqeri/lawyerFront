export const useNavigateToDashboard = (otpRedirect = false) => {
  const auth = useAuthStore();
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
