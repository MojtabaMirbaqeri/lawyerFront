<template>
  <div>
    <div v-if="isInitialLoading" class="space-y-12">
      <section>
        <USkeleton class="h-8 w-48 mb-6" />
        <div class="ds-form-grid">
          <USkeleton v-for="i in 6" :key="i" class="h-10 w-full" />
        </div>
        <USkeleton class="h-10 w-40 mt-4" />
        <div class="ds-table-con mt-6">
          <USkeleton v-for="i in 2" :key="i" class="h-8 w-full" />
        </div>
      </section>

      <section>
        <USkeleton class="h-8 w-48 mb-6" />
        <div class="space-y-3">
          <USkeleton v-for="i in 3" :key="i" class="h-10 w-full max-w-[400px]" />
        </div>
        <USkeleton class="h-10 w-40 mt-4" />
      </section>

      <section>
        <USkeleton class="h-8 w-48 mb-6" />
        <div class="space-y-2">
          <USkeleton v-for="i in 6" :key="i" class="h-12 w-full rounded-lg" />
        </div>
      </section>
    </div>

    <div v-else class="space-y-12">
      <section>
        <h2 class="text-xl font-bold mb-4 pb-2 border-b border-gray-200">
          اطلاعات محل کار
        </h2>
        <UForm
          :schema="workplaceSchema"
          :state="workplaceState"
          class="ds-form"
          @submit="onWorkplaceSubmit">
          <div class="ds-form-grid">
            <UICInput v-model="workplaceState.name" name="name" label="نام محل کار" />
            <UICInput name="province_id" label="استان">
              <template #input>
                <UICSelect
                  v-model="workplaceState.province_id"
                  :items="provinces"
                  :disabled="isFetchingProvinces" />
              </template>
            </UICInput>
            <UICInput name="city_id" label="شهر">
              <template #input>
                <UICSelect
                  v-model="workplaceState.city_id"
                  :items="cities"
                  :disabled="isCitySelectDisabled" />
              </template>
            </UICInput>
            <UICInput
              v-model="workplaceState.address"
              name="address"
              label="آدرس محل کار"
              custom-class="md:col-span-3" />
            <UICInput v-model="workplaceState.phone" name="phone" label="تلفن ثابت (اختیاری)" />
            <UICInput
              v-model="workplaceState.emergency_phone"
              name="emergency_phone"
              label="تلفن اضطراری" />
          </div>
          <DashboardLawyerGetLocation
            v-model="workplaceLocation"
            class="h-[250px]! w-full rounded-[8px] overflow-hidden" />
          <UICSecondaryBtn type="submit" :disabled="isWorkplaceLoading">
            {{ isWorkplaceLoading ? "در حال افزودن..." : "افزودن محل کار" }}
          </UICSecondaryBtn>
        </UForm>

        <UICDataTable class="mt-6" :columns="workplaceColumns" :data="workplacesList" />
      </section>

      <hr class="text-gray-200" >

      <section>
        <h2 class="text-xl font-bold mb-4 pb-2 border-b border-gray-200">
          قیمت گذاری مشاوره
        </h2>
        <UForm class="ds-form" @submit="onPricingSubmit">
          <div class="w-full lg:max-w-[400px] space-y-4">
            <div class="space-y-1">
              <UICInput
                :model-value="pricingDisplay.phone"
                name="phone"
                placeholder="قیمت مشاوره تلفنی (تومان)"
                label="قیمت مشاوره تلفنی (تومان)"
                @update:model-value="(val) => handlePriceInput('phone', val)" />
              <p v-if="pricingDisplay.phone" class="text-xs text-gray-600 pr-1">
                {{ numberToWords(pricingDisplay.phone) }}
              </p>
            </div>
            <div class="space-y-1">
              <UICInput
                :model-value="pricingDisplay.chat"
                name="chat"
                placeholder="قیمت مشاوره چت آنلاین (تومان)"
                label="قیمت مشاوره چت آنلاین (تومان)"
                @update:model-value="(val) => handlePriceInput('chat', val)" />
              <p v-if="pricingDisplay.chat" class="text-xs text-gray-600 pr-1">
                {{ numberToWords(pricingDisplay.chat) }}
              </p>
            </div>
            <div class="space-y-1">
              <UICInput
                :model-value="pricingDisplay.inperson"
                name="inperson"
                placeholder="قیمت مشاوره حضوری (تومان)"
                label="قیمت مشاوره حضوری (تومان)"
                @update:model-value="(val) => handlePriceInput('inperson', val)" />
              <p v-if="pricingDisplay.inperson" class="text-xs text-gray-600 pr-1">
                {{ numberToWords(pricingDisplay.inperson) }}
              </p>
            </div>
          </div>
          <UICSecondaryBtn
            type="submit"
            :disabled="isPricingLoading || !hasPricingChanges">
            {{ isPricingLoading ? "در حال ثبت..." : "ثبت قیمت‌ها" }}
          </UICSecondaryBtn>
        </UForm>
      </section>

      <hr class="text-gray-200" >

      <section>
        <h2 class="text-xl font-bold mb-4 pb-2 border-b border-gray-200">
          ساعات کاری هفتگی
        </h2>
        <UForm
          :schema="scheduleSchema"
          :state="weeklyScheduleState"
          @submit="onScheduleSubmit">
          <div class="space-y-3">
            <UAccordion :items="weeklyScheduleState">
              <template
                v-for="(day, index) in weeklyScheduleState"
                :key="day.day_of_week"
                v-slot:[day.slot]>
                <div class="p-4 space-y-4 bg-gray-50/50">
                  <div
                    v-for="type in consultationTypes"
                    :key="type.key"
                    class="space-y-3">
                    <div class="flex items-center gap-x-3">
                      <USwitch
                        v-model="
                          weeklyScheduleState[index].schedules[type.key].enabled
                        " />
                      <label class="font-medium">{{ type.label }}</label>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-9">
                      <UICTimePicker
                        v-model="
                          weeklyScheduleState[index].schedules[type.key].start_time
                        "
                        label="ساعت شروع"
                        :disabled="!day.schedules[type.key].enabled" />
                      <UICTimePicker
                        v-model="weeklyScheduleState[index].schedules[type.key].end_time"
                        label="ساعت پایان"
                        :disabled="!day.schedules[type.key].enabled" />
                    </div>
                  </div>
                </div>
              </template>
            </UAccordion>
          </div>
          <UICSecondaryBtn
            type="submit"
            :disabled="isScheduleLoading"
            class="mt-6 form-secondary-btn">
            {{ isScheduleLoading ? "در حال ثبت..." : "ثبت ساعات کاری" }}
          </UICSecondaryBtn>
        </UForm>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, h, resolveComponent, watch, computed, inject } from "vue";
