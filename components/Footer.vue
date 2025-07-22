<template>
  <footer id="footer" class="bg-primary/90">
    <div class="footer-con">
      <div
        class="divide-y divide-gray-200 lg:divide-y-0 lg:flex flex-row items-center gap-12 lg:container lg:py-6"
      >
        <div class="partners lg:grow">
          <div class="container lg:p-0!">
            <div>
              <div class="text-base">همراهان وکیلینجا:</div>
            </div>
            <div class="grow">
              <div class="container partners-logos">
                <NuxtImg
                  v-for="partner in partners"
                  :key="partner"
                  :src="`/images/footer/${partner}`"
                  class="h-6 lg:h-8"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="container help">
            <h3 class="text-primary">نیاز به راهنمایی دارید؟</h3>
            <NuxtLink to="tel:+982110014488" external>
              <UICSecondaryBtn> 021-10014488 </UICSecondaryBtn>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div>
        <div
          class="container flex flex-col lg:flex-row lg:items-start gap-2.5 py-7! lg:gap-8 lg:justify-between lg:py-12!"
        >
          <div
            class="flex justify-between items-center lg:flex-col lg:items-start gap-4"
          >
            <NuxtImg src="/images/logo.png" class="h-5.5" />
            <div class="social-networks">
              <NuxtLink
                v-for="social in socials"
                :key="social"
                :to="social.src"
                class="social bg-primary/12"
              >
                <UIcon :name="social.icon" />
              </NuxtLink>
            </div>
          </div>
          <div
            class="p-4 bg-gray-100 lg:max-w-[540px] rounded-[20px] space-y-2"
          >
            <h4 class="font-bold">دانلود اپلیکیشن وکیلینجا</h4>
            <p>
              دسترسی راحت‌تر و سریع‌تر به وکلا، شما می‌توانید با انتخاب دکمه‌های
              زیر اقدام به دانلود اپ وکیلینجا کنید.
            </p>
            <div class="download-links">
              <NuxtLink to="#">
                <NuxtImg src="/images/footer/GooglePlayDownloadApp.svg" />
              </NuxtLink>
              <NuxtLink to="#">
                <NuxtImg src="/images/footer/MyketShareDownloadApp.svg" />
              </NuxtLink>
              <NuxtLink to="#">
                <NuxtImg src="/images/footer/CafeBazzarDownloadApp.svg" />
              </NuxtLink>
              <NuxtLink to="#">
                <NuxtImg src="/images/footer/GooglePlayDownloadApp.svg" />
              </NuxtLink>
            </div>
          </div>
          <div
            class="grid grid-cols-2 mx-5 lg:mx-0 py-2 gap-y-2.5 text-primary lg:shrink-0 lg:gap-y-3"
          >
            <NuxtLink to="#"> خانه</NuxtLink>
            <NuxtLink to="#"> ثبت نام و ورود </NuxtLink>
            <NuxtLink to="#"> درباره ما </NuxtLink>
            <NuxtLink to="#"> سوالات متداول </NuxtLink>
            <NuxtLink to="#"> ارتباط با ما</NuxtLink>
            <NuxtLink to="#"> راهنمای ویزیت آنلاین</NuxtLink>
          </div>
        </div>
      </div>
      <div>
        <div class="container licenses">
          <NuxtLink
            v-for="license in licenses"
            :key="license.name"
            :to="license.src"
          >
            <NuxtImg :src="license.image" />
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="copy-right">
      <div class="container">
        1404 - تمامی حقوق مادی و معنوی این وبسایت متعلق به وکیلینجا می‌باشد.
      </div>
    </div>
  </footer>
</template>
<script setup>
const partners = ["Aparat.svg", "Filimo.svg", "Takhfifan.svg"];

const socials = [
  {
    name: "instagram",
    icon: "hugeicons:instagram",
    src: "#",
  },
  {
    name: "telegram",
    icon: "hugeicons:telegram",
    src: "#",
  },
  {
    name: "twitter",
    icon: "hugeicons:new-twitter",
    src: "#",
  },
];

const licenses = [
  {
    name: "enamad",
    image: "/images/footer/enamad-logo.webp",
    src: "#",
  },
  {
    name: "anjoman senfi",
    image: "/images/footer/anjoman-senfi.webp",
    src: "#",
  },
  {
    name: "rasane digital",
    image: "/images/footer/rasane-digital.webp",
    src: "#",
  },
  {
    name: "kasb online",
    image: "/images/footer/kasb-online.webp",
    src: "#",
  },
];
</script>
<style scoped>
@reference "tailwindcss";

#footer {
  @apply text-sm lg:text-base;
}

.container {
  @apply py-0;
}

.footer-con {
  @apply bg-white rounded-b-3xl;
  @apply flex flex-col divide-y divide-gray-200;
}

.partners > .container {
  @apply flex flex-col lg:flex-row lg:items-center items-stretch py-5 gap-2 lg:gap-6;
}

.partners-logos {
  @apply flex items-center justify-between lg:p-0!;
}

.help {
  @apply flex justify-between items-center py-5! gap-6 lg:p-0!;
}

.social-networks {
  @apply flex items-center gap-2.5 flex-row-reverse;
}

.social-networks .social {
  @apply size-8 lg:size-9 rounded-full relative;
}

.social-networks .social .iconify {
  @apply absolute -translate-1/2 top-1/2 end-1/2 size-4.5! lg:size-5.5!;
}

.copy-right {
  @apply pt-3 lg:pt-5 pb-2 lg:pb-3 text-white text-sm;
}

.download-links {
  @apply grid grid-cols-2 gap-4 w-fit mx-auto pt-2;
}
.download-links img {
  @apply h-10;
}

.licenses {
  @apply flex items-center gap-4 lg:gap-8 justify-center py-6 lg:py-8;
}

.licenses img {
  @apply w-14 lg:w-16;
}
</style>