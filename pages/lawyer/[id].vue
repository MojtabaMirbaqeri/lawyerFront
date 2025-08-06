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
          :fullname="lawyer.lawyer_info.name+' '+lawyer.lawyer_info.family"
          :active="lawyer.is_active"
          :avatar="lawyer.lawyer_info.profile_image"
          :education="lawyer.lawyer_info.base_lawyer.title"
          :experience="lawyer.years_of_experience"
          :rate="lawyer.average_rating.split('').splice(0, 3).join('')"
          :city="lawyer.city"
        />
        <info-lawyer-WhyOnlineVisit />
        <InfoLawyerChooseVisit class="block lg:hidden" />
        <info-lawyer-tab :dis="lawyer.lawyer_info.about" :pos="[+lawyer.latitude,+lawyer.longitude]"/>
        <info-lawyer-comment :id="lawyer.id" :lawyer-full-name="lawyer.lawyer_info.name+' '+lawyer.lawyer_info.family"/>
      </div>
      <div class="left w-[150%] hidden lg:block">
        <InfoLawyerChooseVisit class="sticky top-[90px]" />
      </div>
    </div>
  </main>
</template>


<script setup>
const res = await useGet({url:`lawyers/${useRoute().params.id}`},"")
const data = await res.data
const lawyer = ref(data.data)


onMounted(() => {
  console.log(lawyer.value.id);
})
</script>

<style scoped></style>