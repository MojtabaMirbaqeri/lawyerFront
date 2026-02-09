<template>
  <footer id="footer">
    <!-- Main Footer -->
    <div class="w-vw overflow-x-clip">
      <div id="pos-article-text-card-115773"></div>
    </div>
    <div class="footer-main">

      <div class="container">
        <div class="footer-grid">
          <!-- Brand Section -->
          <div class="footer-brand">
            <NuxtImg src="/images/VakilVakilLogo.png" class="h-10 mb-4" />
            <p class="brand-tagline">
              پلتفرم هوشمند رزرو نوبت وکیل و دریافت مشاوره حقوقی آنلاین
            </p>
            <div class="social-links">
              <NuxtLink
                v-for="social in socials"
                :key="social.name"
                :to="social.src"
                target="_blank"
                class="social-link">
                <UIcon :name="social.icon" class="size-5!" />
              </NuxtLink>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="footer-links">
            <h4 class="footer-title">دسترسی سریع</h4>
            <ul class="links-list">
              <li><NuxtLink to="/">خانه</NuxtLink></li>
              <li><NuxtLink to="/lawyers">لیست وکلا</NuxtLink></li>
              <li><NuxtLink to="/faq">سوالات متداول</NuxtLink></li>
              <li><NuxtLink to="/register">ورود / ثبت‌نام</NuxtLink></li>
            </ul>
          </div>

          <!-- Services -->
          <div class="footer-links">
            <h4 class="footer-title">خدمات</h4>
            <ul class="links-list">
              <li><a href="#">مشاوره تلفنی</a></li>
              <li><a href="#">مشاوره چت</a></li>
              <li><a href="#">مشاوره ویدیویی</a></li>
              <li><a href="#">مشاوره حضوری</a></li>
            </ul>
          </div>

          <!-- Contact & Support -->
          <div class="footer-contact">
            <h4 class="footer-title">پشتیبانی</h4>
            <div class="contact-box">
              <div class="contact-icon">
                <UIcon name="heroicons:phone-solid" class="size-6!" />
              </div>
              <div>
                <p class="contact-label">تماس با ما</p>
                <a href="tel:+982110014488" class="contact-number">021-10014488</a>
              </div>
            </div>
            <div class="download-section">
              <p class="download-label">دانلود اپلیکیشن</p>
              <div class="download-badges">
                <NuxtLink to="#">
                  <img
                    src="/images/footer/GooglePlayDownloadApp.svg"
                    alt="دانلود از گوگل پلی"
                    class="download-badge" />
                </NuxtLink>
                <NuxtLink to="#">
                  <img
                    src="/images/footer/CafeBazzarDownloadApp.svg"
                    alt="دانلود از کافه‌بازار"
                    class="download-badge" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Trust Badges - یک باکس واحد -->
        <div class="trust-badges" v-if="false">
          <div class="badges-row">
            <NuxtLink
              v-for="license in licenses"
              :key="license.name"
              :to="license.src"
              class="badge-item">
              <img :src="license.image" :alt="license.name" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="copyright">
      <div class="container">
        <p>
          © 1404 تمامی حقوق مادی و معنوی این وب‌سایت متعلق به
          <strong>وکیل‌وکیل</strong> می‌باشد.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const socials = [
  {
    name: "instagram",
    icon: "mdi:instagram",
    src: "https://www.instagram.com/vakilvakil_com",
  },
  { name: "telegram", icon: "mdi:telegram", src: "https://t.me/vakilvakil_com" },
  {
    name: "aparat",
    icon: "simple-icons:aparat",
    src: "https://www.aparat.com/vakilvakil_com",
  },
];

const licenses = [
  { name: "enamad", image: "/images/footer/enamad-logo.webp", src: "/enamad" },
  { name: "anjoman senfi", image: "/images/footer/anjoman-senfi.webp", src: "#" },
  { name: "rasane digital", image: "/images/footer/rasane-digital.webp", src: "#" },
  { name: "kasb online", image: "/images/footer/kasb-online.webp", src: "#" },
];
</script>

<style scoped>
@reference "tailwindcss";

#footer {
  @apply mt-0;
}

.footer-main {
  @apply py-12 lg:py-16 border-t border-gray-200;
  background-color: #f8fafd;
}

.footer-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12;
}

.footer-brand {
  @apply lg:col-span-1;
}

.brand-tagline {
  @apply text-gray-500 text-sm leading-relaxed mb-6;
}

.social-links {
  @apply flex items-center gap-3;
}

.social-link {
  @apply size-10 rounded-xl flex items-center justify-center text-gray-500 transition-all;
  background: #f3f4f6;
}

.social-link:hover {
  @apply text-white;
  background: #1e3a5f;
  transform: translateY(-2px);
}

.footer-title {
  @apply text-gray-900 font-bold text-lg mb-5;
}

.links-list {
  @apply space-y-3;
}

.links-list a {
  @apply text-gray-500 hover:text-[#1e3a5f] transition-colors text-sm;
}

.footer-contact {
  @apply space-y-5;
}

.contact-box {
  @apply flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200;
}

.contact-icon {
  @apply size-12 rounded-xl flex items-center justify-center text-white shrink-0;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
}

.contact-label {
  @apply text-gray-400 text-xs mb-1;
}

.contact-number {
  @apply text-gray-900 font-bold text-lg;
}

.download-section {
  @apply mt-4;
}

.download-label {
  @apply text-gray-500 text-sm mb-3;
}

.download-badges {
  @apply flex gap-3;
}

.download-badge {
  @apply h-9 rounded-lg transition-transform hover:scale-105;
}

.trust-badges {
  @apply mt-10 rounded-2xl p-6 lg:p-8 bg-gray-50 border border-gray-200;
}

.badges-row {
  @apply flex flex-wrap items-center justify-center gap-6 lg:gap-10;
}

.badge-item {
  @apply flex items-center justify-center transition-transform duration-200 hover:scale-105;
}

.badge-item img {
  @apply h-12 w-auto lg:h-14 object-contain;
}

.copyright {
  @apply py-4 text-center bg-gray-100 border-t border-gray-200;
}

.copyright p {
  @apply text-gray-500 text-sm;
}

.copyright strong {
  @apply text-gray-700 font-bold;
}
</style>
