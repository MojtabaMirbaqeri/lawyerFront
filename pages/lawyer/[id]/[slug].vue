<template>
  <main>
    <UICBreadCrumb :items="breadcrumbItems" />
    <div class="container gap-4 flex flex-col lg:flex-row">
      <div class="right flex flex-col gap-4">
        <info-lawyer-card
          :fullname="lawyer?.lawyer_info?.name + ' ' + lawyer?.lawyer_info?.family"
          :active="lawyer?.is_active"
          :avatar="lawyer?.lawyer_info?.profile_image"
          :education="lawyer?.lawyer_info?.base_lawyer?.title"
          :experience="lawyer?.years_of_experience"
          :rate="lawyer?.average_rating.toString().split('').splice(0, 3).join('')"
          :city="lawyer?.province"
          :spc="lawyer?.lawyer_info?.specialties" />
        <InfoLawyerChooseVisit
          :active="lawyer?.is_active"
          :items="items"
          :phone-number="lawyer?.phone"
          class="block lg:hidden" />
        <info-lawyer-tab
          :dis="lawyer?.lawyer_info?.about"
          :pos="[+lawyer?.latitude, +lawyer?.longitude]"
          :sch="sch" />
        <!-- <info-lawyer-WhyOnlineVisit /> -->
        <ClientOnly>
          <info-lawyer-comment
            :id="lawyer?.id"
            :lawyer-full-name="
              lawyer?.lawyer_info?.name + ' ' + lawyer?.lawyer_info?.family
            " />
        </ClientOnly>
      </div>
      <div class="left w-[150%] hidden lg:block">
        <InfoLawyerChooseVisit
          :active="lawyer?.is_active"
          :items="items"
          :phone-number="lawyer?.phone"
          class="sticky top-[90px]" />
      </div>
    </div>
  </main>
</template>

<script setup>
const route = useRoute();
const config = useRuntimeConfig();
const filterStore = useFiltersStore();

const res = await useGet({ url: `lawyers/${route.params.id}` }, '');
const data = await res.data;
const lawyer = ref(data.data);

const fullname = computed(
  () =>
    `${lawyer.value?.lawyer_info?.name ?? ''} ${lawyer.value?.lawyer_info?.family ?? ''}`.trim() || 'وکیل'
);

const commentHash = computed(() => route.path + '#comment');

const breadcrumbItems = computed(() => {
  const arr = [{ label: 'وکیل وکیل' }];
  if (lawyer.value?.province) arr.push({ label: lawyer.value.province });
  if (lawyer.value?.city) arr.push({ label: lawyer.value.city });
  arr.push({ label: fullname.value });
  return arr;
});

const result = await useGet({
  url: `lawyer_schedules/grouped/${route.params.id}`,
  includeAuthHeader: true,
});
const sch = await result.data;
useFiltersStore().price = sch.prices;
const items = ref([
  { id: '1', title: 'مشاوره تلفنی', price: filterStore.price.phone, value: 'phone', icon: 'hugeicons:telephone', active: sch.phone?.length > 0 },
  { id: '2', title: 'مشاوره حضوری', price: filterStore.price.inperson, value: 'inperson', icon: 'hugeicons:building-06', active: sch.inperson?.length > 0 },
  { id: '3', title: 'چت', price: filterStore.price.chat, value: 'chat', icon: 'hugeicons:message-multiple-02', active: sch.chat?.length > 0 },
]);

const rateDisplay = computed(() => {
  const v = lawyer.value?.average_rating;
  if (v == null) return '—';
  return String(v).slice(0, 3);
});

const reviewCount = computed(() => lawyer.value?.review_count ?? lawyer.value?.comment_count ?? 0);

const specialtyTitles = computed(() => {
  const sp = lawyer.value?.lawyer_info?.specialties;
  if (!Array.isArray(sp)) return [];
  return sp
    .map((id) => filterStore?.lawyerSpecialties?.[id]?.title)
    .filter(Boolean);
});

const shareContent = async () => {
  const shareData = {
    title: `${fullname.value} | وکیل دادگستری`,
    text: `رزرو مشاوره با ${fullname.value}`,
    url: typeof window !== 'undefined' ? window.location.href : '',
  };
  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share(shareData);
    } else {
      if (typeof window !== 'undefined') {
        await navigator.clipboard?.writeText(shareData.url);
        useToast().add({ title: 'لینک کپی شد.', icon: 'hugeicons:link-02', color: 'success' });
      } else {
        // fallback for SSR
      }
    }
  } catch (e) {
    if (e?.name !== 'AbortError') console.error(e);
  }
};

useSeoMeta({
  title: () => (fullname.value || 'جزئیات وکیل'),
  description: () => {
    const city = lawyer.value?.city || lawyer.value?.province || 'ایران';
    const base = lawyer.value?.lawyer_info?.base_lawyer?.title || lawyer.value?.base || 'وکیل پایه یک';
    return `رزرو وقت مشاوره با ${fullname.value}، ${base} در ${city}. مشاهده سوابق، نظرات و آدرس.`;
  },
  keywords: () => {
    const city = lawyer.value?.city || lawyer.value?.province || '';
    const base = lawyer.value?.lawyer_info?.base_lawyer?.title || lawyer.value?.base || '';
    return `${fullname.value}, وکیل ${city}, ${base}, رزرو وکیل, مشاوره حقوقی`;
  },
  ogTitle: () => `${fullname.value} | وکیل دادگستری`,
  ogDescription: () => `درخواست مشاوره حقوقی با ${fullname.value}.`,
  ogImage: () => lawyer.value?.lawyer_info?.profile_image || '/images/default-lawyer.png',
  twitterCard: 'summary_large_image',
  twitterTitle: () => fullname.value,
  twitterDescription: () => `رزرو وقت مشاوره با ${fullname.value}`,
  twitterImage: () => lawyer.value?.lawyer_info?.profile_image || '/images/default-lawyer.png',
});

useHead({
  link: [
    {
      rel: 'canonical',
      href: () => {
        const slug = fullname.value.trim().replace(/\s+/g, '-') || 'profile';
        return `https://vakilvakil.ir/lawyer/${route.params.id}/${slug}`;
      },
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Attorney',
          name: fullname.value || 'وکیل',
          image: lawyer.value?.lawyer_info?.profile_image,
          address: {
            '@type': 'PostalAddress',
            addressLocality: lawyer.value?.city,
            addressRegion: lawyer.value?.province,
            addressCountry: 'IR',
          },
          priceRange: '$$',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: lawyer.value?.average_rating || 5,
            reviewCount: lawyer.value?.review_count || lawyer.value?.comment_count || 1,
          },
        })
      ),
    },
  ],
});
</script>

