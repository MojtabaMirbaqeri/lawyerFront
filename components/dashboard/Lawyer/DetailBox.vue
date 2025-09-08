<template>
  <div class="p-4 md:p-6">
    <Suspense>
      <!-- #default slot: Main content to display once async setup is complete -->
      <template #default>
        <div>
          <!-- Error State: Show an error message if the fetch fails -->
          <div v-if="error" class="text-center text-red-500">
            خطا در دریافت اطلاعات. لطفا دوباره تلاش کنید.
          </div>

          <!-- Loaded State: Display the stats cards -->
          <div v-else-if="stats" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div
              v-for="item in statItems"
              :key="item.title"
              :class="[
                'relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1',
                item.bgColor,
                item.textColor
              ]"
            >
              <div class="flex items-start justify-between">
                <div class="flex flex-col">
                  <span class="text-sm font-medium opacity-80">{{ item.title }}</span>
                  <span class="mt-2 text-3xl font-bold">
                    {{ formatValue(item.value, item.unit) }}
                  </span>
                </div>
                <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                   <UIcon :name="item.icon" class="size-6!"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- #fallback slot: Loading state with skeletons -->
      <template #fallback>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div v-for="i in 8" :key="i" class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <div class="flex items-start justify-between">
              <div class="flex flex-col space-y-3">
                <USkeleton class="h-4 w-[150px]" />
                <USkeleton class="h-8 w-[100px]" />
              </div>
              <USkeleton class="h-12 w-12 rounded-lg" />
            </div>
          </div>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// useAsyncData fetches and holds the data.
// The `stats` variable will automatically hold the return value of the async function.
const { data: stats, error } = await useAsyncData(
  'lawyerDashboard',
  async () => {
    try {
      const response = await useGet({
        url: 'lawyer/dashboard',
        includeAuthHeader: true,
      });
      // Return only the inner `data` object
      return response.data.data;
    } catch (err) {
      console.error("Failed to fetch lawyer dashboard stats:", err);
      // Re-throw the error to be caught by useAsyncData's error state
      throw err;
    }
  }
);

// This computed property automatically updates when `stats` changes.
const statItems = computed(() => {
  // If data is not yet loaded or an error occurred, return an empty array.
  if (!stats.value) return [];

  return [
        {
      title: 'مشاوره‌های انجام شده',
      value: stats.value.appointments?.total_completed,
      unit: 'نوبت',
      icon: 'i-solar-check-read-linear',
      bgColor: 'bg-green-500! dark:bg-green-600!',
      textColor: 'text-white'
    },
    {
      title: 'نوبت‌های در حال انتظار',
      value: stats.value.appointments?.total_pending,
      unit: 'نوبت',
      icon: 'i-solar-clock-circle-linear',
      bgColor: 'bg-yellow-500! dark:bg-yellow-600!',
      textColor: 'text-white'
    },
    {
      title: 'کل درآمد',
      value: stats.value.income?.total_earned,
      unit: 'تومان',
      icon: 'i-solar-wallet-money-linear',
      bgColor: 'bg-blue-500! dark:bg-blue-600!',
      textColor: 'text-white'
    },
    {
      title: 'دیدگاه‌های بی‌پاسخ',
      value: stats.value.reviews?.unanswered_reviews,
      unit: 'دیدگاه',
      icon: 'i-solar-chat-unread-linear',
      bgColor: 'bg-orange-500! dark:bg-orange-600!',
      textColor: 'text-white'
    },
    {
      title: 'موجودی فعلی',
      value: stats.value.income?.current_balance,
      unit: 'تومان',
      icon: 'i-solar-safe-2-linear',
      bgColor: 'bg-indigo-500! dark:bg-indigo-600!',
      textColor: 'text-white'
    },
    {
      title: 'میانگین امتیازات',
      value: stats.value.reviews?.average_rating,
      unit: '', // No specific unit
      icon: 'i-solar-star-fall-minimalistic-linear',
      bgColor: 'bg-purple-500! dark:bg-purple-600!',
      textColor: 'text-white'
    },
    {
      title: 'نوبت‌های لغو شده',
      value: stats.value.appointments?.total_cancelled,
      unit: 'نوبت',
      icon: 'i-solar-close-circle-linear',
      bgColor: 'bg-red-500! dark:bg-red-600!',
      textColor: 'text-white'
    },
    {
      title: 'درآمد این ماه',
      value: stats.value.income?.this_month_earned,
      unit: 'تومان',
      icon: 'i-solar-calendar-mark-linear',
      bgColor: 'bg-teal-500! dark:bg-teal-600!',
      textColor: 'text-white'
    },
  ];
});

/**
 * A function to format numerical values.
 * @param {number} value - The numerical value.
 * @param {string} unit - The unit (e.g., 'تومان').
 * @returns {string} - The formatted value.
 */
function formatValue(value, unit) {
  if (value === undefined || value === null) {
    return '۰'; // Display '۰' instead of 'N/A' for a cleaner look
  }
  const formattedNumber = new Intl.NumberFormat('fa-IR').format(value);
  return unit ? `${formattedNumber} ${unit}` : formattedNumber;
}
</script>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
