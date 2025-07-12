<template>
  <main>
    <UIBreadCrumb
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
    <div class="right">
      <info-lawyer-card
        fullname="حلیمه صابریان"
        :active="true"
        avatar="/images/avatar.png"
        education="وکیل پایه یک دادگستری"
        experience="8"
        rate="4.9"
        city="بابل"
      />
    </div>
    <div class="lrft">ll</div>
  </main>
</template>

<script setup>
import { UIBreadCrumb } from "#components";
</script>

<style scoped></style>