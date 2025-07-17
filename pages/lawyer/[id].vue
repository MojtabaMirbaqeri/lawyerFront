<template>
  <main>
    <UICBreadCrumb
      :items="[
        {
          label: 'خانه',
          to: '/',
        },
        {
          label: 'جزییات وکیل',
          to: '/lawyer/4',
        },
      ]"
    />
    <div class="container gap-4 flex flex-col lg:flex-row">
      <div class="right flex flex-col gap-4">
        <info-lawyer-card
          fullname="حلیمه صابریان"
          :active="true"
          avatar="/images/avatar.png"
          education="وکیل پایه یک دادگستری"
          experience="8"
          rate="4.9"
          city="بابل"
          visit="2456"
        />
        <info-lawyer-WhyOnlineVisit />
        <InfoLawyerChooseVisit class="block lg:hidden" />
        <info-lawyer-tab />
        <info-lawyer-comment />
      </div>
      <div class="left w-[150%] hidden lg:block">
        <InfoLawyerChooseVisit class="sticky top-[90px]" />
      </div>
    </div>
  </main>
</template>

<script setup>
</script>

<style scoped></style>