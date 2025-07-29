<template>
  <h1 class="sec-header">کد تایید</h1>

  <UPinInput v-model="otpVal" length="4" :otp="true" placeholder="○" class="otp" />

  <UICSecondaryBtn
    class="w-full rounded-[8px]! justify-center h-[46px]"
    @click="otpHandle"
  >
    تایید
  </UICSecondaryBtn>
</template>

<script setup>
const otpVal = ref("");

const otpHandle = async () => {
    // otpVal.value = otpVal.value.join('')
    if(otpVal.value.join('').length !== 4){
        alert('تعداد رقم کد تایید باید 4 رقم باشد')
        return
    }
    else if(otpVal.value.join('') < '4444'){
        alert('کد تایید نادرست است')
        return
    }
    console.log();
}
</script>

<style scoped>
.otp {
  direction: ltr !important;
}
</style>