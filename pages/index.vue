<template>
  <main>
    <LandingHeader @scroll-to-lawyers="scrollToLawyers()" />
    <UICBreadCrumb
      ref="breadCrumbRef"
      :items="[
        {
          label: 'خانه',
          to: '/',
        },
      ]"
    />
    <div class="container pt-0 space-y-14 lg:space-y-20">
      <LandingLawyersSection link="lawyer/" :titlebtn="'رزرو مشاوره'"/>
      <LandingCommentsSection />
      <LandingVisitGuideSection />
      <LandingFaqSection />
    </div>
  </main>
</template>
<script setup>

const breadCrumbRef = ref(null);
const scrollToElement = useScrollToElement();

const scrollToLawyers = () => {
  scrollToElement(breadCrumbRef.value.$el);
  console.log(breadCrumbRef.value.$el);
};
</script>