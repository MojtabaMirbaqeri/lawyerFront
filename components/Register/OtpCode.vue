<template>
  <h1 class="sec-header">کد تایید را وارد کنید</h1>
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

const registerStore = useRegisterStore();

const timerEndHandle = () => {
  if (localStorage.getItem("timer")) {
    counting.value = false;
    localStorage.removeItem("timer");
  }
};

const timerStartHandle = async () => {
  console.log("hhh");

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

const otpHandle = async () => {
  if (otpVal.value.join("").length !== 4) {
    alert("تعداد رقم کد تایید باید 4 رقم باشد");
    otpVal.value = "";
    return;
  } else {
    const res = await usePost({
      url: "auth/verify-code",
      body: {
        phone: registerStore.userInformation.phone,
        code: otpVal.value.join(""),
      },
    });
    if (res.statusCode === 200) {
      if (res.data.data.needs_registration) {
        registerStore.nextStep();
        return;
      }
      console.log(res);
//      {
//     "data": {
//         "status": 200,
//         "data": {
//             "success": true,
//             "message": "ورود موفقیت‌آمیز بود",
//             "token": "54|ZA7mdQsWTQLnOXMXKYW4GGPekfcOMkrbNp7byXVd5cde7a28",
//             "user": {
//                 "id": 117,
//                 "name": "کاربر",
//                 "family": "سیستم",
//                 "phone": "09140903685",
//                 "email": "09140903685@temp.com",
//                 "roles": [
//                     {
//                         "id": 3,
//                         "name": "کاربر",
//                         "slug": "user"
//                     }
//                 ],
//                 "user_type": "user"
//             }
//         },
//         "message": "ورود موفقیت‌آمیز بود"
//     },
//     "status": true,
//     "statusCode": 200,
//     "pending": false
// }
      registerStore.userInformation.code = otpVal.value.join("");
      registerStore.formStep = 5;
    } else {
      alert("code is not valid");
      otpVal.value = "";
    }
  }
  // console.log(registerStore.userInformation);
};
</script>

<style scoped>
.otp {
  direction: ltr !important;
}
</style>