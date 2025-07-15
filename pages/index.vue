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
    <div class="container pt-0 space-y-4">
      <LandingLawyersSection />
    </div>
  </main>
</template>
