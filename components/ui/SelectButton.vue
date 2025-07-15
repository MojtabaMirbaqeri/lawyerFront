<template>
  <div class="flex flex-wrap justify-start items-start gap-x-2 gap-y-3">
    <button
      v-for="item in items"
      :key="item.id"
      class="flex items-center gap-1"
      :class="[baseClass, isSelected(item.id) ? activeClass : '' , item.disabled ? 'holiday' : '' , item.nonworking ? 'nonworking' : '']"
      :disabled="item.disabled || item.nonworking"
      @click="handleClick(item.id)"
    >
      <UIcon
        v-if="item.icon"
        :name="item.icon"
        :class="['size-4!', item.iconClass]"
      />
      {{ item.title }}
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
      "px-4 py-2 rounded-full border border-gray-300 text-sm lg:text-base transition cursor-pointer",
  },
  activeClass: {
    type: String,
    default: "bg-primary! border-transparent! text-white!",
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
.holiday {
  background-color: #ffe5e5;
  color: red;
  cursor: not-allowed;
}

.nonworking {
  background-color: #eef1ff;
  color: #666;
  border-color: #ccd;
  cursor: not-allowed;
}
</style>