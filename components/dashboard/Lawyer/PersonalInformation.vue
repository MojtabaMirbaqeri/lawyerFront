<template>
  <section class="personal-info-section">
    <UForm :schema="schema" :state="state" class="personal-info-form" @submit="onSubmit">
      <!-- گروه هویت -->
      <UICFormSection
        title="اطلاعات هویتی"
        description="اطلاعات پایه هویتی شما برای احراز هویت و نمایش در پروفایل"
        icon="lucide:user"
        required
      >
        <div class="form-grid">
          <!-- نام و نام خانوادگی readonly -->
          <div class="form-field">
            <UICInput
              v-model="state.full_name"
              label="نام و نام خانوادگی"
              hint="غیرقابل تغییر"
              readonly
              icon="lucide:user"
            />
          </div>

          <!-- جنسیت -->
          <div class="form-field">
            <label class="form-label">
              جنسیت
              <span class="required-star">*</span>
            </label>
            <UICSelect
              v-model="state.gender"
              :items="[
                { id: 'male', label: 'مرد' },
                { id: 'female', label: 'زن' },
              ]"
            />
            <p class="form-hint">جنسیت شما در پروفایل عمومی نمایش داده می‌شود</p>
          </div>

          <!-- نام پدر -->
          <div class="form-field">
            <UICInput
              v-model="state.father_name"
              name="father_name"
              label="نام پدر"
              placeholder="نام پدر را وارد کنید"
              hint="برای تایید هویت و صدور گواهی استفاده می‌شود"
              required
            />
          </div>

          <!-- تاریخ تولد -->
          <div class="form-field">
            <label class="form-label">
              تاریخ تولد
              <span class="required-star">*</span>
            </label>
            <div class="date-picker-wrap">
              <PersianDate 
                v-model="state.birth_date" 
                :column="1" 
                mode="single"
                format="YYYY-MM-DD"
                display-format="jYYYY/jMM/jDD"
              >
                <template #icon>
                  <Icon name="lucide:calendar" class="h-full w-5 text-gray-400" />
                </template>
              </PersianDate>
            </div>
            <p class="form-hint">تاریخ به صورت شمسی نمایش داده می‌شود</p>
          </div>
        </div>
      </UICFormSection>

      <!-- گروه محل سکونت -->
      <UICFormSection
        title="محل سکونت"
        description="آدرس محل سکونت شما برای نمایش در نتایج جستجو"
        icon="lucide:map-pin"
        required
      >
        <div class="form-grid">
          <!-- استان -->
          <div class="form-field">
            <label class="form-label">
              استان
              <span class="required-star">*</span>
            </label>
            <UICSelect 
              v-model="state.province_id" 
              :items="provinces"
              :loading="isFetching"
              placeholder="انتخاب استان"
            />
          </div>

          <!-- شهر -->
          <div class="form-field">
            <label class="form-label">
              شهر
              <span class="required-star">*</span>
            </label>
            <UICSelect 
              v-model="state.city_id" 
              :items="cities"
              :loading="isFetching"
              placeholder="انتخاب شهر"
              :disabled="!state.province_id"
            />
            <p v-if="!state.province_id" class="form-hint text-amber-600">
              <Icon name="lucide:alert-circle" class="w-3 h-3 inline" />
              ابتدا استان را انتخاب کنید
            </p>
          </div>
        </div>
      </UICFormSection>

      <!-- دکمه ذخیره و وضعیت -->
      <div class="form-actions">
        <div class="form-status">
          <Transition name="fade" mode="out-in">
            <div v-if="saveSuccess" class="save-success">
              <Icon name="lucide:check-circle" class="w-4 h-4" />
              <span>ذخیره شد</span>
            </div>
            <div v-else-if="isChanged" class="unsaved-changes">
              <Icon name="lucide:alert-circle" class="w-4 h-4" />
              <span>تغییرات ذخیره نشده</span>
            </div>
          </Transition>
        </div>
        
        <div class="form-buttons">
          <button 
            v-if="isChanged"
            type="button" 
            class="btn-ghost"
            @click="resetForm"
            :disabled="isLoading"
          >
            <Icon name="lucide:rotate-ccw" class="w-4 h-4" />
            بازنشانی
          </button>
          <button 
            type="submit" 
            class="btn-primary"
            :disabled="!isChanged || isLoading || isFetching"
          >
            <Icon v-if="isLoading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            <Icon v-else name="lucide:check" class="w-4 h-4" />
            {{ isLoading ? "در حال ذخیره..." : "ذخیره تغییرات" }}
          </button>
        </div>
      </div>
    </UForm>
  </section>
</template>

<script setup>
import { object, string, mixed } from "yup";
import PersianDate from "@alireza-ab/vue3-persian-datepicker";

