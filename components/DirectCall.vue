<template>
  <div>
    <component
      :is="isPhoneVisible ? 'a' : 'button'"
      :href="isPhoneVisible ? `tel:${phone}` : undefined"
      @click="handleClick"
      class="btn-grad w-full text-[15px]! flex! items-center justify-center gap-2 font-medium!">
      <Transition name="phone-fade" mode="out-in">
        <span v-if="!isPhoneVisible" key="text" class="phone-text">تماس مستقیم</span>
        <span v-else key="phone" class="phone-number" dir="ltr">
          شماره تماس: {{ phone }}
        </span>
      </Transition>
    </component>
  </div>
</template>
<script setup>
const props = defineProps(["phone", "lawyerId"]);
const authStore = useAuthStore();
const route = useRoute();

const isPhoneVisible = ref(false);

const handleClick = (e) => {
  if (isPhoneVisible.value) {
    // شماره قبلاً نمایش داده شده، لینک tel: کار میکنه
    return;
  }

  e.preventDefault();

  if (authStore.isAuthenticated) {
    isPhoneVisible.value = true;
    // ثبت لاگ «مشاهده شماره تلفن» برای ادمین
    if (props.lawyerId && import.meta.client) {
      usePost(
        {
          url: `lawyers/${props.lawyerId}/log-phone-reveal`,
          includeAuthHeader: true,
          body: {},
        },
        false,
      ).catch(() => {});
    }
  } else {
    // ذخیره URL فعلی برای برگشت بعد از لاگین
    if (import.meta.client) {
      localStorage.setItem("redirectAfterLogin", route.fullPath);
    }
    useToast().add({
      title: "برای مشاهده شماره تلفن وکیل ابتدا وارد حساب کاربری خود شوید",
      icon: "hugeicons:alert-02",
      color: "warning",
      duration: 7000,
    });
    navigateTo("/register");
  }
};
</script>
<style scoped>
.btn-grad {
  background-image: linear-gradient(to right, #00d2ff 0%, #3a7bd5 51%, #00d2ff 100%);
}
.btn-grad {
  padding: 15px 45px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  display: block;
}

.btn-grad:hover {
  background-position: right center;
  color: #fff;
  text-decoration: none;
}

/* انیمیشن Transition */
.phone-fade-enter-active,
.phone-fade-leave-active {
  transition: all 0.3s ease;
}

.phone-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.phone-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.phone-text,
.phone-number {
  display: inline-block;
}
</style>
