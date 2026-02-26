<template>
  <div class="Picker Picker--year" :class="{ 'Picker--open': isOpen, 'Picker--disabled': disabled }">
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
      :aria-haspopup="listbox"
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
        role="listbox"
        :aria-label="panelAriaLabel"
        tabindex="-1"
        @click.stop
      >
        <div class="Picker-grid">
          <button
            v-for="y in yearList"
            :key="y"
            type="button"
            class="Picker-cell"
            :class="{ 'Picker-cell--selected': modelValue === y }"
            role="option"
            :aria-selected="modelValue === y"
            @click="select(y)"
          >
            {{ toPersianDigits(y) }}
          </button>
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
import { toPersianDigits, getYearRange } from '~/utils/persianDate'

const props = withDefaults(
  defineProps<{
    /** مقدار انتخاب‌شده (سال شمسی) */
    modelValue?: number | null
    /** برچسب فیلد */
    label?: string
    /** متن وقتی چیزی انتخاب نشده */
    placeholder?: string
    /** کمترین سال قابل انتخاب */
    minYear?: number
    /** بیشترین سال قابل انتخاب */
    maxYear?: number
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
    disabled: false,
    hint: '',
    ariaLabel: 'انتخاب سال',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const triggerId = `year-picker-${Math.random().toString(36).slice(2, 9)}`
const listbox = 'listbox'
const triggerRef = ref<HTMLButtonElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const yearList = computed(() => getYearRange(props.minYear, props.maxYear))

const displayText = computed(() => {
  if (props.modelValue == null) return props.placeholder
  return toPersianDigits(props.modelValue)
})

const panelAriaLabel = computed(() => props.ariaLabel || 'انتخاب سال')

function toggle() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

function select(year: number) {
  emit('update:modelValue', year)
  close()
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
  max-height: 320px;
  padding: 0.75rem;
  background: var(--picker-panel-bg, #fff);
  border: 1px solid var(--picker-panel-border, #e5e7eb);
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  overflow: hidden;
}

.Picker-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  max-height: 280px;
  overflow-y: auto;
}

.Picker-cell {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
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
