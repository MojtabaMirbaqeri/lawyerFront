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
                  { id: 'percent', label: 'درصدی' },
                ]" />
            </template>
          </UICInput>

          <UICInput v-model="state.value" name="value" label="مقدار" type="number" />

          <UICInput name="is_active" label="وضعیت">
            <template #input>
              <UICSelect
                v-model="state.is_active"
                :items="[
                  { id: true, label: 'فعال' },
                  { id: false, label: 'غیرفعال' },
                ]" />
            </template>
          </UICInput>

          <UICInput name="expires_at" label="تاریخ انقضا">
            <template #input>
              <PersianDate v-model="state.expires_at" :column="1" mode="single">
                <template #icon>
                  <UIcon name="solar:calendar-linear" class="h-full! w-5!" />
                </template>
              </PersianDate>
            </template>
          </UICInput>

          <UICInput
            v-model="state.usage_limit"
            name="usage_limit"
            label="سقف استفاده"
            type="number" />
        </div>

        <UICSecondaryBtn type="submit"> ایجاد کپن </UICSecondaryBtn>
      </UForm>
    </div>
  </section>
</template>

<script setup>
import { object, string, boolean } from "yup";
import PersianDate from "@alireza-ab/vue3-persian-datepicker";


const state = reactive({
  code: "",
  type: "",
  value: "",
  is_active: true,
  expires_at: "",
  usage_limit: "",
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
    .matches(/^\d{4}-\d{2}-\d{2}$/, "تاریخ انقضای وارد شده نامعتبر است"),
  usage_limit: string()
    .required("سقف استفاده الزامی است")
    .matches(/^\d+$/, "مقدار باید عدد باشد"),
});

const onSubmit = async () => {
  const body = {
    code: state.code,
    type: state.type,
    value: Number(state.value),
    is_active: state.is_active,
    expires_at: new Date(state.expires_at),
    usage_limit: Number(state.usage_limit),
  };

  const res = await usePost({
    url: "coupons",
    includeAuthHeader: true,
    body,
  });
  if (res.statusCode === 201 || res.statusCode === 200) {
    useToast().add({
      title: "کپن با موفقیت ایجاد شد",
      color: "success",
    });
    navigateTo("/dashboard/admin/coupons");
  } else {
    useToast().add({
      title: "ایجاد کپن با خطا مواجه شد",
      color: "error",
    });
  }
};
</script>
