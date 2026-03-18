<template>
  <main class="relative min-h-screen bg-linear-to-b from-slate-50/80 via-white to-slate-50/50">
    <Transition name="fade">
      <div
        v-if="!lawyer?.is_active"
        class="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md">
        <div class="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-xl">
          <p class="text-xl font-bold text-slate-700">وکیل موقتا در دسترس نمی‌باشد</p>
          <p class="mt-2 text-sm text-slate-500">لطفا در زمان دیگری مراجعه کنید.</p>
        </div>
      </div>
    </Transition>

    <section class="border-b border-slate-200/80 bg-white/90">
      <div class="container">
        <UICBreadCrumb :items="breadcrumbItems" />
      </div>
    </section>

    <LawyerProfileHeader
      :lawyer="lawyer"
      :full-name="fullname"
      :specialties="specialtyTitles"
      :avatar-url="avatarUrl"
      :is-verified="isVerified"
      :rate-display="rateDisplay"
      :review-count="reviewCount"
      :publication-count="publications.length"
      @book="scrollToBooking"
      @share="shareContent" />

    <div class="container py-6 lg:py-8">
      <div class="mb-4 flex flex-wrap gap-2">
        <a
          v-for="anchor in visibleAnchors"
          :key="anchor.id"
          :href="`#${anchor.id}`"
          class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:border-primary/40 hover:text-primary">
          {{ anchor.title }}
        </a>
      </div>

      <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div class="flex-1 min-w-0 space-y-6 pb-20 lg:pb-0">
          <LawyerProfileSparseHintCard :show="isSparseProfile" />
          <LawyerProfileAboutSection :about="lawyer?.lawyer_info?.about" />
          <LawyerProfileServicesSection
            :specialties="specialtyTitles"
            :services="serviceTitles" />
          <LawyerProfileEducationSection :items="educations" />
          <LawyerProfileExperienceSection :items="workExperiences" />
          <LawyerProfileAwardsSection :items="awards" />
          <LawyerProfileCertificationsSection :items="certifications" />
          <LawyerProfilePublicationsSection :items="publications" />
          <LawyerProfileContactSection :links="lawyer?.links || {}" />
          <LawyerProfileQaPreviewSection :items="[]" />
          <LawyerProfileBookingGuide />
          <LawyerProfileFaqSection />
          <LawyerProfileReviewsSection
            v-if="lawyer?.id"
            :lawyer-id="lawyer.id"
            :lawyer-full-name="fullname"
            :initial-reviews="initialReviews"
            :initial-reviews-last-page="initialReviewsLastPage" />
        </div>

        <aside class="w-full shrink-0 lg:w-[360px] xl:w-[380px]">
          <div class="lg:sticky lg:top-24 space-y-6">
            <LawyerProfileStickyBookingCard
              v-if="lawyer?.is_active"
              :lawyer="lawyer"
              :full-name="fullname"
              :items="items"
              :has-working-hours="hasWorkingHours"
              class="hidden lg:block" />
            <LawyerProfileChooseGuide />
          </div>
        </aside>
      </div>
    </div>

    <div
      v-if="lawyer?.is_active"
      class="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 p-3 lg:hidden">
      <div
        v-if="!hasWorkingHours"
        class="rounded-xl border border-amber-200 bg-amber-50/90 py-3 text-center">
        <p class="font-medium text-amber-800">رزرو وکیل غیرفعال هست</p>
        <p class="mt-0.5 text-xs text-amber-700">این وکیل هنوز ساعت کاری ثبت نکرده است.</p>
      </div>
      <template v-else>
        <UICMainBtn class="w-full" @click="scrollToBooking">رزرو مشاوره</UICMainBtn>
        <p class="mt-1 text-center text-[11px] text-slate-500">پاسخ‌گویی توسط وکیل</p>
      </template>
    </div>
  </main>
</template>

