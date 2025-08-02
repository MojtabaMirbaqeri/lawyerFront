import { useRegisterStore } from "#imports";
export default defineNuxtRouteMiddleware((to) => {
  const store = useRegisterStore();
  if (to.path == "/register") {
    store.$reset();
  }
});
