<template>
  <main>
    <LandingHeader />
    <UICBreadCrumb
      :items="[
        {
          label: 'خانه',
          to: '/',
        },
      ]"
    />
    <div class="container pt-0 space-y-14 lg:space-y-20">
      <LandingLawyersSection />
      <LandingCommentsSection />
      <LandingVisitGuideSection />
      <LandingFaqSection />
    </div>
  </main>
</template>
