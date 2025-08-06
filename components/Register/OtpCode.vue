<template>
  <RegisterCardHeader title="کد تایید را وارد کنید" />
  <span
    >کد تایید برای شماره
    <span class="text-primary">{{ registerStore.userInformation.phone }}</span>
    پیامک شد</span
  >

  <UPinInput
    v-model="otpVal"
    length="4"
    :otp="true"
    placeholder="○"
    class="otp gap-3"
    autofocus
  />

  <div class="">
    <div class="send-again flex">
      <span
        @click="timerStartHandle"
        class="text-primary cursor-pointer"
        :class="{ 'mix-blend-luminosity': counting }"
        v-if="!counting"
      >
        دریافت مجدد
      </span>
      <Countdown
        :date="new Date(+endTime)"
        @end="timerEndHandle"
        @start="timerStartHandle"
        v-slot="{ minutes, seconds }"
        v-if="counting"
      >
        <span>
          {{
            (seconds < 10 ? "0" + seconds.toString() : seconds) +
            " : " +
            (minutes < 10 ? "0" + minutes.toString() : minutes)
          }}
        </span>
      </Countdown>
    </div>
  </div>

  <UICSecondaryBtn
    class="w-full rounded-[8px]! justify-center h-[46px]"
    :disabled="auth.loading"
    @click="otpHandle"
  >
    تایید
  </UICSecondaryBtn>
</template>

<script setup>
const endTime = ref(localStorage.getItem("timer"));
const counting = ref(true);

onBeforeMount(() => {
  // console.log(new Date().setMinutes(new Date().getMinutes()));
  if (!localStorage.getItem("timer")) {
    endTime.value = new Date().setMinutes(new Date().getMinutes() + 2);
    localStorage.setItem("timer", endTime.value);
  } else if (
    localStorage.getItem("timer") <
    new Date().setMinutes(new Date().getMinutes())
  ) {
    console.log(222);
    localStorage.removeItem("timer");
    endTime.value = new Date().setMinutes(new Date().getMinutes() + 2);
    localStorage.setItem("timer", endTime.value);
  }
  endTime.value = localStorage.getItem("timer");
});
const otpVal = ref("");
watch(otpVal, (newVal) => {
  if (newVal.length == 4) otpHandle();
});

const registerStore = useRegisterStore();

const timerEndHandle = () => {
  if (localStorage.getItem("timer")) {
    counting.value = false;
    localStorage.removeItem("timer");
  }
};

const timerStartHandle = async () => {
  if (!localStorage.getItem("timer")) {
    endTime.value = new Date().setMinutes(new Date().getMinutes() + 2);

    localStorage.setItem("timer", endTime.value);

    const res = await usePost({
      url: "auth/send-code",
      body: { phone: registerStore.userInformation.phone },
    });
    console.log(res.status);

    if (res.statusCode === 200) {
      alert("send code");
    } else {
      console.log(res.error);
      alert("خطا");
    }
  }
  endTime.value = localStorage.getItem("timer");
  counting.value = true;
};

const auth = useAuthStore();
const otpHandle = async () => {
  const code = otpVal.value.join("");

  if (code.length !== 4) {
    alert("تعداد رقم کد تایید باید 4 رقم باشد");
    otpVal.value = "";
    return;
  }

  try {
    const result = await auth.verifyCodeAndLogin(
      registerStore.userInformation.phone,
      code
    );

    registerStore.userInformation.code = code;

    if (result.needsRegistration) {
      registerStore.nextStep();
      return;
    }

    navigateTo("/dashboard");
  } catch (error) {
    alert("کد وارد شده نامعتبر است");
    otpVal.value = "";
  }
};
</script>

<style scoped>
.otp {
  direction: ltr !important;
}
</style>