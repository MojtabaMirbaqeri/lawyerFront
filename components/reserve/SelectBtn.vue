<template>
  <div class="flex flex-wrap justify-center  items-stretch gap-x-2 gap-y-3">
    <button
      v-for="item in items"
      :key="item.id"
      class="flex items-center gap-1"
      :class="[
        baseClass,
        isSelected(item.id) ? activeClass : '',
        item.disabled ? 'holiday' : '',
        item.nonworking ? 'nonworking' : '',
      ]"
      :disabled="item.disabled || item.nonworking"
      @click="handleClick(item.id)"
      type="button"
    >
      <UIcon
        v-if="item.icon"
        :name="item.icon"
        :class="['size-4!', item.iconClass]"
      />
      <div class="flex flex-col gap-1">
        <span class="text-xs">
          {{ item.title }}
        </span>
        <span class="font-bold text-base">
          {{
            new Date(item.shamsi)
              .toLocaleDateString("fa")
              .split("/")[2]
              .padStart(2, "0")
          }}/
          {{
            new Date(item.shamsi)
              .toLocaleDateString("fa")
              .split("/")[1]
              .padStart(2, "0")
          }}
        </span>
        <div class="text-xs!">
          <span v-if="item.nonworking"> روز غیر کاری </span>
          <span v-else-if="!item.nonworking && !item.disabled"> روز کاری </span>
          <span v-else> تعطیل </span>
        </div>
      </div>
    </button>
  </div>
</template>

<script setup>
const modelValue = defineModel({ type: [String, Array] });

const props = defineProps({
  items: {
    type: Array,
    required: true,
    //  { title: string, id: any, icon?: string }
  },
  baseClass: {
    type: String,
    default:
      "px-4 py-2 w-[85px] rounded-[8px] text-[14px]! flex justify-center items-center border border-gray-300 text-sm lg:text-base transition cursor-pointer",
  },
  activeClass: {
    type: String,
    default: "text-primary! border-primary!",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
});

// console.log(items);

const isSelected = (id) => {
  return props.multiple
    ? Array.isArray(modelValue.value) && modelValue.value.includes(id)
    : modelValue.value === id;
};
const handleClick = (id) => {
  if (props.multiple) {
    const current = Array.isArray(modelValue.value)
      ? [...modelValue.value]
      : [];
    const index = current.indexOf(id);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    modelValue.value = current;
  } else {
    modelValue.value = id;
  }
};
</script>

<style scoped>
@reference "tailwindcss";
.holiday {
  background-color: #ffe5e5;
  color: red;
  cursor: not-allowed;
}

.nonworking {
  @apply bg-gray-100 opacity-60;
  color: #666;
  border-color: #ccd;
  cursor: not-allowed;
}
</style>