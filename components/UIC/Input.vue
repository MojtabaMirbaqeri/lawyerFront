<template>
  <UFormField
    :label="label"
    :name="name"
    class="uic-input-wrapper"
    :ui="{ 
      error: 'text-xs text-red-500 mt-1', 
      container: 'mt-0!',
      label: 'text-sm font-medium text-gray-700 mb-1.5'
    }"
  >
    <template #label v-if="label">
      <label class="uic-label">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
    </template>
    <slot />
    <slot name="input">
      <div class="uic-input-container" :class="{ 'has-icon': icon }">
        <Icon v-if="icon" :name="icon" class="uic-input-icon" />
        <UInput
          v-model="state"
          :type="type || 'text'"
          :name="name"
          :readonly="readonly"
          :inputmode="inputmode"
          :autofocus="autofocus"
          :disabled="disabled"
          :class="[
            { 'opacity-50 cursor-not-allowed': readonly || disabled },
            { 'pr-10': icon }
          ]"
          :placeholder="placeholder || label"
          :maxlength="maxlength"
          class="uic-input"
          :ui="{ 
            root: 'w-full', 
            base: 'w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-white transition-all duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none h-[42px]' 
          }"
          @focus="onFocus"
        />
        <span v-if="maxlength && showCounter" class="uic-input-counter">
          {{ (state?.length || 0) }}/{{ maxlength }}
        </span>
      </div>
      <p v-if="hint" class="uic-input-hint">{{ hint }}</p>
    </slot>
  </UFormField>
</template>

<script setup>
const props = defineProps({
  name: String,
  label: String,
  readonly: Boolean,
  autofocus: Boolean,
  placeholder: String,
  type: String,
  inputmode: String,
  icon: String,
  hint: String,
  required: Boolean,
  disabled: Boolean,
  maxlength: [String, Number],
  showCounter: { type: Boolean, default: false },
});

const state = defineModel();

const onFocus = (e) => {
  if (props.readonly) {
    e.target.blur();
  }
};
</script>

<style scoped>
@reference "tailwindcss";

.uic-input-wrapper {
  @apply w-full flex flex-col text-sm relative;
}

.uic-label {
  @apply block text-sm font-medium text-gray-700 mb-1.5;
}

.uic-input-container {
  @apply relative;
}

.uic-input-container.has-icon .uic-input {
  @apply pr-10;
}

.uic-input-icon {
  @apply absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none;
}

.uic-input-counter {
  @apply absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400;
}

.uic-input-hint {
  @apply text-xs text-gray-500 mt-1;
}
</style>