import { object, string, array, boolean } from "yup";

// -- کامپوننت‌های لازم برای جدول --
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

// -- Props --
const props = defineProps({
  lawyerInformation: {
    type: Object,
    required: true,
  },
});

// -- متغیرهای State --
const toast = useToast();
const reFetchLawyer = inject("reFetchLawyerInformation");
const isInitialLoading = ref(true);
const { formatNumber, parseNumber, numberToWords } = useNumberFormat();

// -- State بخش محل کار --
const workplacesList = ref([]);
const workplaceState = reactive({
  name: "",
  province_id: "",
  city_id: "",
  address: "",
  phone: "",
  emergency_phone: "",
});
const isWorkplaceLoading = ref(false);
const provinces = ref([]);
const cities = ref([]);
const isFetchingProvinces = ref(false);
const isFetchingCities = ref(false);
const UICTruncatePopover = resolveComponent("UICTruncatePopover");
const workplaceLocation = ref([]);

const isCitySelectDisabled = computed(() => {
  return !workplaceState.province_id || isFetchingCities.value;
});

// -- State بخش ساعات کاری --
const weeklyScheduleState = ref([]);
const isScheduleLoading = ref(false);

const consultationTypes = [
  { key: "inperson", label: "مشاوره حضوری" },
  { key: "phone", label: "مشاوره تلفنی" },
  { key: "chat", label: "مشاوره چت" },
];