<script setup>
import provincesData from "~/public/provinces.json";
import LawyerProfileHeader from "~/components/LawyerProfile/LawyerProfileHeader.vue";
import LawyerProfileStickyBookingCard from "~/components/LawyerProfile/LawyerProfileStickyBookingCard.vue";
import LawyerProfileAboutSection from "~/components/LawyerProfile/LawyerProfileAboutSection.vue";
import LawyerProfileEducationSection from "~/components/LawyerProfile/LawyerProfileEducationSection.vue";
import LawyerProfileExperienceSection from "~/components/LawyerProfile/LawyerProfileExperienceSection.vue";
import LawyerProfileAwardsSection from "~/components/LawyerProfile/LawyerProfileAwardsSection.vue";
import LawyerProfileCertificationsSection from "~/components/LawyerProfile/LawyerProfileCertificationsSection.vue";
import LawyerProfileServicesSection from "~/components/LawyerProfile/LawyerProfileServicesSection.vue";
import LawyerProfilePublicationsSection from "~/components/LawyerProfile/LawyerProfilePublicationsSection.vue";
import LawyerProfileContactSection from "~/components/LawyerProfile/LawyerProfileContactSection.vue";
import LawyerProfileQaPreviewSection from "~/components/LawyerProfile/LawyerProfileQaPreviewSection.vue";
import LawyerProfileBookingGuide from "~/components/LawyerProfile/LawyerProfileBookingGuide.vue";
import LawyerProfileFaqSection from "~/components/LawyerProfile/LawyerProfileFaqSection.vue";
import LawyerProfileReviewsSection from "~/components/LawyerProfile/LawyerProfileReviewsSection.vue";
import LawyerProfileSparseHintCard from "~/components/LawyerProfile/LawyerProfileSparseHintCard.vue";
import LawyerProfileChooseGuide from "~/components/LawyerProfile/LawyerProfileChooseGuide.vue";

const route = useRoute();
const config = useRuntimeConfig();
const filterStore = useFiltersStore();

const profileRes = await useGet({ url: `lawyers/${route.params.id}`, includeAuthHeader: true });
const profileData = await profileRes.data;
const lawyer = ref(profileData?.data ?? {});
useGlobalStore().lawyerInfo = lawyer;

const reviewsRes = await useGet({ url: `lawyers/${route.params.id}/reviews`, includeAuthHeader: true });
const reviewsPayload = await reviewsRes.data;
const initialReviews = reviewsPayload?.data ?? [];
const initialReviewsLastPage = reviewsPayload?.meta?.last_page ?? 1;

const schedulesRes = await useGet({ url: `lawyer_schedules/grouped/${route.params.id}`, includeAuthHeader: true });
const sch = await schedulesRes.data;
filterStore.price = sch.prices;

const publicationsRes = await useGet({ url: `lawyers/${route.params.id}/publications`, includeAuthHeader: true });
const publicationsPayload = await publicationsRes.data;

const fullname = computed(
  () =>
    `${lawyer.value?.lawyer_info?.name ?? ""} ${lawyer.value?.lawyer_info?.family ?? ""}`.trim() ||
    "وکیل",
);

const avatarUrl = computed(() =>
  lawyer.value?.lawyer_info?.profile_image
    ? config.public.imageBase + lawyer.value.lawyer_info.profile_image
    : "/images/nullavatar.png",
);

const isVerified = computed(() => lawyer.value?.site_verified === true);
const rateDisplay = computed(() => {
  const value = lawyer.value?.average_rating;
  return value == null ? "—" : String(value).slice(0, 3);
});
const reviewCount = computed(() => lawyer.value?.review_count ?? 0);

const specialtyTitles = computed(() => {
  if (Array.isArray(lawyer.value?.specialties_titles) && lawyer.value.specialties_titles.length) {
    return lawyer.value.specialties_titles.filter(Boolean);
  }
  const ids = lawyer.value?.lawyer_info?.specialties || [];
  return ids
    .map((id) => filterStore?.lawyerSpecialties?.find((item) => item.id == id)?.title)
    .filter(Boolean);
});

const serviceTitles = computed(() => {
  const services = lawyer.value?.lawyer_info?.services || [];
  return services
    .map((id) => filterStore?.lawyerServices?.find((item) => item.id == id)?.title || id)
    .filter(Boolean);
});

const educations = computed(() => lawyer.value?.educations || []);
const workExperiences = computed(() => lawyer.value?.work_experiences || []);
const awards = computed(() => lawyer.value?.awards || []);
const certifications = computed(() => lawyer.value?.lawyer_info?.certifications || []);
const publications = computed(() => publicationsPayload?.data || lawyer.value?.publications || []);

