<template>
  <form class="legal-calc-form" @submit.prevent="onSubmit">
    <div v-for="field in fields" :key="field.name" class="form-field">
      <label v-if="field.label" class="form-label">
        {{ field.label }}
        <span v-if="field.required" class="text-red-500">*</span>
      </label>
      <template v-if="field.type === 'select'">
        <select
          v-model="form[field.name]"
          class="form-input"
          :required="field.required"
        >
          <option value="">انتخاب کنید</option>
          <option
            v-for="opt in (field.options || [])"
            :key="String(opt.value)"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </template>
      <template v-else-if="field.type === 'radio'">
        <div class="flex flex-wrap gap-4">
          <label
            v-for="opt in (field.options || [])"
            :key="String(opt.value)"
            class="flex items-center gap-2"
          >
            <input
              v-model="form[field.name]"
              type="radio"
              :value="opt.value"
              :required="field.required"
              class="form-radio"
            />
            <span>{{ opt.label }}</span>
          </label>
        </div>
      </template>
      <template v-else-if="field.type === 'number'">
        <input
          v-model.number="form[field.name]"
          type="number"
          class="form-input"
          :required="field.required"
          :min="field.min"
          :placeholder="field.helper_text"
        />
      </template>
      <template v-else-if="field.type === 'date'">
        <input
          v-model="form[field.name]"
          type="date"
          class="form-input"
          :required="field.required"
        />
      </template>
      <template v-else-if="field.type === 'checkbox'">
        <div class="flex flex-wrap gap-4">
          <label
            v-for="opt in (field.options || [])"
            :key="String(opt.value)"
            class="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              :value="opt.value"
              :checked="(form[field.name] as unknown[])?.includes(opt.value)"
              class="form-checkbox rounded border-gray-300"
              @change="toggleCheckbox(field.name, opt.value)"
            />
            <span>{{ opt.label }}</span>
          </label>
        </div>
      </template>
      <template v-else-if="field.type === 'repeater'">
        <div class="repeater">
          <div
            v-for="(item, idx) in (form[field.name] as Record<string, unknown[]>)"
            :key="idx"
            class="repeater-row flex flex-wrap gap-2 items-end"
          >
            <template v-for="sub in (field.item_schema || [])" :key="sub.name">
              <div v-if="sub.type === 'select'" class="flex-1 min-w-[120px]">
                <select
                  v-model="item[sub.name]"
                  class="form-input"
                  :required="sub.required"
                >
                  <option value="">انتخاب</option>
                  <option
                    v-for="o in (sub.options || [])"
                    :key="String(o.value)"
                    :value="o.value"
                  >
                    {{ o.label }}
                  </option>
                </select>
              </div>
              <div v-else-if="sub.type === 'number'" class="w-24">
                <input
                  v-model.number="item[sub.name]"
                  type="number"
                  class="form-input"
                  :min="sub.min"
                  :required="sub.required"
                />
              </div>
            </template>
            <button
              type="button"
              class="btn-remove"
              @click="removeRepeaterRow(field.name, idx)"
            >
              حذف
            </button>
          </div>
          <button
            type="button"
            class="btn-add"
            @click="addRepeaterRow(field.name, field.item_schema || [])"
          >
            + افزودن وارث
          </button>
        </div>
      </template>
      <template v-else>
        <input
          v-model="form[field.name]"
          type="text"
          class="form-input"
          :required="field.required"
          :placeholder="field.helper_text"
        />
      </template>
      <p v-if="field.helper_text && field.type !== 'number'" class="form-hint">{{ field.helper_text }}</p>
    </div>
    <div class="form-actions">
      <button type="submit" class="btn-submit" :disabled="pending">
        {{ pending ? 'در حال محاسبه...' : 'محاسبه' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { FormFieldSchema } from '~/composables/useLegalCalculators'

const props = defineProps<{
  schema: { fields?: FormFieldSchema[] }
  pending?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: Record<string, unknown>]
}>()

const form = reactive<Record<string, unknown>>({})

const fields = computed(() => props.schema?.fields ?? [])

watch(fields, (f) => {
  f.forEach((field) => {
    if (field.type === 'repeater' && !(field.name in form)) {
      form[field.name] = [{ heir_type: '', count: 1 }]
    } else if (field.type === 'checkbox' && !(field.name in form)) {
      form[field.name] = []
    } else if (field.type !== 'repeater' && field.type !== 'checkbox' && !(field.name in form)) {
      form[field.name] = field.type === 'number' ? 0 : ''
    }
  })
}, { immediate: true })

function toggleCheckbox(fieldName: string, value: unknown) {
  const arr = (form[fieldName] as unknown[]) || []
  const idx = arr.indexOf(value)
  if (idx === -1) {
    form[fieldName] = [...arr, value]
  } else {
    form[fieldName] = arr.filter((_, i) => i !== idx)
  }
}

function addRepeaterRow(name: string, itemSchema: FormFieldSchema[]) {
  const row: Record<string, unknown> = {}
  itemSchema.forEach((sub) => {
    row[sub.name] = sub.type === 'number' ? 1 : ''
  })
  const arr = (form[name] as Record<string, unknown>[]) || []
  arr.push(row)
  form[name] = [...arr]
}

function removeRepeaterRow(name: string, idx: number) {
  const arr = (form[name] as Record<string, unknown>[]) || []
  arr.splice(idx, 1)
  form[name] = arr.length ? [...arr] : [{}]
}

function onSubmit() {
  const payload: Record<string, unknown> = {}
  fields.value.forEach((field) => {
    const v = form[field.name]
    if (v !== undefined && v !== '') payload[field.name] = v
  })
  emit('submit', payload)
}
</script>

<style scoped>
@reference "tailwindcss";

.legal-calc-form {
  @apply space-y-4;
}
.form-label {
  @apply mb-1 block text-sm font-medium text-gray-700;
}
.form-input {
  @apply w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100;
}
.form-hint {
  @apply mt-1 text-xs text-gray-500;
}
.form-actions {
  @apply mt-6;
}
.btn-submit {
  @apply rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50;
}
.repeater-row {
  @apply mb-2 rounded border border-gray-200 p-2;
}
.btn-add {
  @apply text-sm text-blue-600 hover:underline;
}
.btn-remove {
  @apply text-sm text-red-600 hover:underline;
}
</style>
