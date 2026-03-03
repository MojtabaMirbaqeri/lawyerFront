<template>
  <div class="settings-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">تنظیمات</h1>
        <p class="page-description">تنظیمات عمومی و درصد سود پلتفرم</p>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <p class="text-gray-500">در حال بارگذاری...</p>
    </div>

    <section v-else class="ds-form-section">
      <UForm :schema="schema" :state="state" class="ds-form" @submit="onSubmit">
        <div class="ds-form-grid">
          <UICInput
            v-model="state.site_title"
            name="site_title"
            label="عنوان سایت" />

          <UICInput
            v-model.number="state.platform_commission_percent"
            name="platform_commission_percent"
            label="درصد سود پلتفرم (۰ تا ۱۰۰)"
            type="number"
            min="0"
            max="100" />
        </div>

        <div class="mt-4">
          <UICSecondaryBtn type="submit" :disabled="saving">
            {{ saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات' }}
          </UICSecondaryBtn>
        </div>
      </UForm>
    </section>
  </div>
</template>

<script setup>
import { object, string, number } from "yup";

useHead({
  title: "تنظیمات | وکیل وکیل",
});

const loading = ref(true);
const saving = ref(false);

const state = reactive({
  site_title: "",
  platform_commission_percent: 20,
});

const schema = object({
  site_title: string().required("عنوان سایت الزامی است"),
  platform_commission_percent: number()
    .required("درصد سود پلتفرم الزامی است")
    .min(0, "حداقل ۰")
    .max(100, "حداکثر ۱۰۰")
    .integer("عدد صحیح"),
});

const loadSettings = async () => {
  loading.value = true;
  try {
    const res = await useGet({
      url: "settings",
      includeAuthHeader: true,
    }, false);
    if (res.status && res.data) {
      state.site_title = res.data.site_title ?? "";
      state.platform_commission_percent = res.data.platform_commission_percent ?? 20;
    }
  } finally {
    loading.value = false;
  }
};

onMounted(loadSettings);

const onSubmit = async () => {
  saving.value = true;
  try {
    const body = {
      site_title: state.site_title,
      platform_commission_percent: Math.round(Number(state.platform_commission_percent)),
    };
    const res = await usePost({
      url: "settings",
      includeAuthHeader: true,
      body,
    });
    if (res.statusCode === 200) {
      useToast().add({
        color: "success",
        description: "تنظیمات با موفقیت ذخیره شد.",
      });
    }
  } finally {
    saving.value = false;
  }
};
</script>