// -- State بخش قیمت گذاری --
const pricingState = reactive({
  phone: props.lawyerInformation.consultation_price_phone || "",
  chat: props.lawyerInformation.consultation_price_chat || "",
  inperson: props.lawyerInformation.consultation_price_inperson || "",
});
const initialPricingState = reactive({
  phone: props.lawyerInformation.consultation_price_phone || "",
  chat: props.lawyerInformation.consultation_price_chat || "",
  inperson: props.lawyerInformation.consultation_price_inperson || "",
});
const isPricingLoading = ref(false);

// Display values با فرمت سه رقمی
const pricingDisplay = reactive({
  phone: formatNumber(props.lawyerInformation.consultation_price_phone || ""),
  chat: formatNumber(props.lawyerInformation.consultation_price_chat || ""),
  inperson: formatNumber(props.lawyerInformation.consultation_price_inperson || ""),
});

const hasPricingChanges = computed(() => {
  return (
    pricingState.phone !== initialPricingState.phone ||
    pricingState.chat !== initialPricingState.chat ||
    pricingState.inperson !== initialPricingState.inperson
  );
});

// هندلر برای فرمت کردن اعداد
const handlePriceInput = (field, value) => {
  const formatted = formatNumber(value);
  pricingDisplay[field] = formatted;
  pricingState[field] = parseNumber(formatted);
};

// -- منطق Fetch اولیه داده‌ها --
async function fetchInitialData() {
  try {
    const [workplacesRes, scheduleRes] = await Promise.all([
      useGet({ url: "workplaces", includeAuthHeader: true }),
      useGet({ url: "lawyer_schedules/weekly", includeAuthHeader: true }),
    ]);

    if (workplacesRes.status) workplacesList.value = workplacesRes.data.data || [];

    const defaultWeek = [
      { day_of_week: 0, label: "شنبه" },
      { day_of_week: 1, label: "یکشنبه" },
      { day_of_week: 2, label: "دوشنبه" },
      { day_of_week: 3, label: "سه‌شنبه" },
      { day_of_week: 4, label: "چهارشنبه" },
      { day_of_week: 5, label: "پنج‌شنبه" },
    ];

    const apiSchedule = scheduleRes.status ? scheduleRes.data.weekly_schedule : [];

    weeklyScheduleState.value = defaultWeek.map((day) => {
      const apiDayData = apiSchedule.find((d) => d.day_of_week == day.day_of_week);
      const schedules = {};

      consultationTypes.forEach((type) => {
        const scheduleData = apiDayData?.schedules?.[type.key]?.[0];
        schedules[type.key] = {
          enabled: !!scheduleData,
          start_time: scheduleData?.start_time?.slice(0, 5) || "",
          end_time: scheduleData?.end_time?.slice(0, 5) || "",
        };
      });

      return {
        ...day,
        schedules,
        slot: `day-${day.day_of_week}`,
        defaultOpen: day.day_of_week === 0,
      };
    });
  } catch (error) {
    console.error("Failed to fetch initial data:", error);
    toast.add({ description: "خطا در دریافت اطلاعات اولیه.", color: "error" });
  } finally {
    isInitialLoading.value = false;
  }
}

// -- منطق مربوط به استان و شهر --
async function fetchProvinces() {
  isFetchingProvinces.value = true;
  try {
    const provincesRes = await fetch("/provinces.json");
    const rawProvinces = await provincesRes.json();
    provinces.value = (rawProvinces || []).map((p) => ({
      id: String(p.id),
      label: p.name,
    }));

    if (!workplaceState.province_id && provinces.value.length) {
      const tehran = provinces.value.find((p) => p.label === "تهران");
      if (tehran) {
        workplaceState.province_id = tehran.id;
      } else {
        workplaceState.province_id = provinces.value[0].id;
      }
    }
  } catch (err) {
    console.error("fetch provinces error:", err);
  } finally {
    isFetchingProvinces.value = false;
  }
}

