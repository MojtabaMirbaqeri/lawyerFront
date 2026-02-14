<template>
  <main>
    <FilteredHero :title="pageTitle" :subtitle="pageSubtitle" />

    <div class="container pt-0 space-y-14 lg:space-y-20">
      <FilteredLawyersList link="lawyer/" :specialty-id="specialty.id" />
    </div>
  </main>
</template>

<script setup>
const route = useRoute();
const slug = route.params.slug;

const filtersStore = useFiltersStore();

// Find specialty by title (decoded from URL)
const decodedSlug = decodeURIComponent(slug);
const specialty = filtersStore.lawyerSpecialties.find(
  (s) => s.title.replace(/\s+/g, "-") === decodedSlug,
);

if (!specialty) {
  throw createError({
    statusCode: 404,
    message: "تخصص مورد نظر یافت نشد",
  });
}

// Page metadata
const pageTitle = computed(() => `${specialty.title}`);
const pageSubtitle = computed(
  () => `بهترین وکلای متخصص در ${specialty.title} را پیدا کنید`,
);

useSeoMeta({
  title: () => `وکیل ${specialty.title} | رزرو نوبت ${specialty.title} | وکیل وکیل`,
  description: () =>
    `بهترین وکلای متخصص ${specialty.title} با سابقه درخشان. رزرو آنلاین نوبت مشاوره. مشاوره تلفنی، حضوری و آنلاین ${specialty.title}.`,
  keywords: () =>
    `وکیل ${specialty.title}, ${specialty.title}, مشاوره ${specialty.title}, وکیل خوب ${specialty.title}, رزرو وکیل ${specialty.title}, وکیل پایه یک ${specialty.title}, وکیل متخصص ${specialty.title}, مشاور ${specialty.title}, بهترین وکیل ${specialty.title}, هزینه وکیل ${specialty.title}, تعرفه وکیل ${specialty.title}, مشاوره رایگان ${specialty.title}, مشاوره آنلاین ${specialty.title}, مشاوره تلفنی ${specialty.title}, نوبت ${specialty.title}, وکیل ارزان ${specialty.title}, شماره وکیل ${specialty.title}`,

  // Open Graph
  ogTitle: () => `وکیل ${specialty.title} | رزرو نوبت آنلاین`,
  ogDescription: () =>
    `دسترسی به بهترین وکلای متخصص ${specialty.title}. رزرو آنلاین، مشاوره تخصصی، قیمت شفاف.`,
  ogImage: `https://vakilvakil.com/og-images/specialty-${specialty.id}.jpg`,
  ogUrl: () =>
    `https://vakilvakil.com/specialties/${encodeURIComponent(
      specialty.title.replace(/\s+/g, "-"),
    )}`,
  ogType: "website",
  ogLocale: "fa_IR",

  // Twitter Card
  twitterCard: "summary_large_image",
  twitterTitle: () => `وکیل ${specialty.title}`,
  twitterDescription: () => `رزرو آنلاین بهترین وکلای ${specialty.title}`,
  twitterImage: `https://vakilvakil.com/og-images/specialty-${specialty.id}.jpg`,
});

useHead({
  link: [
    {
      rel: "canonical",
      href: `https://vakilvakil.com/specialties/${encodeURIComponent(
        specialty.title.replace(/\s+/g, "-"),
      )}`,
    },
  ],
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: `خدمات ${specialty.title}`,
        description: `دسترسی به وکلای متخصص ${specialty.title}`,
        provider: {
          "@type": "Organization",
          name: "وکیل وکیل",
          url: "https://vakilvakil.com",
        },
        serviceType: specialty.title,
        areaServed: "IR",
        url: `https://vakilvakil.com/specialties/${encodeURIComponent(
          specialty.title.replace(/\s+/g, "-"),
        )}`,
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
