import { defineStore } from "pinia";
import { useCookie } from "#app";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: null,
    initialized: false,
    loading: false,
    height: null,
    csrfToken: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isInitialized: (state) => state.initialized,
  },

  actions: {
    async initialize() {
      // جلوگیری از initialize مجدد
      if (this.initialized) return;

      const jwtToken = useCookie("jwtToken", {
        default: () => null,
        serialize: String,
        deserialize: (value) => (value === "null" ? null : value),
      });

      if (jwtToken.value) {
        this.token = jwtToken.value;

        // در SSR فقط token را تنظیم کن، user را بعداً fetch کن
        // fetchUser را در هر صورت انجام نده چون ممکن است API در SSR دسترس نباشد
      }

      this.initialized = true;
    },

    // متد جداگانه برای fetch کردن user که فقط در client اجرا شود
    async ensureUser() {
      // اگر token داریم اما user نداریم و در client هستیم
      if (this.token && !this.user && import.meta.client) {
        try {
          await this.fetchUser();
        } catch (error) {
          console.error("Failed to fetch user:", error);
          this.logout(false);
        }
      }
    },

    async fetchUser() {
      if (!this.token) {
        return null;
      }
      this.loading = true;
      try {
        const res = await useGet({
          url: "auth/check-status",
          includeAuthHeader: true,
        });
        if (res.statusCode === 200 && res.data?.data?.authenticated) {
          this.user = res.data.data.user;
          return this.user;
        }

        this.logout(false);
        return null;
      } catch (error) {
        console.error("Fetch user error:", error);
        this.logout(false);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // باقی متدها...
    async verifyCodeAndLogin(phone, code) {
      this.loading = true;

      try {
        const res = await usePost({
          url: "auth/verify-code",
          body: { phone, code },
          includeAuthHeader: false,
        });

        if (res.statusCode === 200 && res.data.data) {
          const data = res.data.data;

          if (data.needs_registration) {
            return { needsRegistration: true };
          }

          // در غیر اینصورت، توکن رو ست کن و کاربر لاگین شده
          this.setAuth(data.token, data.user);
          useToast().add({
            title: "شما با موفقیت وارد شدید.",
            icon: "mage:security-shield",
            color: "success",
          });
          return { needsRegistration: false };
        }

        throw new Error(res.error || "کد نامعتبر است");
      } catch (error) {
        console.error("Verify code error:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async registerUser({ name, family, phone }) {
      this.loading = true;

      try {
        const res = await usePost({
          url: "register-lawyer",
          body: { is_lawyer: false, name, family, phone },
        });

        if (res.statusCode === 201 || res.statusCode === 200) {
          const token = res.data.data.user.token;
          this.setAuth(token, res.data.data.user);
          useToast().add({
            title: "حساب شما با موفقیت ایجاد شد.",
            icon: "mage:security-shield",
            color: "success",
          });
          return true;
        }

        throw new Error(res.error || "Registration failed");
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async registerLawyer(formData) {
      this.loading = true;

      try {
        const res = await usePost({
          url: "register-lawyer",
          body: formData,
          includeAuthHeader: false,
        });

        if (res.statusCode === 200 || res.statusCode === 201) {
          const token = res.data.data.user.token;
          this.setAuth(token, res.data.data.user);
          useToast().add({
            title: "حساب شما در انتظار تایید است.",
            icon: "mage:security-shield",
          });
          return true;
        }

        throw new Error(res.error || "Lawyer registration failed");
      } catch (error) {
        console.error("Lawyer registration error:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // متد کمکی برای تنظیم authentication
    async setAuth(token, user) {
      this.token = token;
      this.user = user;

      const { data } = await useGet({ url: 'sanctum/csrf-cookie' })

      // ست کردن کوکی با اعتبار 7 روز (بر حسب ثانیه: 7 * 24 * 60 * 60)
      const csrfToken = useCookie('csrf_token', {
        maxAge: 60 * 60 * 24 * 7, // 7 روز
        sameSite: 'lax',          // پیش‌فرض خوبه
        secure: true              // اگه HTTPS داری
      })

      // مقداردهی
      csrfToken.value = data.csrf_token

      // اگر داخل component هستی و data لازم داری:
      this.csrfToken = csrfToken.value

      const jwtToken = useCookie("jwtToken", {
        default: () => null,
        serialize: String,
        deserialize: (value) => (value === "null" ? null : value),

        maxAge: 60 * 60 * 24 * 7,

        path: "/",
        sameSite: "lax",
        secure: true,
      });

      jwtToken.value = token;
    },

    async logout(redirect = true) {
      if (redirect && import.meta.client) {
        await navigateTo("/");
      }

      setTimeout(() => {
        const jwtToken = useCookie("jwtToken");
        jwtToken.value = null;
        this.$reset();
      } , 500)
      
    },
  },
});