async function fetchCities(provinceId) {
  if (!provinceId) {
    return;
  }
  isFetchingCities.value = true;
  try {
    const res = await useGet({ url: `area/citiesByProvincesId/${provinceId}` });
    cities.value = (res.data || []).map((c) => ({
      id: String(c.id),
      label: c.name,
    }));
    if (!cities.value.find((c) => c.id == workplaceState.city_id)) {
      workplaceState.city_id = cities.value.length ? cities.value[0].id : "";
    }
  } catch (err) {
    console.error("fetchCities error:", err);
    cities.value = [];
    workplaceState.city_id = "";
  } finally {
    isFetchingCities.value = false;
  }
}

watch(
  () => workplaceState.province_id,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      workplaceState.city_id = "";
      fetchCities(newVal);
    }
  }
);

fetchInitialData();
fetchProvinces();

// ======== بخش محل کار ========
const workplaceSchema = object({
  name: string().required("نام محل کار الزامی است"),
  province_id: string().required("استان الزامی است"),
  city_id: string().required("شهر الزامی است"),
  address: string().required("آدرس الزامی است"),
  emergency_phone: string(),
});

// ======== بخش قیمت گذاری ========
async function onPricingSubmit() {
  isPricingLoading.value = true;

  const formDataToSend = new FormData();
  formDataToSend.append("consultation_price_phone", pricingState.phone);
  formDataToSend.append("consultation_price_chat", pricingState.chat);
  formDataToSend.append("consultation_price_inperson", pricingState.inperson);

  try {
    const res = await usePost({
      url: "lawyers/updateProfile",
      includeAuthHeader: true,
      body: formDataToSend,
    });

    if (res.statusCode == 200) {
      toast.add({
        description: "قیمت‌ها با موفقیت به‌روزرسانی شد.",
        color: "success",
      });

      // آپدیت initial values
      initialPricingState.phone = pricingState.phone;
      initialPricingState.chat = pricingState.chat;
      initialPricingState.inperson = pricingState.inperson;

      await reFetchLawyer();
    } else {
      toast.add({ description: "خطا در به‌روزرسانی قیمت‌ها.", color: "error" });
    }
  } catch (err) {
    console.error("Pricing submit error:", err);
    toast.add({ description: "خطای سرور.", color: "error" });
  } finally {
    isPricingLoading.value = false;
  }
}

async function onWorkplaceSubmit(event) {
  isWorkplaceLoading.value = true;
  const body = {
    ...event.data,
    // تبدیل string به number برای ارسال به backend
    province_id: parseInt(event.data.province_id),
    city_id: parseInt(event.data.city_id),
    work_times: [],
    lat: workplaceLocation?.value[0],
    lng: workplaceLocation?.value[1],
  };
  try {
    const res = await usePost({
      url: "workplaces",
      includeAuthHeader: true,
      body,
    });
    if (res.status && res.data.data) {
      toast.add({
        description: "محل کار با موفقیت افزوده شد.",
        color: "success",
      });
      workplacesList.value.push(res.data.data);

      // ریست کردن فرم با حفظ province و city
      const currentProvinceId = workplaceState.province_id;
      const currentCityId = workplaceState.city_id;

      Object.assign(workplaceState, {
        name: "",
        address: "",
        phone: "",
        emergency_phone: "",
        province_id: currentProvinceId, // حفظ استان انتخاب شده
        city_id: currentCityId, // حفظ شهر انتخاب شده
      });
    } else {
      toast.add({ description: "خطا در افزودن محل کار.", color: "error" });
    }
  } catch (err) {
    console.error("Workplace submit error:", err);
    toast.add({ description: "خطای سرور.", color: "error" });
  } finally {
    isWorkplaceLoading.value = false;
  }
}

async function handleWorkplaceDelete(id) {
  const res = await useDelete({
    url: `workplaces/${id}`,
    includeAuthHeader: true,
  });
  if (res.status) {
    workplacesList.value = workplacesList.value.filter((item) => item.id !== id);
    toast.add({ description: "محل کار با موفقیت حذف شد.", color: "success" });
  } else {
    toast.add({ description: res.message || "خطا در حذف آیتم.", color: "error" });
  }
}

