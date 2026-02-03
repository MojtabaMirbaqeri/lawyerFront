<template>
  <main class="min-h-screen bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50">
    <!-- Breadcrumb -->
    <section class="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
      <div class="container">
        <ClientOnly>
          <UICBreadCrumb :items="breadcrumbItems" />
          <template #fallback>
            <nav aria-label="breadcrumb" class="p-1.5 text-sm font-medium text-gray-500">
              وکیل وکیل
            </nav>
          </template>
        </ClientOnly>
      </div>
    </section>

    <!-- Hero -->
    <section class="relative overflow-hidden border-b border-slate-200/60">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/.12),transparent)]" />
      <div class="absolute inset-0 bg-[linear-gradient(165deg,transparent_50%,hsl(var(--primary)/.03)_100%)]" />
      <div class="container relative py-8 md:py-10 lg:py-12">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div class="relative shrink-0">
              <div
                class="ring-4 ring-white shadow-xl size-24 sm:size-28 md:size-32 rounded-full overflow-hidden bg-slate-100"
                :class="{ 'ring-emerald-400/40': lawyer?.is_active }">
                <UAvatar
                  class="size-full object-cover"
                  :src="
                    lawyer?.lawyer_info?.profile_image
                      ? config.public.imageBase + lawyer.lawyer_info.profile_image
                      : '/images/nullavatar.png'
                  "
                  :alt="fullname" />
              </div>
              <div
                v-if="lawyer?.is_active"
                class="absolute -bottom-1 -end-1 flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                <span class="size-1.5 rounded-full bg-white animate-pulse" />
                فعال
              </div>
            </div>
            <div class="flex flex-col gap-1 min-w-0">
              <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-primary tracking-tight">
                {{ fullname }}
              </h1>
              <p class="text-primary font-semibold">
                {{ lawyer?.lawyer_info?.base_lawyer?.title || lawyer?.base || 'وکیل پایه یک دادگستری' }}
              </p>
              <div class="flex flex-wrap items-center gap-2 mt-1 text-slate-500">
                <span v-if="lawyer?.province || lawyer?.city" class="flex items-center gap-1">
                  <UIcon name="material-symbols:location-on-rounded" class="size-4" />
                  {{ [lawyer?.city, lawyer?.province].filter(Boolean).join('، ') || '—' }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 lg:justify-end">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              @click="navigateTo(commentHash)">
              <UIcon name="hugeicons:message-multiple-02" class="size-5" />
              دیدگاه‌ها
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              @click="shareContent">
              <UIcon name="hugeicons:share-08" class="size-5" />
              اشتراک‌گذاری
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div class="rounded-xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
            <div class="flex items-center gap-3">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <UIcon name="ic:round-star" class="size-5" />
              </div>
              <div>
                <p class="text-lg font-bold text-slate-800">{{ rateDisplay }}</p>
                <p class="text-xs text-slate-500">امتیاز</p>
              </div>
            </div>
          </div>
          <div class="rounded-xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
            <div class="flex items-center gap-3">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e8edf5] text-primary">
                <UIcon name="hugeicons:calendar-03" class="size-5" />
              </div>
              <div>
                <p class="text-lg font-bold text-slate-800">{{ lawyer?.years_of_experience ?? 0 }} سال</p>
                <p class="text-xs text-slate-500">سابقه فعالیت</p>
              </div>
            </div>
          </div>
          <div class="rounded-xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
            <div class="flex items-center gap-3">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <UIcon name="hugeicons:message-01" class="size-5" />
              </div>
              <div>
                <p class="text-lg font-bold text-slate-800">{{ reviewCount }}</p>
                <p class="text-xs text-slate-500">دیدگاه</p>
              </div>
            </div>
          </div>
          <div class="rounded-xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm col-span-2 sm:col-span-1">
            <div class="flex items-center gap-3">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <UIcon name="material-symbols:location-on-rounded" class="size-5" />
              </div>
              <div class="min-w-0">
                <p class="text-base font-bold text-slate-800 truncate">{{ lawyer?.city || lawyer?.province || '—' }}</p>
                <p class="text-xs text-slate-500">محل فعالیت</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Specialties -->
        <div v-if="specialtyTitles.length" class="mt-6">
          <h3 class="mb-2 text-sm font-semibold text-slate-600">تخصص‌ها</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="s in specialtyTitles"
              :key="s"
              class="inline-flex items-center rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
              {{ s }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Main content: 2 columns -->
    <div class="container py-6 lg:py-8">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <!-- Left: Main -->
        <div class="flex-1 min-w-0 space-y-6">
          <!-- Visit types: mobile-only CTA preview -->
          <InfoLawyerChooseVisit
            :active="lawyer?.is_active"
            :items="items"
            class="block lg:hidden" />

          <!-- Section: About / Location / Schedule -->
          <section class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div class="border-b border-slate-200/80 bg-slate-50/50 px-4 py-3">
              <h2 class="flex items-center gap-2 text-lg font-bold text-slate-800">
                <span class="h-1 w-1 rounded-full bg-primary" />
                اطلاعات و زمان‌بندی
              </h2>
            </div>
            <info-lawyer-tab
              :dis="lawyer?.lawyer_info?.about"
              :pos="[+lawyer?.latitude, +lawyer?.longitude]"
              :sch="sch" />
          </section>

          <!-- راهنمای رزرو -->
          <section class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div class="border-b border-slate-200/80 bg-slate-50/50 px-4 py-3">
              <h2 class="flex items-center gap-2 text-lg font-bold text-slate-800">
                <span class="h-1 w-1 rounded-full bg-primary" />
                راهنمای رزرو مشاوره در ۳ گام
              </h2>
            </div>
            <div class="p-4 sm:p-5">
              <div class="grid gap-4 sm:grid-cols-3">
                <div class="flex gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">۱</span>
                  <div>
                    <p class="font-semibold text-slate-800">انتخاب نوع مشاوره</p>
                    <p class="mt-0.5 text-sm text-slate-500">تلفنی، حضوری یا چت را از باکس سمت چپ انتخاب کنید.</p>
                  </div>
                </div>
                <div class="flex gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">۲</span>
                  <div>
                    <p class="font-semibold text-slate-800">انتخاب زمان</p>
                    <p class="mt-0.5 text-sm text-slate-500">روز و ساعت دلخواه را در تب «زمان مشاوره» مشخص کنید.</p>
                  </div>
                </div>
                <div class="flex gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">۳</span>
                  <div>
                    <p class="font-semibold text-slate-800">پرداخت و تأیید</p>
                    <p class="mt-0.5 text-sm text-slate-500">پس از پرداخت آنلاین، نوبت شما ثبت می‌شود.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- سوالات متداول -->
          <section class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div class="border-b border-slate-200/80 bg-slate-50/50 px-4 py-3">
              <h2 class="flex items-center gap-2 text-lg font-bold text-slate-800">
                <span class="h-1 w-1 rounded-full bg-primary" />
                سوالات متداول
              </h2>
            </div>
            <div class="divide-y divide-slate-100 p-4 sm:p-5">
              <div>
                <p class="font-semibold text-slate-800">چگونه می‌توانم با وکیل مشاوره بگیرم؟</p>
                <p class="mt-1 text-sm text-slate-600">با انتخاب نوع مشاوره (تلفنی، حضوری یا چت) و سپس زمان مناسب، رزرو را تکمیل و هزینه را آنلاین پرداخت کنید.</p>
              </div>
              <div class="pt-4">
                <p class="font-semibold text-slate-800">آیا می‌توانم نظر خود را درباره وکیل ثبت کنم؟</p>
                <p class="mt-1 text-sm text-slate-600">بله. پس از استفاده از خدمات، در بخش «امتیاز و دیدگاه کاربران» می‌توانید نظر و امتیاز خود را ثبت کنید.</p>
              </div>
            </div>
          </section>

          <!-- Comments -->
          <ClientOnly>
            <section id="comment" class="scroll-mt-24">
              <info-lawyer-comment
                :id="lawyer?.id"
                :lawyer-full-name="fullname" />
            </section>
          </ClientOnly>
        </div>

        <!-- Right: Sticky sidebar -->
        <aside class="w-full shrink-0 lg:w-[360px] xl:w-[380px]">
          <div class="lg:sticky lg:top-24 space-y-6">
            <InfoLawyerChooseVisit
              :active="lawyer?.is_active"
              :items="items"
              class="hidden lg:block" />

            <!-- قیمت‌گذاری سریع -->
            <section class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div class="border-b border-slate-200/80 bg-slate-50/50 px-4 py-3">
                <h2 class="flex items-center gap-2 text-base font-bold text-slate-800">
                  <span class="h-1 w-1 rounded-full bg-primary" />
                  قیمت مشاوره
                </h2>
              </div>
              <div class="divide-y divide-slate-100 p-4">
                <div
                  v-for="it in items"
                  :key="it.id"
                  class="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  :class="{ 'opacity-50': !it.active }">
                  <div class="flex items-center gap-3">
                    <UIcon :name="it.icon" class="size-5 text-slate-500" />
                    <span class="text-sm font-medium" :class="it.active ? 'text-slate-800' : 'text-slate-400'">{{ it.title }}</span>
                  </div>
                  <span class="text-sm font-bold text-slate-700">{{ it.price }} <span class="text-slate-400 font-normal">تومان</span></span>
                </div>
              </div>
            </section>

            <!-- اعتماد و اطمینان -->
            <div class="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
              <div class="flex items-start gap-3">
                <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <UIcon name="hugeicons:shield-check" class="size-5" />
                </div>
                <div>
                  <p class="font-semibold text-slate-800">رزرو امن در سامانه وکیل وکیل</p>
                  <p class="mt-1 text-xs text-slate-500">پرداخت آنلاین و امن؛ پشتیبانی در تمام مراحل رزرو.</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </main>
</template>

<script setup>
import provincesData from '~/public/provinces.json';

const route = useRoute();
const config = useRuntimeConfig();
const filterStore = useFiltersStore();

const res = await useGet({ url: `lawyers/${route.params.id}` }, '');
const data = await res.data;
const lawyer = ref(data?.data ?? {});

const fullname = computed(
  () =>
    `${lawyer.value?.lawyer_info?.name ?? ''} ${lawyer.value?.lawyer_info?.family ?? ''}`.trim() || 'وکیل'
);

const commentHash = computed(() => route.path + '#comment');

const breadcrumbItems = computed(() => {
  const base = [{ label: 'وکیل وکیل', to: '/' }];
  const info = lawyer.value;
  if (!info || typeof info !== 'object') return base;
  const provinceName = info.province;
  const provinceEnName = provinceName
    ? (provincesData.find((p) => p.name === provinceName)?.en_name ?? null)
    : null;
  if (provinceName && provinceEnName) {
    base.push({ label: provinceName, to: `/provinces/${provinceEnName}` });
  }
  if (info.city) {
    base.push({
      label: info.city,
      to: provinceEnName ? `/provinces/${provinceEnName}` : '/lawyers',
    });
  }
  base.push({ label: fullname.value });
  return base;
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

