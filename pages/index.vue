<template>
  <main>
    <LandingHeader />
    <UIBreadCrumb
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
      <div></div>
    </div>
  </main>
</template>
