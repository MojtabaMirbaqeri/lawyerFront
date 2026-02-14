<template>
  <main>
    <div class="container py-8 lg:py-12">
      <LandingFaqSection />
    </div>
  </main>
</template>

<script setup>
useSeoMeta({
  title: "سوالات متداول | وکیل وکیل | رزرو آنلاین نوبت وکیل",
  description:
    "پاسخ به سوالات متداول درباره رزرو نوبت وکیل، مشاوره حقوقی تلفنی و حضوری، مدت مشاوره، تغییر زمان و لغو نوبت.",
  keywords:
    "سوالات متداول وکیل, مشاوره حقوقی, رزرو وکیل, مدت مشاوره, تغییر زمان مشاوره, لغو نوبت وکیل, پشتیبانی وکیل",

  ogTitle: "سوالات متداول | وکیل وکیل",
  ogDescription: "پاسخ به پرسش‌های رایج درباره خدمات مشاوره حقوقی و رزرو نوبت وکیل",
  ogUrl: "https://vakilvakil.com/faq",
  ogType: "website",
  ogLocale: "fa_IR",

  twitterCard: "summary_large_image",
  twitterTitle: "سوالات متداول | وکیل وکیل",
  twitterDescription: "پاسخ به پرسش‌های رایج درباره مشاوره حقوقی",
});

useHead({
  link: [
    {
      rel: "canonical",
      href: "https://vakilvakil.com/faq",
    },
  ],
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "مدت زمان هر مشاوره چقدر است؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "مدت زمان مشاوره بسته به نوع خدمت انتخابی متفاوت است، معمولاً بین ۲۰ تا ۴۵ دقیقه. در صورت نیاز به زمان بیشتر، امکان تمدید جلسه با هماهنگی وکیل وجود دارد.",
            },
          },
          {
            "@type": "Question",
            name: "چه مدارکی باید ارسال کنیم؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "هر نوع مدرک مرتبط با موضوع مشاوره مانند قرارداد، نامه رسمی، پیامک‌ها یا تصاویر مدارک شناسایی می‌تواند مفید باشد. وکیل در صورت نیاز لیست دقیق‌تری از مدارک را درخواست خواهد کرد.",
            },
          },
          {
            "@type": "Question",
            name: "آیا امکان تغییر زمان مشاوره وجود دارد؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "بله، تا ۲ ساعت قبل از زمان تعیین‌شده امکان تغییر یا لغو مشاوره از طریق پنل کاربری یا پشتیبانی وجود دارد. پس از آن، تغییر زمان فقط با تایید وکیل ممکن است.",
            },
          },
          {
            "@type": "Question",
            name: "در صورت نارضایتی از مشاوره چه باید کرد؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "می‌توانید موضوع را از طریق پشتیبانی پیگیری کرده و درخواست بررسی مجدد ثبت کنید. ما کیفیت خدمات و رضایت کاربران را در اولویت قرار می‌دهیم.",
            },
          },
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
