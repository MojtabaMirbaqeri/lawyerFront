<template>
  <main>
    <FilteredHero :title="pageTitle" :subtitle="pageSubtitle" />

    <div class="container pt-0 space-y-14 lg:space-y-20">
      <LandingLawyersSection
        link="lawyer/"
        titlebtn="رزرو مشاوره"
        :hide-section-header="true" />
    </div>
  </main>
</template>

<script setup>
const pageTitle = "لیست وکلای متخصص";
const pageSubtitle = "بهترین وکلا را با توجه به تخصص و رتبه‌بندی انتخاب کنید";

useSeoMeta({
  title: "لیست وکلا | رزرو آنلاین نوبت وکیل | وکیل وکیل",
  description:
    "لیست کامل وکلای متخصص با امکان فیلتر و مرتب‌سازی. رزرو آنلاین نوبت، مشاوره حقوقی تلفنی، حضوری و آنلاین. وکیل خوب با تجربه.",
  keywords:
    "لیست وکلا, وکیل, رزرو وکیل, مشاوره حقوقی, وکیل آنلاین, وکیل خوب, فیلتر وکیل, مرتب‌سازی وکلا, وکیل پایه یک, وکیل متخصص",

  ogTitle: "لیست وکلا | رزرو آنلاین نوبت وکیل",
  ogDescription:
    "دسترسی به لیست وکلای متخصص با فیلتر و مرتب‌سازی. رزرو آنلاین، مشاوره تخصصی.",
  ogUrl: "https://vakilvakil.com/lawyers",
  ogType: "website",
  ogLocale: "fa_IR",

  twitterCard: "summary_large_image",
  twitterTitle: "لیست وکلا | وکیل وکیل",
  twitterDescription: "لیست وکلای متخصص با فیلتر و مرتب‌سازی",
});

useHead({
  link: [
    {
      rel: "canonical",
      href: "https://vakilvakil.com/lawyers",
    },
  ],
});
</script>

<style scoped>
@reference "tailwindcss";

main .container > section {
  @apply pt-4 lg:pt-5 scroll-mt-16;
}
</style>
