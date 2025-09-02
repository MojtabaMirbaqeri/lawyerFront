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
          to: `/lawyer/${$route.params.id}`,
        },
      ]"
    />
    <div class="container gap-4 flex flex-col lg:flex-row">
      <div class="right flex flex-col gap-4">
        <info-lawyer-card
          :fullname="lawyer.lawyer_info.name + ' ' + lawyer.lawyer_info.family"
          :active="lawyer.is_active"
          :avatar="lawyer.lawyer_info.profile_image"
          :education="lawyer.lawyer_info.base_lawyer.title"
          :experience="lawyer.years_of_experience"
          :rate="lawyer.average_rating.toString().split('').splice(0, 3).join('')"
          :city="lawyer.city"
          :spc="lawyer.lawyer_info.specialties"
        />
        <info-lawyer-WhyOnlineVisit />
        <InfoLawyerChooseVisit :items="items" class="block lg:hidden" />
        <info-lawyer-tab
          :dis="lawyer.lawyer_info.about"
          :pos="[+lawyer.latitude, +lawyer.longitude]"
          :sch="sch"
        />
        <info-lawyer-comment
          :id="lawyer.id"
          :lawyer-full-name="
            lawyer.lawyer_info.name + ' ' + lawyer.lawyer_info.family
          "
        />
      </div>
      <div class="left w-[150%] hidden lg:block">
        <InfoLawyerChooseVisit :items="items" class="sticky top-[90px]" />
      </div>
    </div>
  </main>
</template>


<script setup>
const res = await useGet({ url: `lawyers/${useRoute().params.id}` }, "");
const data = await res.data;
const lawyer = ref(data.data);

const result = await useGet({
  url: `lawyer_schedules/grouped/${useRoute().params.id}`,
  includeAuthHeader: true,
});
const sch = await result.data;
useFiltersStore().price = sch.prices;
const filterStore = useFiltersStore();
const items = ref([
  {
    id: "1",
    title: "مشاوره تلفنی",
    price: filterStore.price.phone,
    value: "phone",
    icon: "hugeicons:telephone",
    active:sch.phone.length > 0
  },
  {
    id: "2",
    title: "مشاوره حضوری",
    price: filterStore.price.inperson,
    value: "inperson",
    icon: "hugeicons:building-06",
    active:sch.inperson.length > 0
  },
  {
    id: "3",
    title: "چت",
    price: filterStore.price.chat,
    value: "chat",
    icon: "hugeicons:message-multiple-02",
    active:sch.chat.length > 0
  },
]);
</script>

<style scoped></style>