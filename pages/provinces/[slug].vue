<template>
  <main>
    <FilteredHero :title="pageTitle" :subtitle="pageSubtitle" />

    <div class="container pt-0 space-y-14 lg:space-y-20">
      <FilteredLawyersList link="lawyer/" :province-id="province.id" />
    </div>
  </main>
</template>

<script setup>
import provincesData from "~/public/provinces.json";

const route = useRoute();
const slug = route.params.slug;

// Load provinces
const provinces = provincesData;

// Find province by en_name slug
const province = provinces.find((p) => p.en_name === slug);

if (!province) {
  throw createError({
    statusCode: 404,
    message: "استان مورد نظر یافت نشد",
  });
}

// Page metadata
const pageTitle = computed(() => `وکیل ${province.name}: لیست بهترین وکلای ${province.name} آنلاین و تلفنی`);
const pageSubtitle = computed(() => `بهترین وکلای ${province.name} را پیدا کنید`);

useSeoMeta({
  title: () =>
    ` لیست وکلای ${province.name} |`,
  description: () =>
    `بهترین وکیل ${province.name} را در وکیل‌وکیل پیدا کنید؛ با فیلتر تخصصی جستجو کنید، پروفایل‌ها و سوابق را ببینید، مشاوره آنلاین/تلفنی بگیرید و نوبت را فوری رزرو کنید.`,
  keywords: () =>
    `وکیل ${province.name}, وکیل استان ${province.name}, رزرو وکیل ${province.name}, مشاوره حقوقی ${province.name}, وکیل خوب ${province.name}, وکیل پایه یک ${province.name}, شماره وکیل ${province.name}, بهترین وکیل ${province.name}, وکیل متخصص ${province.name}, وکیل ارزان ${province.name}, آدرس وکیل ${province.name}, تلفن وکیل ${province.name}, رزرو آنلاین وکیل ${province.name}, مشاوره تلفنی ${province.name}, مشاوره حضوری ${province.name}, وکیل خانواده ${province.name}, وکیل طلاق ${province.name}, وکیل کیفری ${province.name}, وکیل ملکی ${province.name}, نوبت وکیل ${province.name}, وکیل آنلاین ${province.name}, وکیل تلفنی ${province.name}, لیست وکلا در ${province.name}, وکیل فوری ${province.name}`,

  // Open Graph
  ogTitle: () => `وکیل استان ${province.name} | رزرو نوبت آنلاین`,
  ogDescription: () =>
    `دسترسی آسان به بهترین وکلای استان ${province.name}. رزرو آنلاین، مشاوره تخصصی، قیمت مناسب.`,
  ogImage: `https://vakilvakil.com/og-images/province-${province.en_name}.jpg`,
  ogUrl: () => `https://vakilvakil.com/provinces/${province.en_name}`,
  ogType: "website",
  ogLocale: "fa_IR",

  // Twitter Card
  twitterCard: "summary_large_image",
  twitterTitle: () => `وکیل استان ${province.name}`,
  twitterDescription: () => `رزرو آنلاین بهترین وکلای ${province.name}`,
  twitterImage: `https://vakilvakil.com/og-images/province-${province.en_name}.jpg`,
});

useHead({
  link: [
    {
      rel: "canonical",
      href: `https://vakilvakil.com/provinces/${province.en_name}`,
    },
  ],
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: `وکیل وکیل - استان ${province.name}`,
        description: `پلتفرم رزرو آنلاین وکیل در استان ${province.name}`,
        areaServed: {
          "@type": "State",
          name: province.name,
        },
        provider: {
          "@type": "Organization",
          name: "وکیل وکیل",
          url: "https://vakilvakil.com",
        },
        url: `https://vakilvakil.com/provinces/${province.en_name}`,
      }),
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
