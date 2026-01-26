<template>
  <div class="primary-box">
    <h1 class="sec-header mb-3">اطلاعات پرداخت</h1>

    <div class="pay-detail">
      <div class="flex flex-col gap-3">
        <div class="top">
          <div
            class="bg-[#1e3a5f]/10 flex flex-col gap-3 p-3 border rounded-[8px] text-[#1e3a5f] border-[#1e3a5f]"
          >
            <div class="tax flex justify-between">
              <div class="title">قیمت اصلی</div>
              <div class="price">{{ detailPrice.mainPrice }} تومان</div>
            </div>
            <div class="tax flex justify-between">
              <div class="title">تخفیف</div>
              <div class="price">{{ detailPrice.offerValue }} تومان</div>
            </div>
            <USeparator class="opacity-30" color="primary" />
            <div class="top border-b border-[#1e3a5f]/30 pb-2">
              <div class="tax flex justify-between">
                <div class="title">قیمت نهایی</div>
                <div class="price">{{ detailPrice.price }} تومان</div>
              </div>
            </div>
            <div class="bottom p-2 rounded-b-[8px] flex items-start gap-2">
              <UIcon
                name="hugeicons:information-diamond"
                class="size-4! lg:size-5! opacity-80 shrink-0"
              />
              <span class="opacity-80 paragraph"
                >مبلغ 150,000 تومان را که به عنوان بیعانه به صورت آنلاین پرداخت
                می‌کنید از هزینه مشاوره کسر می‌شود و مابقی هزینه مشاوره در دفتر
                از شما دریافت می‌گردد.</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(["detailPrice"]);
</script>

<style>
</style>