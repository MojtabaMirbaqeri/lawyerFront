import { defineStore } from "pinia";
import { useCookie } from "#app";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: null,
    initialized: false,
    loading: false,
    height: null,
    csrfToken: null,
    /** وقتی ادمین به پنل وکیل وارد شده، توکن ادمین اینجا ذخیره می‌شود تا با «خروج از پنل وکیل» برگردد */
    adminToken: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isInitialized: (state) => state.initialized,
    /** آیا الان ادمین به‌صورت impersonate داخل پنل وکیل است؟ */
    isImpersonatingLawyer: (state) => !!state.adminToken && state.user?.user_type === "lawyer",
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

      const adminTokenCookie = useCookie("adminToken", {
        default: () => null,
        maxAge: 60 * 60 * 2, // 2 ساعت
        serialize: String,
        deserialize: (value) => (value === "null" ? null : value),
      });

      if (jwtToken.value) {
        this.token = jwtToken.value;
      }

      if (adminTokenCookie.value) {
        this.adminToken = adminTokenCookie.value;
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
        const adminTokenCookie = useCookie("adminToken");
        adminTokenCookie.value = null;
        this.$reset();
      } , 500)
      
    },

    /**
     * ورود ادمین به پنل وکیل (impersonate).
     * توکن فعلی ادمین در کوکی ذخیره می‌شود و با توکن وکیل جایگزین می‌شود.
     */
    async impersonateLawyer(lawyerId) {
      if (!this.token || this.user?.user_type !== "admin") return { ok: false };
      this.loading = true;
      try {
        const adminTokenCookie = useCookie("adminToken", {
          maxAge: 60 * 60 * 2,
          path: "/",
          sameSite: "lax",
          secure: true,
        });
        adminTokenCookie.value = this.token;
        this.adminToken = this.token;

        const res = await usePost({
          url: `admin/impersonate-lawyer/${lawyerId}`,
          includeAuthHeader: true,
        });

        if (res.statusCode === 200 && res.data?.data) {
          const { token, user } = res.data.data;
          this.token = token;
          this.user = user;
          const jwtToken = useCookie("jwtToken", {
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
            sameSite: "lax",
            secure: true,
          });
          jwtToken.value = token;
          useToast().add({
            title: "ورود به پنل وکیل با موفقیت انجام شد.",
            icon: "mage:security-shield",
            color: "success",
          });
          return { ok: true };
        }
        return { ok: false };
      } catch (error) {
        console.error("Impersonate lawyer error:", error);
        const adminTokenCookie = useCookie("adminToken");
        adminTokenCookie.value = null;
        this.adminToken = null;
        return { ok: false };
      } finally {
        this.loading = false;
      }
    },

    /**
     * خروج از پنل وکیل و بازگشت به حساب ادمین.
     */
    async exitImpersonation() {
      const adminTokenCookie = useCookie("adminToken");
      const savedAdminToken = adminTokenCookie.value || this.adminToken;
      if (!savedAdminToken) return;
      this.loading = true;
      try {
        adminTokenCookie.value = null;
        this.adminToken = null;
        this.token = savedAdminToken;
        this.user = null;
        const jwtToken = useCookie("jwtToken", {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
          sameSite: "lax",
          secure: true,
        });
        jwtToken.value = savedAdminToken;
        await this.fetchUser();
        useToast().add({
          title: "بازگشت به پنل ادمین.",
          icon: "mage:security-shield",
          color: "success",
        });
      } catch (error) {
        console.error("Exit impersonation error:", error);
      } finally {
        this.loading = false;
        if (import.meta.client) {
          window.location.replace("/dashboard/admin/impersonate-lawyer");
        }
      }
    },
  },
});
