<template>
  <main>
    <!-- Hero Section -->
    <LandingHeader />

    <!-- Trust Bar -->
    <LandingTrustBar />

    <!-- Lawyers Section -->
    <div class="container">
      <LandingLawyersSection
        ref="lawyersSectionRef"
        link="lawyer/"
        :titlebtn="'رزرو مشاوره'" />
    </div>

    <!-- Services Section -->
    <LandingServicesSection />

    <!-- Why Choose Us -->
    <LandingWhyChooseUs />

    <!-- How It Works -->
    <LandingHowItWorks />

    <!-- Comments Section -->
    <div class="container">
      <LandingCommentsSection />
    </div>

    <!-- FAQ Section -->
    <div class="container">
      <LandingFaqSection />
    </div>

    <!-- CTA Section (آخرین فراخوان قبل از فوتر) -->
    <LandingCtaSection />
  </main>
</template>
<script setup>
const lawyersSectionRef = ref(null);

useSeoMeta({
  title: "وکیل وکیل | رزرو آنلاین نوبت وکیل | مشاوره حقوقی تخصصی",
  description:
    "پلتفرم رزرو آنلاین وکیل با بیش از 1000 وکیل متخصص. مشاوره حقوقی تلفنی، حضوری و آنلاین. رزرو آسان، قیمت شفاف، پاسخگویی سریع.",
  keywords:
    "وکیل, رزرو وکیل, مشاوره حقوقی, وکیل آنلاین, وکیل خوب, وکیل پایه یک, وکیل متخصص, مشاوره تلفنی, وکیل ایران, بهترین وکیل, وکیل ارزان, رزرو آنلاین وکیل, شماره وکیل, تلفن وکیل, مشاوره رایگان, مشاور حقوقی, وکیل دادگستری, وکیل حقوقی, نوبت وکیل, وکیل خانواده, وکیل طلاق, وکیل کیفری, وکیل ملکی, وکیل تجاری, مشاوره آنلاین, چطور وکیل پیدا کنم, هزینه وکیل, تعرفه وکیل, وکیل خوب کجا پیدا کنم, سایت رزرو وکیل, پلتفرم وکیل",

  // Open Graph
  ogTitle: "وکیل وکیل | رزرو آنلاین نوبت وکیل",
  ogDescription:
    "دسترسی آسان به بهترین وکلای کشور. رزرو آنلاین، مشاوره تخصصی، قیمت مناسب.",
  ogImage: "https://vakilvakil.com/og-image-home.jpg",
  ogUrl: "https://vakilvakil.com",
  ogType: "website",
  ogLocale: "fa_IR",

  // Twitter Card
  twitterCard: "summary_large_image",
  twitterTitle: "وکیل وکیل | رزرو آنلاین وکیل",
  twitterDescription: "دسترسی آسان به بهترین وکلای کشور",
  twitterImage: "https://vakilvakil.com/og-image-home.jpg",
});

useHead({
  link: [
    {
      rel: "canonical",
      href: "https://vakilvakil.com",
    },
  ],
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "وکیل وکیل",
        description: "پلتفرم رزرو آنلاین وکیل و مشاوره حقوقی",
        url: "https://vakilvakil.com",
        logo: "https://vakilvakil.com/logo.png",
        sameAs: [
          "https://www.instagram.com/vakilvakil",
          "https://twitter.com/vakilvakil",
        ],
      }),
    },
  ],
});
</script>
<style scoped>
@reference "tailwindcss";

main .container > section {
  @apply scroll-mt-20;
}
</style>
