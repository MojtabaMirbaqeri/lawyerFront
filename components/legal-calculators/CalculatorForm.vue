<template>
  <form class="legal-calc-form" @submit.prevent="onSubmit">
    <!-- حالت آکاردئون (وقتی دسته‌بندی section وجود دارد) -->
    <template v-if="hasAccordion">
      <div v-for="(group, idx) in groupsWithVisibleFields" :key="idx" class="accordion-item">
        <button
          type="button"
          class="accordion-header"
          :aria-expanded="openSections.includes(idx)"
          @click="toggleSection(idx)"
        >
          <span class="accordion-title">{{ group.title }}</span>
          <Icon
            :name="openSections.includes(idx) ? 'lucide:chevron-up' : 'lucide:chevron-down'"
            class="accordion-icon"
          />
        </button>
        <div v-show="openSections.includes(idx)" class="accordion-body">
          <p v-if="group.helperText" class="accordion-body-hint">{{ group.helperText }}</p>
          <div
            v-for="field in group.fields"
            :key="field.name"
            class="form-field"
          >
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
                  v-for="(item, ri) in (form[field.name] as Record<string, unknown>[])"
                  :key="ri"
                  class="repeater-row flex flex-wrap gap-2 items-end"
                >
                  <template v-for="sub in (field.item_schema || [])" :key="sub.name">
                    <div v-if="sub.type === 'select'" class="flex-1 min-w-[120px]">
                      <select v-model="item[sub.name]" class="form-input" :required="sub.required">
                        <option value="">انتخاب</option>
                        <option v-for="o in (sub.options || [])" :key="String(o.value)" :value="o.value">{{ o.label }}</option>
                      </select>
                    </div>
                    <div v-else-if="sub.type === 'number'" class="w-24">
                      <input v-model.number="item[sub.name]" type="number" class="form-input" :min="sub.min" :required="sub.required" />
                    </div>
                  </template>
                  <button type="button" class="btn-remove" @click="removeRepeaterRow(field.name, ri)">حذف</button>
                </div>
                <button type="button" class="btn-add" @click="addRepeaterRow(field.name, field.item_schema || [])">+ افزودن وارث</button>
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
        </div>
      </div>
    </template>
    <!-- حالت معمولی (بدون آکاردئون) -->
    <template v-else>
    <template v-for="field in fields" :key="field.name">
      <div v-if="field.type === 'section'" class="form-section-header">
        <h3 class="form-section-title">{{ field.label }}</h3>
        <p v-if="field.helper_text" class="form-section-hint">{{ field.helper_text }}</p>
      </div>
      <div v-else-if="(field.name !== 'wives_count' || form.spouse_type === 'wife')" class="form-field">
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
    </template>
    </template>
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

/** گروه‌های آکاردئون: تقسیم فیلدها بر اساس section */
const groups = computed(() => {
  const f = fields.value
  const result: { title: string; helperText?: string; fields: FormFieldSchema[] }[] = []
  let current: { title: string; helperText?: string; fields: FormFieldSchema[] } | null = null
  for (const field of f) {
    if (field.type === 'section') {
      if (current) result.push(current)
      current = { title: field.label, helperText: field.helper_text, fields: [] }
    } else {
      if (!current) current = { title: '', fields: [] }
      current.fields.push(field)
    }
  }
  if (current) result.push(current)
  return result
})

const hasAccordion = computed(() => groups.value.length > 1)

/** فیلد «تعداد زن» فقط وقتی وضعیت همسر «دارای زن» است نمایش داده می‌شود */
const groupsWithVisibleFields = computed(() =>
  groups.value.map((g) => ({
    ...g,
    fields: g.fields.filter((f) => f.name !== 'wives_count' || form.spouse_type === 'wife'),
  }))
)

const openSections = ref<number[]>([0])

function toggleSection(idx: number) {
  const open = [...openSections.value]
  const i = open.indexOf(idx)
  if (i >= 0) open.splice(i, 1)
  else open.push(idx)
  openSections.value = open.sort((a, b) => a - b)
}

watch(fields, (f) => {
  f.forEach((field) => {
    if (field.type === 'section') return
    if (field.type === 'repeater' && !(field.name in form)) {
      form[field.name] = [{ heir_type: '', count: 1 }]
    } else if (field.type === 'checkbox' && !(field.name in form)) {
      form[field.name] = []
    } else if (field.type === 'radio' && !(field.name in form)) {
      form[field.name] = false
    } else if (field.type !== 'repeater' && field.type !== 'checkbox' && !(field.name in form)) {
      form[field.name] = field.type === 'number' ? (field.name === 'wives_count' ? 1 : 0) : ''
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
    if (field.type === 'section') return
    let v = form[field.name]
    if (field.name === 'wives_count' && form.spouse_type !== 'wife') v = 1
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

/* عنوان بخش (نوع section) */
.form-section-header {
  @apply mt-8 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 first:mt-0;
}
.form-section-title {
  @apply text-base font-semibold text-gray-800;
}
.form-section-hint {
  @apply mt-1 text-xs text-gray-500;
}

/* آکاردئون */
.accordion-item {
  @apply rounded-lg border border-gray-200 bg-white overflow-hidden;
}
.accordion-item + .accordion-item {
  @apply mt-3;
}
.accordion-header {
  @apply w-full flex items-center justify-between gap-2 px-4 py-3 text-right text-gray-800 font-medium bg-gray-50 hover:bg-gray-100 transition-colors;
}
.accordion-title {
  @apply shrink min-w-0;
}
.accordion-icon {
  @apply w-5 h-5 shrink-0 text-gray-500;
}
.accordion-body {
  @apply border-t border-gray-200 px-4 py-4 space-y-4;
}
.accordion-body-hint {
  @apply text-xs text-gray-500 mb-2;
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
