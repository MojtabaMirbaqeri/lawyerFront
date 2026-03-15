<template>
  <div class="Picker Picker--monthYear" :class="{ 'Picker--open': isOpen, 'Picker--disabled': disabled }">
    <label
      v-if="label"
      class="Picker-label"
      :class="{ 'Picker-label--focused': isOpen }"
      :for="triggerId"
    >
      {{ label }}
    </label>
    <button
      :id="triggerId"
      ref="triggerRef"
      type="button"
      class="Picker-trigger"
      :class="{ 'Picker-trigger--focused': isOpen }"
      :disabled="disabled"
      :aria-expanded="isOpen"
      :aria-haspopup="dialog"
      :aria-label="ariaLabel"
      @click="toggle"
    >
      <Icon name="lucide:calendar" class="Picker-icon" aria-hidden="true" />
      <span class="Picker-value">
        {{ displayText }}
      </span>
    </button>
    <p v-if="hint" class="Picker-hint">
      {{ hint }}
    </p>

    <Transition name="Picker-drop">
      <div
        v-if="isOpen"
        ref="panelRef"
        class="Picker-panel"
        role="dialog"
        :aria-label="panelAriaLabel"
        aria-modal="true"
        tabindex="-1"
        @click.stop
      >
        <div class="Picker-panelHeader">
          <span class="Picker-panelTitle">
            {{ currentMonthName }} {{ toPersianDigits(displayYear) }}
          </span>
          <button
            type="button"
            class="Picker-panelYearBtn"
            aria-label="تغییر سال"
            @click="showYearView = true"
          >
            <Icon name="lucide:chevron-down" class="Picker-chevron" />
          </button>
        </div>

        <div v-if="!showYearView" class="Picker-grid Picker-grid--months">
          <button
            v-for="m in 12"
            :key="m"
            type="button"
            class="Picker-cell"
            :class="{
              'Picker-cell--selected':
                modelValue?.year === displayYear && modelValue?.month === m,
            }"
            @click="selectMonth(m)"
          >
            {{ PERSIAN_MONTH_NAMES[m - 1] }}
          </button>
        </div>

        <div v-else class="Picker-yearView">
          <button
            type="button"
            class="Picker-backBtn"
            @click="showYearView = false"
          >
            <Icon name="lucide:arrow-right" class="Picker-backBtnIcon" />
            بازگشت
          </button>
          <div class="Picker-grid Picker-grid--years">
            <button
              v-for="y in yearList"
              :key="y"
              type="button"
              class="Picker-cell"
              :class="{ 'Picker-cell--selected': displayYear === y }"
              @click="selectYear(y)"
            >
              {{ toPersianDigits(y) }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <div
      v-if="isOpen"
      class="Picker-backdrop"
      aria-hidden="true"
      @click="close"
    />
  </div>
</template>

<script setup lang="ts">
import {
  toPersianDigits,
  getPersianMonthName,
  getYearRange,
  PERSIAN_MONTH_NAMES,
  type PersianMonthYear,
} from '~/utils/persianDate'

export type { PersianMonthYear }

const props = withDefaults(
  defineProps<{
    /** مقدار انتخاب‌شده (ماه ۱–۱۲ و سال شمسی) */
    modelValue?: PersianMonthYear | null
    /** برچسب فیلد */
    label?: string
    /** متن وقتی چیزی انتخاب نشده */
    placeholder?: string
    /** کمترین سال قابل انتخاب */
    minYear?: number
    /** بیشترین سال قابل انتخاب */
    maxYear?: number
    /** سال پیش‌فرض وقتی مقدار خالی است (برای نمایش در هدر پنل) */
    defaultYear?: number
    /** غیرفعال */
    disabled?: boolean
    /** راهنمای زیر فیلد */
    hint?: string
    /** برای دسترسی (a11y) */
    ariaLabel?: string
  }>(),
  {
    modelValue: null,
    label: '',
    placeholder: 'انتخاب کنید',
    minYear: 1315,
    maxYear: 1410,
    defaultYear: 1403,
    disabled: false,
    hint: '',
    ariaLabel: 'انتخاب ماه و سال',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: PersianMonthYear | null]
}>()

const triggerId = `month-year-picker-${Math.random().toString(36).slice(2, 9)}`
const dialog = 'dialog'
const triggerRef = ref<HTMLButtonElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const showYearView = ref(false)

const displayYear = computed(() => props.modelValue?.year ?? props.defaultYear)
const currentMonthName = computed(() =>
  getPersianMonthName(props.modelValue?.month ?? 1)
)
const yearList = computed(() => getYearRange(props.minYear, props.maxYear))

const displayText = computed(() => {
  if (!props.modelValue?.year || !props.modelValue?.month) return props.placeholder
  const name = getPersianMonthName(props.modelValue.month)
  return `${name} ${toPersianDigits(props.modelValue.year)}`
})

const panelAriaLabel = computed(() => props.ariaLabel || 'انتخاب ماه و سال')

function toggle() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) showYearView.value = false
}

