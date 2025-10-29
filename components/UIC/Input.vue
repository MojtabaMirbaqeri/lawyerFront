<template>
  <UFormField
    :label="label"
    :name="name"
    class="w-full flex flex-col gap-2.5 text-[15px] relative"
    :ui="{ error: 'absolute right-0 text-[13px] mt-1', container: 'mt-0!' }"
  >
    <slot />
    <slot name="input">
      <UInput
        v-model="state"
        :type="type || 'text'"
        :name="name"
        :readonly="readonly"
        :inputmode="inputmode"
        :autofocus="autofocus"
        :class="{ 'opacity-[0.5]': readonly }"
        :placeholder="placeholder || label"
        class="w-full"
        :ui="{ root: 'field-base', base: 'h-full' }"
        @focus="onFocus"
      />
    </slot>
  </UFormField>
</template>

<script setup>
const props = defineProps([
  "name",
  "label",
  "readonly",
  "autofocus",
  "placeholder",
  "type",
  "inputmode",
]);
const state = defineModel();

const onFocus = (e) => {
  if (props.readonly) {
    e.target.blur(); // فوراً از فکوس خارج می‌کنه
  }
};
</script>

<style>
</style>