const hasWorkingHours = computed(() => !!(sch?.phone?.length || sch?.inperson?.length || sch?.chat?.length));

const items = computed(() => [
  {
    id: "phone",
    title: "مشاوره تلفنی",
    price: filterStore.price.phone,
    value: "phone",
    icon: "hugeicons:telephone",
    active: sch.phone?.length > 0,
  },
  {
    id: "inperson",
    title: "مشاوره حضوری",
    price: filterStore.price.inperson,
    value: "inperson",
    icon: "hugeicons:building-06",
    active: sch.inperson?.length > 0,
  },
  {
    id: "chat",
    title: "چت",
    price: filterStore.price.chat,
    value: "chat",
    icon: "hugeicons:message-multiple-02",
    active: sch.chat?.length > 0,
  },
]);

const isSparseProfile = computed(
  () =>
    !lawyer.value?.lawyer_info?.about &&
    !specialtyTitles.value.length &&
    !serviceTitles.value.length &&
    !educations.value.length &&
    !workExperiences.value.length &&
    !awards.value.length &&
    !certifications.value.length,
);

const visibleAnchors = computed(() => {
  const anchors = [
    { id: "about", title: "معرفی" },
    { id: "services", title: "تخصص‌ها" },
    { id: "education", title: "تحصیلات", show: educations.value.length },
    { id: "experience", title: "سوابق کاری", show: workExperiences.value.length },
    { id: "awards", title: "افتخارات", show: awards.value.length },
    { id: "certifications", title: "گواهی‌ها", show: certifications.value.length },
    { id: "publications", title: "مقالات", show: publications.value.length },
    { id: "booking-guide", title: "راهنمای رزرو" },
    { id: "faq", title: "سوالات متداول" },
    { id: "reviews", title: "نظرات" },
  ];
  return anchors.filter((anchor) => anchor.show === undefined || anchor.show);
});

const breadcrumbItems = computed(() => {
  const items = [{ label: "وکیل وکیل", to: "/" }];
  const provinceName = lawyer.value?.province;
  const provinceEnName = provinceName
    ? (provincesData.find((p) => p.name === provinceName)?.en_name ?? null)
    : null;
  if (provinceName && provinceEnName) {
    items.push({ label: provinceName, to: `/provinces/${provinceEnName}` });
  }
  if (lawyer.value?.city) {
    items.push({ label: lawyer.value.city, to: provinceEnName ? `/provinces/${provinceEnName}` : "/lawyers" });
  }
  items.push({ label: fullname.value });
  return items;
});

const scrollToBooking = () => {
  if (process.client) {
    document.getElementById("booking-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const shareContent = async () => {
  const shareData = {
    title: `${fullname.value} | VakilVakil`,
    text: `رزرو مشاوره با ${fullname.value}`,
    url: process.client ? window.location.href : "",
  };
  try {
    if (process.client && navigator.share) {
      await navigator.share(shareData);
      return;
    }
    if (process.client) {
      await navigator.clipboard?.writeText(shareData.url);
      useToast().add({ title: "لینک کپی شد.", color: "success" });
    }
  } catch (error) {
    if (error?.name !== "AbortError") console.error(error);
  }
};

useSeoMeta({
  title: () => `وکیل ${fullname.value} | VakilVakil`,
  description: () => {
    const city = [lawyer.value?.city, lawyer.value?.province].filter(Boolean).join("، ");
    const specialties = specialtyTitles.value.slice(0, 3).join("، ");
    const about = (lawyer.value?.lawyer_info?.about || "").slice(0, 120);
    return [about, specialties, city].filter(Boolean).join(" | ");
  },
  ogTitle: () => `وکیل ${fullname.value} | VakilVakil`,
  ogDescription: () => `رزرو آنلاین و سریع مشاوره با ${fullname.value}`,
  ogImage: () => lawyer.value?.lawyer_info?.profile_image || "/images/default-lawyer.png",
});

useHead({
  link: [
    {
      rel: "canonical",
      href: () => {
        const slug = fullname.value.trim().replace(/\s+/g, "-") || "profile";
        return `https://vakilvakil.com/lawyer/${route.params.id}/${slug}`;
      },
    },
  ],
});
</script>
