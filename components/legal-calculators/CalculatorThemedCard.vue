<template>
  <div class="calc-themed-card" :data-theme="theme">
    <div class="calc-themed-card-header">
      <span class="calc-themed-card-accent" />
      <div>
        <h2 class="calc-themed-card-title">{{ title }}</h2>
        <p v-if="subtitle" class="calc-themed-card-subtitle">{{ subtitle }}</p>
      </div>
    </div>
    <div class="calc-themed-card-body">
      <p v-if="instruction" class="calc-themed-card-instruction">{{ instruction }}</p>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
export type CalculatorTheme = 'red' | 'amber' | 'blue' | 'emerald' | 'violet'

defineProps<{
  theme: CalculatorTheme
  title: string
  subtitle?: string
  instruction?: string
}>()
</script>

<style scoped>
@reference "tailwindcss";

.calc-themed-card {
  @apply rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden;
  --calc-accent: var(--calc-theme-500);
  --calc-header-bg: var(--calc-theme-50);
  --calc-header-border: var(--calc-theme-200);
  --calc-title: var(--calc-theme-900);
  --calc-subtitle: var(--calc-theme-600);
  --calc-submit-bg: var(--calc-theme-600);
  --calc-submit-hover: var(--calc-theme-700);
  --calc-focus-border: var(--calc-theme-500);
  --calc-focus-ring: var(--calc-theme-100);
}

.calc-themed-card[data-theme="red"] {
  --calc-theme-50: rgb(254 242 242);
  --calc-theme-100: rgb(254 226 226);
  --calc-theme-200: rgb(254 202 202);
  --calc-theme-500: rgb(239 68 68);
  --calc-theme-600: rgb(220 38 38);
  --calc-theme-700: rgb(185 28 28);
  --calc-theme-900: rgb(127 29 29);
}

.calc-themed-card[data-theme="amber"] {
  --calc-theme-50: rgb(255 251 235);
  --calc-theme-100: rgb(254 243 199);
  --calc-theme-200: rgb(253 230 138);
  --calc-theme-500: rgb(245 158 11);
  --calc-theme-600: rgb(217 119 6);
  --calc-theme-700: rgb(180 83 9);
  --calc-theme-900: rgb(120 53 15);
}

.calc-themed-card[data-theme="blue"] {
  --calc-theme-50: rgb(239 246 255);
  --calc-theme-100: rgb(219 234 254);
  --calc-theme-200: rgb(191 219 254);
  --calc-theme-500: rgb(59 130 246);
  --calc-theme-600: rgb(37 99 235);
  --calc-theme-700: rgb(29 78 216);
  --calc-theme-900: rgb(30 58 138);
}

.calc-themed-card[data-theme="emerald"] {
  --calc-theme-50: rgb(236 253 245);
  --calc-theme-100: rgb(209 250 229);
  --calc-theme-200: rgb(167 243 208);
  --calc-theme-500: rgb(16 185 129);
  --calc-theme-600: rgb(5 150 105);
  --calc-theme-700: rgb(4 120 87);
  --calc-theme-900: rgb(6 78 59);
}

.calc-themed-card[data-theme="violet"] {
  --calc-theme-50: rgb(245 243 255);
  --calc-theme-100: rgb(237 233 254);
  --calc-theme-200: rgb(221 214 254);
  --calc-theme-500: rgb(139 92 246);
  --calc-theme-600: rgb(124 58 237);
  --calc-theme-700: rgb(109 40 217);
  --calc-theme-900: rgb(67 56 202);
}

.calc-themed-card-header {
  @apply flex items-center gap-3 border-b px-5 py-4;
  background-color: var(--calc-header-bg);
  border-color: var(--calc-header-border);
}

.calc-themed-card-accent {
  @apply h-8 w-1 shrink-0 rounded-full;
  background-color: var(--calc-accent);
}

.calc-themed-card-title {
  @apply text-lg font-semibold;
  color: var(--calc-title);
}

.calc-themed-card-subtitle {
  @apply mt-0.5 text-xs;
  color: var(--calc-subtitle);
}

.calc-themed-card-body {
  @apply p-6;
}

.calc-themed-card-instruction {
  @apply mb-5 text-sm text-gray-600;
}

/* Theme form elements inside slot (CalculatorForm and custom forms) */
.calc-themed-card-body :deep(.btn-submit),
.calc-themed-card-body :deep(.dowry-submit),
.calc-themed-card-body :deep(.delay-damages-submit),
.calc-themed-card-body :deep(button[type="submit"]) {
  background-color: var(--calc-submit-bg) !important;
  @apply border-0 text-white;
}
.calc-themed-card-body :deep(.btn-submit:hover:not(:disabled)),
.calc-themed-card-body :deep(.dowry-submit:hover:not(:disabled)),
.calc-themed-card-body :deep(.delay-damages-submit:hover:not(:disabled)),
.calc-themed-card-body :deep(button[type="submit"]:hover:not(:disabled)) {
  background-color: var(--calc-submit-hover) !important;
}

.calc-themed-card-body :deep(.form-input),
.calc-themed-card-body :deep(.dowry-input),
.calc-themed-card-body :deep(.delay-damages-input),
.calc-themed-card-body :deep(input[type="text"]),
.calc-themed-card-body :deep(input[type="number"]),
.calc-themed-card-body :deep(select) {
  @apply border-gray-300 bg-gray-50;
}
.calc-themed-card-body :deep(.form-input:focus),
.calc-themed-card-body :deep(.dowry-input:focus),
.calc-themed-card-body :deep(.delay-damages-input:focus),
.calc-themed-card-body :deep(input:focus),
.calc-themed-card-body :deep(select:focus) {
  border-color: var(--calc-focus-border) !important;
  box-shadow: 0 0 0 2px var(--calc-focus-ring);
  outline: none;
}

.calc-themed-card-body :deep(.form-radio:focus),
.calc-themed-card-body :deep(.delay-damages-radio input:focus) {
  --tw-ring-color: var(--calc-focus-ring);
}
.calc-themed-card-body :deep(.delay-damages-radio input[type="radio"]) {
  @apply border-gray-300;
}
.calc-themed-card-body :deep(.delay-damages-radio input[type="radio"]:checked) {
  border-color: var(--calc-accent);
  color: var(--calc-accent);
}
</style>