function close() {
  isOpen.value = false
  showYearView.value = false
}

function selectMonth(month: number) {
  emit('update:modelValue', { year: displayYear.value, month })
  close()
}

function selectYear(year: number) {
  emit('update:modelValue', {
    year,
    month: props.modelValue?.month ?? 1,
  })
  showYearView.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return
  if (e.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.Picker {
  position: relative;
  width: 100%;
}

.Picker--disabled .Picker-trigger {
  cursor: not-allowed;
  opacity: 0.6;
}

.Picker-label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--picker-label-color, #374151);
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s, color 0.2s;
}

.Picker-label--focused {
  color: var(--picker-accent, #b45309);
  border-bottom-color: var(--picker-accent, #d97706);
}

.Picker-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  text-align: right;
  color: var(--picker-text, #111827);
  background: var(--picker-bg, #f9fafb);
  border: 1px solid var(--picker-border, #d1d5db);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.Picker-trigger:hover:not(:disabled) {
  border-color: var(--picker-accent, #b45309);
}

.Picker-trigger--focused {
  border-color: var(--picker-accent, #d97706);
  outline: none;
  box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.2);
}

.Picker-trigger:focus-visible {
  outline: 2px solid var(--picker-accent, #d97706);
  outline-offset: 2px;
}

.Picker-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--picker-icon, #6b7280);
  flex-shrink: 0;
}

.Picker-value {
  flex: 1;
  min-width: 0;
}

.Picker-hint {
  margin-top: 4px;
  font-size: 0.75rem;
  color: var(--picker-hint, #6b7280);
}

.Picker-backdrop {
  position: fixed;
  inset: 0;
  z-index: 45;
}

.Picker-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  margin-top: 4px;
  padding: 0.75rem;
  background: var(--picker-panel-bg, #fff);
  border: 1px solid var(--picker-panel-border, #e5e7eb);
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  overflow: hidden;
}

.Picker-panelHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--picker-panel-border, #e5e7eb);
}

.Picker-panelTitle {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--picker-text, #111827);
}

.Picker-panelYearBtn {
  display: flex;
  align-items: center;
  padding: 0.25rem;
  color: var(--picker-icon, #6b7280);
  border-radius: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}

.Picker-panelYearBtn:hover {
  color: var(--picker-accent, #b45309);
  background: var(--picker-cell-hover-bg, #fffbeb);
}

.Picker-chevron {
  width: 1rem;
  height: 1rem;
}

.Picker-grid--months {
  grid-template-columns: repeat(2, 1fr);
}

.Picker-grid--years {
  grid-template-columns: repeat(3, 1fr);
  max-height: 200px;
  overflow-y: auto;
}

.Picker-grid {
  display: grid;
  gap: 0.375rem;
}

.Picker-cell {
  padding: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--picker-cell-text, #111827);
  background: var(--picker-cell-bg, #fff);
  border: 1px solid var(--picker-cell-border, #e5e7eb);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.Picker-cell:hover {
  background: var(--picker-cell-hover-bg, #fffbeb);
  border-color: var(--picker-cell-hover-border, #fcd34d);
}

.Picker-cell--selected {
  color: var(--picker-cell-selected-text, #fff);
  background: var(--picker-accent, #b45309);
  border-color: var(--picker-accent, #b45309);
}

.Picker-yearView {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.Picker-backBtn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  color: var(--picker-icon, #6b7280);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0;
  transition: color 0.15s;
}

.Picker-backBtn:hover {
  color: var(--picker-accent, #b45309);
}

.Picker-backBtnIcon {
  width: 1rem;
  height: 1rem;
}

.Picker-drop-enter-active,
.Picker-drop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.Picker-drop-enter-from,
.Picker-drop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
