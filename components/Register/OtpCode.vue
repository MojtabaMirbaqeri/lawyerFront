<template>
  <div class="flex flex-col gap-6 w-full">
    <RegisterCardHeader title="کد تأیید" />

    <p class="text-slate-600 text-sm">
      کد تأیید برای شماره
      <span class="font-semibold text-[#1e3a5f]">{{ registerStore.userInformation.phone }}</span>
      پیامک شد.
    </p>

    <div class="otp-wrapper flex justify-center">
      <UPinInput
        ref="otpInputRef"
        v-model="otpVal"
        length="4"
        :otp="true"
        placeholder="○"
        class="otp gap-3"
        autofocus
      />
    </div>

    <div class="flex items-center justify-center gap-2">
      <button
        v-if="!counting"
        type="button"
        class="text-sm font-medium text-[#1e3a5f] hover:underline"
        @click="timerStartHandle"
      >
        دریافت مجدد
      </button>
      <Countdown
        v-if="counting"
        :date="new Date(+endTime)"
        @end="timerEndHandle"
        @start="timerStartHandle"
        v-slot="{ minutes, seconds }"
      >
        <span class="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-sm tabular-nums text-slate-600">
          <UIcon name="solar:clock-circle-linear" class="size-4" />
          {{ String(seconds).padStart(2, '0') }} : {{ String(minutes).padStart(2, '0') }}
        </span>
      </Countdown>
    </div>

    <UICSecondaryBtn
      class="w-full rounded-xl h-12 text-base font-semibold bg-[#1e3a5f] hover:opacity-90 transition"
      :disabled="auth.loading"
      @click="otpHandle"
    >
      تأیید
    </UICSecondaryBtn>
  </div>
</template>

<script setup>
const endTime = ref(localStorage.getItem("timer"));
const counting = ref(true);
const otpInputRef = ref(null);

onBeforeMount(() => {
  if (!localStorage.getItem("timer")) {
    endTime.value = new Date().setMinutes(new Date().getMinutes() + 2);
    localStorage.setItem("timer", endTime.value);
  } else if (
    localStorage.getItem("timer") < new Date().setMinutes(new Date().getMinutes())
  ) {
    localStorage.removeItem("timer");
    endTime.value = new Date().setMinutes(new Date().getMinutes() + 2);
    localStorage.setItem("timer", endTime.value);
  }
  endTime.value = localStorage.getItem("timer");
});

const otpVal = ref("");
watch(otpVal, (newVal) => {
  if (newVal.length === 4) otpHandle();
});

onMounted(async () => {
  await nextTick(() => {
    const inputs = document.querySelectorAll(".otp input");
    inputs.forEach((input) => {
      input.setAttribute("type", "text");
      input.setAttribute("inputmode", "numeric");
      input.setAttribute("pattern", "[0-9]*");
      input.style.direction = "ltr";
      input.style.textAlign = "center";
    });
  });
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

    if (res.statusCode === 200) {
      useToast().add({
        title: "کد تأیید برای شما پیامک شد.",
        icon: "solar:phone-linear",
        color: "success",
      });
    } else {
      useToast().add({
        title: "شماره موبایل شما تأیید نشد.",
        icon: "solar:phone-linear",
        color: "error",
      });
    }
  }
  endTime.value = localStorage.getItem("timer");
  counting.value = true;
};

const auth = useAuthStore();
const isSubmitting = ref(false);

const otpHandle = async () => {
  if (isSubmitting.value) return;

  const code = otpVal.value.join("");

  if (code.length !== 4) return;

  try {
    isSubmitting.value = true;

    const result = await auth.verifyCodeAndLogin(
      registerStore.userInformation.phone,
      code
    );

    registerStore.userInformation.code = code;

    if (result.needsRegistration) {
      registerStore.nextStep();
      return;
    }

    useNavigateToDashboard(true);
  } catch (error) {
    useToast().add({
      title: "کد ورود نامعتبر است.",
      icon: "solar:password-minimalistic-input-broken",
      color: "error",
    });
    nextTick(() => {
      document.querySelector(".otp input")?.focus();
    });
    otpVal.value = "";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
@reference "tailwindcss";

.otp-wrapper {
  direction: ltr;
}

.otp-wrapper :deep(.otp) {
  display: flex;
  justify-content: center;
  direction: ltr !important;
}

.otp-wrapper :deep(input) {
  @apply rounded-lg border-2 border-slate-200 text-center text-lg font-semibold transition focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20;
  direction: ltr !important;
  text-align: center !important;
}
</style>
