<template>
  <main>
    <LandingHeader />

    <div class="container pt-0 space-y-14 lg:space-y-20">
      <LandingLawyersSection
        ref="lawyersSectionRef"
        link="lawyer/"
        :titlebtn="'رزرو مشاوره'" />
      <LandingCommentsSection />
      <LandingVisitGuideSection />
      <LandingFaqSection />
    </div>
  </main>
</template>
<script setup>
const lawyersSectionRef = ref(null);
</script>
<style scoped>
@reference "tailwindcss";

main .container > section {
  @apply pt-4 lg:pt-5 scroll-mt-16;
}
</style>
