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
          class="sticky top-[90px]" />
      </div>
    </div>
  </main>
</template>

<script setup>
const route = useRoute();
const res = await useGet({ url: `lawyers/${route.params.id}` }, "");
const data = await res.data;
const lawyer = ref(data.data);

const breadcrumbItems = computed(() => {
  const items = [
    {
      label: "وکیل وکیل",
    },
  ];

  if (lawyer.value?.province) {
    items.push({
      label: lawyer.value.province,
    });
  }

  if (lawyer.value?.city) {
    items.push({
      label: lawyer.value.city,
    });
  }

  items.push({
    label: lawyer.value?.lawyer_info?.name + " " + lawyer.value?.lawyer_info?.family,
  });

  return items;
});

const result = await useGet({
  url: `lawyer_schedules/grouped/${route.params.id}`,
  includeAuthHeader: true,
});
const sch = await result.data;
useFiltersStore().price = sch.prices;
const filterStore = useFiltersStore();
const items = ref([
  {
    id: "1",
    title: "مشاوره تلفنی",
    price: filterStore.price.phone,
    value: "phone",
    icon: "hugeicons:telephone",
    active: sch.phone.length > 0,
  },
  {
    id: "2",
    title: "مشاوره حضوری",
    price: filterStore.price.inperson,
    value: "inperson",
    icon: "hugeicons:building-06",
    active: sch.inperson.length > 0,
  },
  {
    id: "3",
    title: "چت",
    price: filterStore.price.chat,
    value: "chat",
    icon: "hugeicons:message-multiple-02",
    active: sch.chat.length > 0,
  },
]);

useSeoMeta({
  title: () => {
    const fullName =
      (lawyer.value?.lawyer_info?.name || "") +
      (lawyer.value?.lawyer_info?.family ? " " + lawyer.value?.lawyer_info?.family : "");
    return fullName.trim() ? fullName : "جزئیات وکیل";
  },
  description: () => {
    const name =
      lawyer.value?.lawyer_info?.name + " " + lawyer.value?.lawyer_info?.family;
    const city = lawyer.value?.city || lawyer.value?.province || "ایران";
    const special =
      lawyer.value?.lawyer_info?.base_lawyer?.title || "وکیل پایه یک دادگستری";
    return `رزرو وقت مشاوره با ${name}، ${special} در ${city}. مشاهده سوابق، نظرات کاربران و آدرس دفتر.`;
  },
  keywords: () => {
    const name = `${lawyer.value?.lawyer_info?.name} ${lawyer.value?.lawyer_info?.family}`;
    const city = lawyer.value?.city || lawyer.value?.province || "";
    const specialty = lawyer.value?.lawyer_info?.base_lawyer?.title || "";
    return `${name}, وکیل ${name}, ${name} وکیل, وکیل ${city}, ${specialty}, ${specialty} ${city}, رزرو وکیل ${city}, مشاوره حقوقی ${city}, شماره ${name}, تلفن ${name}, آدرس ${name}, نوبت ${name}, مشاوره با ${name}, رزرو ${name}, ${name} دادگستری, وکیل دادگستری ${city}, بهترین وکیل ${city}, وکیل متخصص ${city}`;
  },
  ogTitle: () =>
    `${lawyer.value?.lawyer_info?.name} ${lawyer.value?.lawyer_info?.family} | وکیل دادگستری`,
  ogDescription: () =>
    `درخواست مشاوره حقوقی با ${lawyer.value?.lawyer_info?.name} ${lawyer.value?.lawyer_info?.family}.`,
  ogImage: () => lawyer.value?.lawyer_info?.profile_image || "/images/default-lawyer.png",
  twitterCard: "summary_large_image",
  twitterTitle: () =>
    `${lawyer.value?.lawyer_info?.name} ${lawyer.value?.lawyer_info?.family}`,
  twitterDescription: () =>
    `رزرو وقت مشاوره با ${lawyer.value?.lawyer_info?.name} ${lawyer.value?.lawyer_info?.family}`,
  twitterImage: () =>
    lawyer.value?.lawyer_info?.profile_image || "/images/default-lawyer.png",
});

useHead({
  link: [
    {
      rel: "canonical",
      href: () => {
        const fullname =
          (lawyer.value?.lawyer_info?.name + " " + lawyer.value?.lawyer_info?.family)
            .trim()
            .replace(/\s+/g, "-") || "profile";
        return `https://vakilvakil.ir/lawyer/${route.params.id}/${fullname}`;
      },
    },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: computed(() =>
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Attorney",
          name:
            lawyer.value?.lawyer_info?.name + " " + lawyer.value?.lawyer_info?.family ||
            "وکیل",
          image: lawyer.value?.lawyer_info?.profile_image,
          telephone: lawyer.value?.phone,
          address: {
            "@type": "PostalAddress",
            addressLocality: lawyer.value?.city,
            addressRegion: lawyer.value?.province,
            addressCountry: "IR",
          },
          priceRange: "$$",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: lawyer.value?.average_rating || 5,
            reviewCount: lawyer.value?.comment_count || 1,
          },
        })
      ),
    },
  ],
});
</script>

<style scoped></style>
