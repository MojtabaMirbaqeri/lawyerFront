<template>
  <UFormField
    :label="label"
    :name="name"
    class="w-full flex flex-col gap-2.5 text-[15px]"
    :ui="{ error: 'absolute right-0 text-[13px] mt-1', container: 'mt-0!' }"
  >
    <slot name="input">
      <UInput
        v-model="state"
        :readonly="readonly"
        :class="{'opacity-[0.5]' : readonly}"
        @focus="onFocus"
        class="w-full"
        :ui="{ root: 'h-[40px] lg:h-[46px]', base: 'h-full' }"
      />
    </slot>
  </UFormField>
</template>

<script setup>
const props = defineProps(["name", "label","readonly"]);
const state = defineModel();

const onFocus = (e) => {
  if (props.readonly) {
    e.target.blur(); // فوراً از فکوس خارج می‌کنه
  }
};
</script>

<style>
</style>