const workplaceColumns = [
  { accessorKey: "name", header: "نام محل کار" },
  {
    key: "province",
    header: "استان",
    cell: ({ row }) => row.original.province?.name,
  },
  { key: "city", header: "شهر", cell: ({ row }) => row.original.city?.name },
  {
    accessorKey: "address",
    header: "آدرس",
    cell: ({ row }) => {
      return h(UICTruncatePopover, {
        text: row.getValue("address"),
      });
    },
  },
  { accessorKey: "phone", header: "تلفن" },
  {
    id: "actions",
    cell: ({ row }) =>
      h(
        "div",
        {},
        h(
          UDropdownMenu,
          {
            items: [
              [
                {
                  label: "حذف",
                  icon: "i-heroicons-trash-20-solid",
                  onSelect: () => handleWorkplaceDelete(row.original.id),
                },
              ],
            ],
          },
          () =>
            h(UButton, {
              icon: "i-heroicons-ellipsis-vertical",
              color: "gray",
              variant: "ghost",
            })
        )
      ),
  },
];

// ======== بخش ساعات کاری ========
const scheduleSchema = array().of(
  object().shape({
    schedules: object().shape({
      inperson: object().shape({
        enabled: boolean(),
        start_time: string().when("enabled", {
          is: true,
          then: (schema) =>
            schema
              .required("ساعت شروع الزامی است")
              .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "فرمت نامعتبر"),
          otherwise: (schema) => schema.optional(),
        }),
        end_time: string().when("enabled", {
          is: true,
          then: (schema) =>
            schema
              .required("ساعت پایان الزامی است")
              .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "فرمت نامعتبر"),
          otherwise: (schema) => schema.optional(),
        }),
      }),
      phone: object().shape({
        enabled: boolean(),
        start_time: string().when("enabled", {
          is: true,
          then: (schema) =>
            schema
              .required("ساعت شروع الزامی است")
              .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "فرمت نامعتبر"),
          otherwise: (schema) => schema.optional(),
        }),
        end_time: string().when("enabled", {
          is: true,
          then: (schema) =>
            schema
              .required("ساعت پایان الزامی است")
              .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "فرمت نامعتبر"),
          otherwise: (schema) => schema.optional(),
        }),
      }),
      chat: object().shape({
        enabled: boolean(),
        start_time: string().when("enabled", {
          is: true,
          then: (schema) =>
            schema
              .required("ساعت شروع الزامی است")
              .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "فرمت نامعتبر"),
          otherwise: (schema) => schema.optional(),
        }),
        end_time: string().when("enabled", {
          is: true,
          then: (schema) =>
            schema
              .required("ساعت پایان الزامی است")
              .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "فرمت نامعتبر"),
          otherwise: (schema) => schema.optional(),
        }),
      }),
    }),
  })
);

async function onScheduleSubmit() {
  isScheduleLoading.value = true;
  const payload = { schedules: [] };

  weeklyScheduleState.value.forEach((day) => {
    consultationTypes.forEach((type) => {
      const schedule = day.schedules[type.key];
      if (schedule.enabled && schedule.start_time && schedule.end_time) {
        payload.schedules.push({
          day_of_week: day.day_of_week,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          type: type.key,
        });
      }
    });
  });

  try {
    const res = await usePost({
      url: "lawyer_schedules/weekly",
      includeAuthHeader: true,
      body: payload,
    });
    if (res.status) {
      toast.add({
        description: "ساعات کاری با موفقیت ثبت شد.",
        color: "success",
      });
    } else {
      toast.add({ description: "خطا در ثبت ساعات کاری.", color: "error" });
    }
  } catch (err) {
    console.error("Schedule submit error:", err);
    toast.add({ description: "خطای سرور.", color: "error" });
  } finally {
    isScheduleLoading.value = false;
  }
}
</script>
