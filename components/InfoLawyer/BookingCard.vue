<template>
  <section
    class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
    <div class="border-b border-slate-200/80 bg-slate-50/50 px-4 py-3">
      <h2 class="flex items-center gap-2 text-lg font-bold text-slate-800">
        <UIcon name="hugeicons:clock" class="size-5 text-[#0EA5E9]" />
        رزرو نوبت
      </h2>
    </div>

    <div class="space-y-5 p-4 pb-20 lg:pb-5">
      <!-- مدت زمان مشاوره -->
      <div class="flex flex-col gap-2">
        <span class="text-sm font-medium text-slate-600">مدت زمان مشاوره</span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="d in durationOptions"
            :key="d.id"
            type="button"
            :class="[
              'rounded-xl border px-4 py-2.5 text-sm font-medium transition',
              duration === d.id
                ? 'border-[#0EA5E9] bg-white text-[#0EA5E9]'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
            ]"
            @click="$emit('update:duration', d.id)">
            {{ d.title }}
          </button>
        </div>
      </div>

      <!-- نوع مشاوره -->
      <div class="flex flex-col gap-2">
        <span class="text-sm font-medium text-slate-600">نوع مشاوره</span>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="item in items"
            :key="item.id"
            type="button"
            :disabled="item.active === false"
            :class="[
              'flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition',
              item.active === false &&
                'cursor-not-allowed opacity-60 pointer-events-none border-slate-200 bg-slate-50 text-slate-400',
              item.active !== false &&
                (activeVisitType === item.value
                  ? 'border-[#0EA5E9] bg-[#0EA5E9]/10 text-[#0EA5E9]'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'),
            ]"
            @click="item.active !== false && $emit('update:activeVisitType', item.value)">
            <UIcon
              :name="item.icon"
              class="size-6"
              :class="
                item.active === false
                  ? 'text-slate-300'
                  : activeVisitType === item.value
                    ? 'text-[#0EA5E9]'
                    : 'text-slate-400'
              " />
            <span class="text-xs font-medium">{{ item.title }}</span>
            <span class="text-xs text-slate-500">{{ item.price }} تومان</span>
          </button>
        </div>
      </div>

      <!-- انتخاب روز -->
      <div v-if="scheduleLoaded" class="flex flex-col gap-2">
        <span class="text-sm font-medium text-slate-600">انتخاب روز</span>
        <div
          class="flex gap-2 overflow-x-auto pb-1 scrollbar-thin select-none"
          :class="daysDrag.isDragging ? 'cursor-grabbing' : 'cursor-grab'"
          @mousedown="daysDrag.onMouseDown"
          @click.capture="daysDrag.onContainerClick">
          <button
            v-for="day in dateButtons"
            :key="day.id"
            type="button"
            :disabled="day.disabled || day.nonworking"
            :class="[
              'shrink-0 rounded-xl border px-3 py-2.5 text-center text-sm transition min-w-[90px]',
              (day.disabled || day.nonworking) &&
                'cursor-not-allowed opacity-60 pointer-events-none',
              activeDay === day.id
                ? 'border-[#0EA5E9] bg-white text-[#0EA5E9]'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
            ]"
            @click="!(day.disabled || day.nonworking) && $emit('update:activeDay', day.id)">
            <span class="block font-medium">{{ day.title }}</span>
            <span class="block text-xs text-slate-500">{{ day.dayMonth }}</span>
          </button>
        </div>
      </div>
      <div v-else-if="scheduleUnavailable && activeVisitType" class="flex flex-col gap-2">
        <span class="text-sm font-medium text-slate-600">انتخاب روز</span>
        <p class="text-sm text-slate-500">برای این نوع مشاوره برنامه‌ای تعریف نشده است.</p>
      </div>
      <div v-else-if="activeVisitType" class="flex flex-col gap-2">
        <span class="text-sm font-medium text-slate-600">انتخاب روز</span>
        <p class="text-sm text-slate-500">در حال بارگذاری...</p>
      </div>

      <!-- ساعت مشاوره -->
      <div v-if="scheduleLoaded && timeSlots.length" class="flex flex-col gap-2">
        <span class="text-sm font-medium text-slate-600">ساعت مشاوره</span>
        <div
          class="flex gap-2 overflow-x-auto pb-1 scrollbar-thin select-none"
          :class="timesDrag.isDragging ? 'cursor-grabbing' : 'cursor-grab'"
          @mousedown="timesDrag.onMouseDown"
          @click.capture="timesDrag.onContainerClick">
          <button
            v-for="slot in timeSlots"
            :key="slot.id"
            type="button"
            :disabled="slot.disabled"
            :class="[
              'flex shrink-0 min-w-[72px] flex-col items-center justify-center gap-0.5 rounded-xl border px-3 py-2.5 text-center transition',
              slot.disabled && 'cursor-not-allowed opacity-50 pointer-events-none',
              defVisitTime === slot.id
                ? 'border-[#0EA5E9] bg-white text-[#0EA5E9]'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
            ]"
            @click="!slot.disabled && $emit('update:defVisitTime', slot.id)">
            <span class="text-sm font-bold">{{ slot.startTime }}</span>
            <span class="text-xs font-bold">تا</span>
            <span class="text-sm font-bold">{{ slot.endTime }}</span>
          </button>
        </div>
      </div>
      <div v-else-if="scheduleLoaded && activeDay" class="flex flex-col gap-2">
        <span class="text-sm font-medium text-slate-600">ساعت مشاوره</span>
        <p class="text-sm text-slate-500">زمانی برای این روز موجود نیست.</p>
      </div>

      <!-- دکمه رزرو -->
      <div class="flex flex-col gap-2 pt-1">
        <button
          type="button"
          :disabled="!canReserve"
          class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] py-3.5 text-base font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
          @click="$emit('reserveClick')">
          رزرو نوبت | {{ displayPrice }}
        </button>
        <DirectCall
          v-if="phoneNumber"
          :phone="phoneNumber"
          :lawyer-id="lawyerId"
          class="mt-1" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  durationOptions: { id: string; title: string }[];
  duration: string;
  items: Array<{ id: string; value: string; title: string; price: string | number; icon: string; active?: boolean }>;
  activeVisitType: string;
  canReserve: boolean;
  activeDay: string | null;
  dateButtons: Array<{
    id: string;
    title: string;
    dayMonth: string;
    disabled: boolean;
    nonworking: boolean;
  }>;
  scheduleLoaded: boolean;
  scheduleUnavailable: boolean;
  timeSlots: Array<{ id: string; startTime: string; endTime: string; disabled: boolean }>;
  defVisitTime: string | null;
  displayPrice: string;
  daysDrag: { isDragging: boolean; onMouseDown: (e: MouseEvent) => void; onContainerClick: (e: MouseEvent) => void };
  timesDrag: { isDragging: boolean; onMouseDown: (e: MouseEvent) => void; onContainerClick: (e: MouseEvent) => void };
  phoneNumber?: string;
  lawyerId?: string | number | null;
}>();

defineEmits<{
  "update:duration": [id: string];
  "update:activeVisitType": [value: string];
  "update:activeDay": [id: string];
  "update:defVisitTime": [id: string];
  reserveClick: [];
}>();
</script>

<style scoped>
@reference "tailwindcss";
.scrollbar-thin {
  scrollbar-width: thin;
}
</style>
