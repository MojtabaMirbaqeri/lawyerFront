import { defineStore } from "pinia";
import { useCookie } from "#app";
export const useUserAuthStore = defineStore("auth", () => {
    const userToken = useCookie('jwtToken');
    const userDetail = null
  return { userToken , userDetail};
});
