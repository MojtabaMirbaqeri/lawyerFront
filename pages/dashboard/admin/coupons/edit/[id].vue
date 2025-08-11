<template>
  <section>
    <div>
      <UForm :schema="schema" :state="state" class="ds-form" @submit="onSubmit">
        <div class="ds-form-grid">
          <UICInput v-model="state.code" name="code" label="کد تخفیف" />

          <UICInput name="type" label="نوع">
            <template #input>
              <UICSelect
                v-model="state.type"
                :items="[
                  { id: 'amount', label: 'مقداری' },
                  { id: 'precent', label: 'درصدی' },
                ]"
              />
            </template>
          </UICInput>

          <UICInput
            v-model="state.value"
            name="value"
            label="مقدار"
            type="number"
          />

          <UICInput name="is_active" label="وضعیت">
            <template #input>
              <UICSelect
                v-model="state.is_active"
                :items="[
                  { id: true, label: 'فعال' },
                  { id: false, label: 'غیرفعال' },
                ]"
              />
            </template>
          </UICInput>

          <UICInput
            v-model="state.expires_at"
            name="expires_at"
            label="تاریخ انقضا"
            type="date"
          />

          <UICInput
            v-model="state.usage_limit"
            name="usage_limit"
            label="سقف استفاده"
            type="number"
          />
        </div>

        <UICSecondaryBtn type="submit" :disabled="!isChanged">
          ویرایش کپن
        </UICSecondaryBtn>
      </UForm>
    </div>
  </section>
</template>

<script setup>
import { object, string, boolean } from "yup";

const route = useRoute();

const { data: initialDetail, statusCode } = await useGet({
  url: `coupons/${route.params?.id}`,
  includeAuthHeader: true,
});

if (statusCode === 404) {
  useToast().add({
    title: "آیدی کپن نامعتبر است!",
    color: "error",
  });
  navigateTo("/dashboard/admin/coupons", { replace: true });
}

// تابع برای فرمت تاریخ
const formatDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const state = reactive({
  code: initialDetail.code,
  type: initialDetail.type,
  value: initialDetail.value,
  is_active: initialDetail.is_active,
  expires_at: formatDate(initialDetail.expires_at),
  usage_limit: initialDetail.usage_limit,
});

const initialState = reactive({ ...state });

const isChanged = computed(() => {
  return Object.keys(state).some((key) => state[key] !== initialState[key]);
});

// ولیدیشن Yup
const schema = object({
  code: string().required("کد تخفیف الزامی است"),
  type: string().required("نوع کپن الزامی است"),
  value: string()
    .required("مقدار کپن الزامی است")
    .matches(/^\d+$/, "مقدار باید عدد باشد"),
  is_active: boolean().required(),
  expires_at: string()
    .required("تاریخ انقضا الزامی است")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "فرمت تاریخ باید YYYY-MM-DD باشد"),
  usage_limit: string()
    .required("سقف استفاده الزامی است")
    .matches(/^\d+$/, "مقدار باید عدد باشد"),
});

const onSubmit = async () => {
  const body = {
    code: state.code,
    type: state.type,
    value: state.value,
    is_active: state.is_active,
    expires_at: state.expires_at,
    usage_limit: state.usage_limit,
  };

  const res = await usePut({
    url: `coupons/${route.params?.id}`,
    includeAuthHeader: true,
    body,
  });

  if (res.statusCode === 200) {
    useToast().add({
      title: "کپن با موفقیت ویرایش شد",
      color: "success",
    });
    Object.assign(initialState, state);
  } else {
    useToast().add({
      title: "ویرایش کپن با خطا مواجه شد",
      color: "error",
    });
  }
};
</script>
