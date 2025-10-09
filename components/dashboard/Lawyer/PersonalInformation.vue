<template>
  <section class="flex space-y-3 flex-col">
    <UForm :schema="schema" :state="state" class="ds-form" @submit="onSubmit">
      <div class="ds-form-grid">
        <!-- نام و نام خانوادگی readonly -->
        <UICInput
          v-model="state.full_name"
          name="full_name"
          label="نام و نام خانوادگی"
          readonly
          disabled />

        <!-- جنسیت -->
        <UICInput name="gender" label="جنسیت">
          <template #input>
            <UICSelect
              v-model="state.gender"
              :items="[
                { id: 'male', label: 'مرد' },
                { id: 'female', label: 'زن' },
              ]" />
          </template>
        </UICInput>

        <!-- نام پدر -->
        <UICInput v-model="state.father_name" name="father_name" label="نام پدر" />

        <!-- تاریخ تولد (شمسی: YYYY/MM/DD) -->
        <UICInput name="birth_date" label="تاریخ تولد (شمسی)">
          <template #input>
            <PersianDate v-model="state.birth_date" :column="1" mode="single">
              <template #icon>
                <UIcon name="solar:calendar-linear" class="h-full! w-5!" />
              </template>
            </PersianDate>
          </template>
        </UICInput>

        <!-- استان -->
        <UICInput name="province_id" label="استان">
          <template #input>
            <UICSelect v-model="state.province_id" :items="provinces" />
          </template>
        </UICInput>

        <!-- شهر -->
        <UICInput name="city_id" label="شهر">
          <template #input>
            <UICSelect v-model="state.city_id" :items="cities" />
          </template>
        </UICInput>
      </div>

      <UICSecondaryBtn type="submit" :disabled="!isChanged || isLoading || isFetching">
        {{ isLoading ? "در حال ارسال..." : "ثبت اطلاعات" }}
      </UICSecondaryBtn>
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
const reFetchLawyer = inject("reFetchLawyerInformation");

const isLoading = ref(false);
const isFetching = ref(false);
const provinces = ref([]);
const cities = ref([]);

const li = props.lawyerInformation?.lawyer_info || {};

const state = reactive({
  full_name: `${props.lawyerInformation.name} ${props.lawyerInformation.family}`,
  gender: li.gender || "male",
  father_name: li.father_name || "",
  birth_date: li.birth_date ? new Date(li.birth_date).toISOString().split("T")[0] : "",
  province_id: li.province_id ? String(li.province_id) : "",
  city_id: li.city_id ? String(li.city_id) : "",
});

const initialState = reactive({ ...state });

const isChanged = computed(() => {
  return ["gender", "father_name", "birth_date", "province_id", "city_id"].some(
    (key) => String(state[key] || "") !== String(initialState[key] || "")
  );
});

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
    .matches(/^\d{4}-\d{2}-\d{2}$/, "تاریخ تولد وارد شده نامعتبر است"),
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
      useToast().add({
        title: "اطلاعات با موفقیت به‌روز شد",
        color: "success",
      });
      Object.assign(initialState, { ...state });
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
<style>
@reference "tailwindcss";
.pdp {
  @apply h-[40px] lg:h-[42px];
}
.pdp-group {
  @apply h-full!;
}
.pdp-input {
  @apply h-full!;
}
.pdp-icon {
  @apply h-full! max-h-none!;
}
</style>
