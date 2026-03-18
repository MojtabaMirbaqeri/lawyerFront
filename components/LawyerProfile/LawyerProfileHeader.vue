<template>
  <section class="relative overflow-hidden border-b border-slate-200/60">
    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/.12),transparent)]" />
    <div class="container relative py-8 md:py-10">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div class="relative shrink-0">
            <div
              class="ring-4 ring-white shadow-xl size-24 sm:size-28 md:size-32 rounded-full overflow-hidden bg-slate-100"
              :class="{ 'ring-emerald-400/40': lawyer?.is_active }">
              <UAvatar class="size-full object-cover" :src="avatarUrl" :alt="fullName" />
            </div>
            <div
              v-if="isVerified"
              class="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-[90px] rounded-full bg-primary px-3 py-1 text-center text-xs font-bold text-white">
              تایید شده
            </div>
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-primary tracking-tight">
              {{ fullName }}
            </h1>
            <p class="text-primary font-semibold">
              {{ titleLine }}
            </p>
            <p
              v-if="locationLine"
              class="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <UIcon name="material-symbols:location-on-rounded" class="size-4" />
              {{ locationLine }}
            </p>
            <!-- امتیاز، سابقه فعالیت، دیدگاه، محل فعالیت — کنار نام وکیل -->
            <div class="mt-4 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
              <div class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <UIcon name="solar:star-bold" class="size-5 text-amber-500 shrink-0" />
                <div>
                  <p class="text-xs text-slate-500">امتیاز</p>
                  <p class="text-sm font-semibold text-slate-800">{{ rateDisplay }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <UIcon name="solar:calendar-bold" class="size-5 text-slate-500 shrink-0" />
                <div>
                  <p class="text-xs text-slate-500">سابقه فعالیت</p>
                  <p class="text-sm font-semibold text-slate-800">{{ years }} سال</p>
                </div>
              </div>
              <div class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <UIcon name="solar:chat-round-dots-bold" class="size-5 text-emerald-500 shrink-0" />
                <div>
                  <p class="text-xs text-slate-500">دیدگاه</p>
                  <p class="text-sm font-semibold text-slate-800">{{ reviewCount }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <UIcon name="solar:verified-check-bold" class="size-5 text-primary shrink-0" />
                <div>
                  <p class="text-xs text-slate-500">وضعیت پروفایل</p>
                  <p class="text-sm font-semibold text-slate-800">{{ isVerified ? 'تایید شده' : 'تکمیل‌شده توسط وکیل' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 lg:justify-end">
          <UICMainBtn @click="$emit('book')">رزرو مشاوره</UICMainBtn>
          <UICSecondaryBtn v-if="showQuestionsButton" @click="$emit('questions')">
            مشاهده پرسش‌ها
          </UICSecondaryBtn>
          <UICSecondaryBtn @click="$emit('share')">اشتراک‌گذاری</UICSecondaryBtn>
        </div>
      </div>

      <div v-if="specialties.length" class="mt-5 flex flex-wrap gap-2">
        <span
          v-for="specialty in specialties"
          :key="specialty"
          class="inline-flex items-center rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
          {{ specialty }}
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  lawyer: { type: Object, required: true },
  fullName: { type: String, required: true },
  specialties: { type: Array, default: () => [] },
  isVerified: { type: Boolean, default: false },
  avatarUrl: { type: String, required: true },
  rateDisplay: { type: String, default: '—' },
  reviewCount: { type: Number, default: 0 },
  years: { type: Number, default: 0 },
});

defineEmits(["book", "share", "questions"]);

const titleLine = computed(() => {
  const base = props.lawyer?.lawyer_info?.base_lawyer?.title || props.lawyer?.base || "وکیل";
  // const city = [props.lawyer?.city, props.lawyer?.province].filter(Boolean).join("، ");
  // return city ? `${base} | ${city}` : base;
  return base;
});

const locationLine = computed(() =>
  [props.lawyer?.city, props.lawyer?.province].filter(Boolean).join("، "),
);

const showQuestionsButton = computed(() => false);
</script>
