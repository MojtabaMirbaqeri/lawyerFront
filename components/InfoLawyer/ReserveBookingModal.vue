<template>
  <UModal
    :open="open"
    :ui="{ width: 'max-w-2xl' }"
    @update:open="$emit('update:open', $event)">
    <template #content>
      <div
        class="reserve-modal overflow-auto bg-white shadow-xl"
        dir="rtl">
        <!-- هدر و نوار پیشرفت -->
        <div class="border-b border-slate-100 px-6 pt-6 pb-4 sm:px-8">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="flex items-center gap-2 text-xl font-bold text-slate-800 sm:text-2xl">
              <UIcon name="hugeicons:law" class="text-2xl text-[#0EA5E9] sm:text-3xl" />
              رزرو مشاوره حقوقی
            </h2>
            <span class="text-sm font-medium text-slate-500">
              مرحله {{ step }} از {{ totalSteps }}
            </span>
          </div>
          <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              class="h-full rounded-full bg-[#0EA5E9] transition-all duration-300"
              :style="{ width: `${(step / totalSteps) * 100}%` }" />
          </div>
        </div>

        <!-- مرحله ۱: شرح مشکل -->
        <template v-if="step === 1">
          <div class="px-6 sm:px-8">
            <div class="flex items-center gap-2 pt-6 pb-2">
              <UIcon name="solar:clipboard-list-outline" class="size-5! text-[#0EA5E9]" />
              <h3 class="text-lg font-bold text-slate-800 sm:text-xl">شرح مشکل</h3>
            </div>
            <p class="mb-6 text-sm text-slate-500">
              لطفاً جزئیات پرونده یا سوال حقوقی خود را شرح دهید تا وکیل پیش از جلسه آن را بررسی کند.
            </p>
          </div>
          <div class="space-y-6 px-6 pb-6 sm:px-8 sm:pb-8">
            <div>
              <label for="case-description" class="sr-only">توضیحات پرونده</label>
              <textarea
                id="case-description"
                :value="caseDescription"
                class="w-full resize-none rounded-xl border-0 bg-slate-50 p-4 text-slate-800 shadow-inner transition-colors placeholder:text-slate-400 focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none"
                placeholder="شرح کامل موضوع حقوقی خود را اینجا بنویسید..."
                rows="8"
                @input="onCaseDescriptionInput($event)" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-800">
                مدارک و مستندات (اختیاری)
              </label>
              <div
                class="group flex cursor-pointer justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 pt-5 pb-6 transition-colors hover:border-[#0EA5E9]"
                @click="triggerFileInput"
                @dragover.prevent="fileDropActive = true"
                @dragleave.prevent="fileDropActive = false"
                @drop.prevent="onFileDrop">
                <input
                  id="file-upload-reserve"
                  ref="fileInputRef"
                  type="file"
                  class="sr-only"
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf"
                  @change="onFileSelect">
                <div class="space-y-1 text-center">
                  <UIcon
                    name="hugeicons:upload"
                    class="mx-auto text-4xl text-slate-400 transition-colors group-hover:text-[#0EA5E9]" />
                  <div class="flex flex-wrap justify-center gap-1 text-sm text-slate-500">
                    <label
                      class="cursor-pointer font-medium text-[#0EA5E9] hover:underline"
                      for="file-upload-reserve"
                      @click.stop="triggerFileInput">
                      آپلود مدارک
                    </label>
                    <span>یا فایل را اینجا بکشید و رها کنید</span>
                  </div>
                  <p class="text-xs text-slate-400">PNG, JPG, PDF تا ۱۰ مگابایت</p>
                  <p v-if="reserveFiles.length" class="text-xs font-medium text-[#0EA5E9]">
                    {{ reserveFiles.length }} فایل انتخاب شده
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- مرحله ۲: مرور و پرداخت -->
        <template v-else>
          <div class="rounded-2xl bg-slate-50/80 p-6 sm:p-8">
            <div
              class="mb-6 rounded-xl border border-blue-100 bg-sky-50/50 p-5 dark:border-blue-900/50 dark:bg-sky-950/20">
              <h3 class="mb-4 flex items-center gap-2 text-sm font-bold text-[#0EA5E9]">
                <UIcon name="solar:info-circle-outline" class="text-lg" />
                جزئیات رزرو شما
              </h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-500">نام وکیل:</span>
                  <span class="font-medium text-slate-800">{{ lawyerName || '—' }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-500">تاریخ و زمان:</span>
                  <span class="font-medium text-slate-800" dir="ltr">{{ summaryDateText }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-500">مشاوره:</span>
                  <span class="flex items-center gap-1 font-medium text-slate-800">
                    <UIcon name="hugeicons:call" class="size-4 text-slate-500" />
                    {{ visitTypeTitle ?? '—' }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-500">مدت زمان:</span>
                  <span class="font-medium text-slate-800">{{ summaryDurationText }}</span>
                </div>
              </div>
            </div>
            <div class="my-4 border-t border-slate-200" />
              <div class="space-y-4">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">مبلغ مشاوره:</span>
                  <span class="font-medium text-slate-800">{{ displayPrice }}</span>
                </div>
                <div
                  class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 focus-within:border-[#0EA5E9] focus-within:ring-2 focus-within:ring-[#0EA5E9]/20">
                  <UIcon name="hugeicons:tag" class="size-5 text-slate-400" />
                  <input
                    :value="discountCode"
                    type="text"
                    class="min-w-0 flex-1 border-none bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:ring-0"
                    placeholder="کد تخفیف دارید؟"
                    @input="onDiscountCodeInput($event)">
                  <button
                    type="button"
                    class="rounded px-2 py-1 text-sm font-bold text-[#0EA5E9] transition-colors hover:bg-sky-100"
                    @click="$emit('applyDiscount')">
                    اعمال
                  </button>
                </div>
                <p
                  v-if="offerValueDisplay"
                  class="text-sm font-medium text-emerald-600">
                  تخفیف اعمال شده: {{ offerValueDisplay }}
                </p>
                <div class="my-2 border-t border-dashed border-slate-300" />
                <div class="flex items-center justify-between">
                  <span class="text-lg font-bold text-slate-800">مبلغ قابل پرداخت:</span>
                  <span class="text-xl font-extrabold text-[#0EA5E9]">{{ finalPriceDisplay }}</span>
                </div>
              </div>
          </div>
        </template>

        <!-- فوتر دکمه‌ها -->
        <div
          class="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:justify-between sm:px-8">
          <button
            type="button"
            class="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-100 sm:w-auto"
            @click="$emit('back')">
            <UIcon name="solar:arrow-right-outline" class="text-lg" />
            بازگشت
          </button>
          <button
            v-if="step === 1"
            type="button"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-8 py-3 font-bold text-white shadow-lg shadow-sky-200 transition-all hover:-translate-y-0.5 hover:bg-sky-600 sm:w-auto"
            @click="$emit('next')">
            ادامه و مشاهده خلاصه
            <UIcon name="solar:arrow-left-outline" class="size-5!" />
          </button>
          <button
            v-else
            type="button"
            class="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-8 py-3 font-bold text-white shadow-lg shadow-sky-200 transition-all hover:-translate-y-0.5 hover:bg-sky-600 sm:w-auto disabled:pointer-events-none disabled:opacity-60"
            :disabled="!canReserve"
            @click="$emit('confirmPayment')">
            <UIcon name="solar:card-linear" class="size-5! group-hover:animate-pulse" />
            پرداخت و نهایی کردن رزرو
          </button>
        </div>
        <p
          v-if="step === 2"
          class="flex items-center justify-center gap-1 px-6 pb-4 text-center text-xs text-slate-500 sm:px-8">
          <UIcon name="hugeicons:lock" class="size-3.5 text-emerald-500" />
          پرداخت امن با درگاه بانکی
        </p>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean;
    step: number;
    totalSteps: number;
    lawyerName?: string;
    summaryDateText: string;
    summaryDurationText: string;
    visitTypeTitle?: string;
    displayPrice: string;
    finalPriceDisplay: string;
    offerValueDisplay?: string | null;
    canReserve: boolean;
    caseDescription: string;
    reserveFiles: File[];
    discountCode: string;
  }>(),
  { lawyerName: "", visitTypeTitle: "", offerValueDisplay: null }
);

const emit = defineEmits<{
  "update:open": [value: boolean];
  "update:caseDescription": [value: string];
  "update:discountCode": [value: string];
  "update:reserveFiles": [value: File[]];
  applyDiscount: [];
  back: [];
  next: [];
  confirmPayment: [];
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const fileDropActive = ref(false);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function triggerFileInput() {
  fileInputRef.value?.click();
}

function filterValidFiles(files: File[]) {
  return files.filter((f) => f.size <= MAX_FILE_SIZE);
}

function onFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  const files = Array.from(input.files || []);
  const allowed = filterValidFiles(files);
  const next = [...props.reserveFiles, ...allowed];
  emit("update:reserveFiles", next);
  if (input) input.value = "";
}

function onFileDrop(e: DragEvent) {
  fileDropActive.value = false;
  const files = Array.from(e.dataTransfer?.files || []);
  const allowed = filterValidFiles(files);
  const next = [...props.reserveFiles, ...allowed];
  emit("update:reserveFiles", next);
}

function onCaseDescriptionInput(e: Event) {
  const target = e.target as HTMLTextAreaElement | null;
  emit("update:caseDescription", target?.value ?? "");
}

function onDiscountCodeInput(e: Event) {
  const target = e.target as HTMLInputElement | null;
  emit("update:discountCode", target?.value ?? "");
}
</script>