const props = defineProps({
  lawyerInformation: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:changes', 'saved']);
const reFetchLawyer = inject("reFetchLawyerInformation");

const isLoading = ref(false);
const isFetching = ref(false);
const saveSuccess = ref(false);
const provinces = ref([]);
const cities = ref([]);

// Handle both nested {data: {...}} and flat {...} structures
const lawyerData = computed(() => {
  const info = props.lawyerInformation;
  return info?.data || info;
});

const li = computed(() => lawyerData.value?.lawyer_info || {});

const getInitialState = () => {
  const data = lawyerData.value || {};
  const info = data.lawyer_info || {};
  return {
    full_name: `${data.name || ''} ${data.family || ''}`.trim(),
    gender: info.gender || "male",
    father_name: info.father_name || "",
    birth_date: info.birth_date ? new Date(info.birth_date).toISOString().split("T")[0] : "",
    province_id: info.province_id ? String(info.province_id) : "",
    city_id: info.city_id ? String(info.city_id) : "",
  };
};

const state = reactive(getInitialState());

const initialState = reactive({ ...state });

const isChanged = computed(() => {
  return ["gender", "father_name", "birth_date", "province_id", "city_id"].some(
    (key) => String(state[key] || "") !== String(initialState[key] || "")
  );
});

watch(isChanged, (val) => {
  emit('update:changes', 'personal_information', val);
});

const resetForm = () => {
  Object.assign(state, { ...initialState });
};

onMounted(async () => {
  isFetching.value = true;
  try {
    const provincesRes = await fetch("/provinces.json");
    const rawProvinces = await provincesRes.json();
    provinces.value = (rawProvinces || []).map((p) => ({
      id: String(p.id),
      label: p.name,
    }));
    if ((!state.province_id || state.province_id === "") && provinces.value.length)
      state.province_id = provinces.value[0].id;
    await fetchCities(state.province_id);
  } catch (err) {
    console.error("fetch provinces error:", err);
  } finally {
    isFetching.value = false;
  }
});

watch(
  () => state.province_id,
  async (newVal) => {
    if (!newVal) {
      cities.value = [];
      state.city_id = "";
      return;
    }
    await fetchCities(newVal);
  }
);

async function fetchCities(provinceId) {
  if (!provinceId) {
    cities.value = [];
    state.city_id = "";
    return;
  }
  isFetching.value = true;
  try {
    const res = await useGet({
      url: `area/citiesByProvincesId/${provinceId}`,
      includeAuthHeader: false,
    });
    const raw = res.data || [];
    cities.value = raw.map((c) => ({ id: String(c.id), label: c.name }));
    if (!cities.value.find((c) => c.id === state.city_id))
      state.city_id = cities.value.length ? cities.value[0].id : "";
  } catch (err) {
    console.error("fetchCities error:", err);
    cities.value = [];
    state.city_id = "";
  } finally {
    isFetching.value = false;
  }
}

const schema = object({
  gender: string().required("جنسیت الزامی است"),
  father_name: string().required("نام پدر الزامی است"),
  birth_date: string()
    .required("تاریخ تولد الزامی است")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "فرمت تاریخ باید YYYY-MM-DD باشد"),
  province_id: mixed().required("استان الزامی است"),
  city_id: mixed().required("شهر الزامی است"),
});

const onSubmit = async () => {
  if (!isChanged.value || isLoading.value) return;

  const body = {
    gender: state.gender,
    father_name: state.father_name,
    birth_date: state.birth_date,
    province_id: Number(state.province_id),
    city_id: Number(state.city_id),
  };

  isLoading.value = true;
  try {
    const res = await usePost({
      url: "lawyers/updatePersonalInfo",
      includeAuthHeader: true,
      body,
    });
    if (res.statusCode === 200 || res.statusCode === 201) {
      await reFetchLawyer();
      Object.assign(initialState, { ...state });
      
      saveSuccess.value = true;
      setTimeout(() => {
        saveSuccess.value = false;
      }, 3000);
      
      useToast().add({
        title: "اطلاعات با موفقیت به‌روز شد",
        color: "success",
      });
      
      emit('saved');
    } else {
      useToast().add({ title: "به‌روزرسانی با خطا مواجه شد", color: "error" });
      console.error("updatePersonalInfo error:", res);
    }
  } catch (err) {
    console.error("submit error:", err);
    useToast().add({ title: "خطا در ارسال اطلاعات", color: "error" });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@reference "tailwindcss";

.personal-info-section {
  @apply flex flex-col gap-6;
}

.personal-info-form {
  @apply flex flex-col gap-6;
}

.form-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

.form-field {
  @apply flex flex-col gap-2;
}

.form-label {
  @apply text-sm font-medium text-gray-700;
}

.required-star {
  @apply text-red-500 mr-0.5;
}

.form-hint {
  @apply text-xs text-gray-500 flex items-center gap-1;
}

.date-picker-wrap {
  @apply relative;
}

.form-actions {
  @apply flex items-center justify-between gap-4 pt-6 border-t border-gray-100;
}

.form-status {
  @apply min-h-[24px];
}

.save-success {
  @apply flex items-center gap-2 text-sm text-green-600;
}

.unsaved-changes {
  @apply flex items-center gap-2 text-sm text-amber-600;
}

.form-buttons {
  @apply flex items-center gap-3;
}

.btn-ghost,
.btn-primary {
  @apply inline-flex items-center gap-2;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .form-actions {
    @apply flex-col items-stretch;
  }
  
  .form-buttons {
    @apply justify-end;
  }
}
</style>

<style>
@reference "tailwindcss";

.pdp {
  @apply h-[42px];
}

.pdp-group {
  @apply h-full!;
}

.pdp-input {
  @apply h-full! rounded-lg! border-gray-200!;
}

.pdp-icon {
  @apply h-full! max-h-none!;
}
</style>
