<template>
  <section>
    <div class="ds-container">
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 flex gap-3 justify-between items-start flex-col w-full"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-1 lg:grid-cols-3 w-full gap-6">
          <UICInput
            v-model="state.phone"
            name="phone"
            label="لطفا شماره موبایل را وارد کنید"
            @input="filterDigits"
            maxlength="11"
          />
          <UICInput
            v-model="state.name"
            name="name"
            label="لطفا نام را وارد کنید"
          />
          <UICInput
            v-model="state.lastName"
            name="lastName"
            label="لطفا نام خانوادگی را وارد کنید"
          />
          <div class="">
            <label for="">پایه</label>
            <UICSelect :items="bases" v-model="baseModel" />
          </div>
          <div class="">
            <label for="">تحصیلات</label>
            <UICSelect :items="education" v-model="educationModel" />
          </div>
        </div>

        <UICSecondaryBtn
          class="w-fit rounded-[8px]! h-[46px]"
          type="submit"
        >
          ایجاد وکیل
        </UICSecondaryBtn>
      </UForm>
    </div>
  </section>
</template>

<script setup lang="ts">
import { object, string } from "yup";
import type { InferType } from "yup";
import { ref, reactive, computed } from "vue";

// گرفتن اطلاعات اولیه
const lawyerTypesRes = await useGet({ url: "lawyer_bases" });
const types = lawyerTypesRes.data.data;
const bases = types.map((type) => ({
  id: type.id,
  label: type.title,
}));


// مدل‌ها
const baseModel = ref(bases[0].id);

const education = ref([
  { id: 1, label: "کارشناسی" },
  { id: 2, label: "کارشناسی ارشد" },
  { id: 3, label: "دکتری تخصصی" },
  { id: 4, label: "فوق دکتری" },
]);


const educationModel = ref(education.value[0].id);

const state = reactive({
  phone: undefined,
  name: undefined,
  lastName:undefined,
});

// ✅ اسکیمای اعتبارسنجی
const schema = object({
  phone: string()
    .required("لطفا شماره موبایل را وارد کنید")
    .matches(/^(\+98|0)?9\d{9}$/, "شماره موبایل معتبر نیست")
    .length(11, "شماره موبایل باید دقیقاً 11 رقم باشد"),
  name: string()
    .required("نام خود را وارد کنید")
    .max(20, "حداکثر 20 کاراکتر مجاز است"),
  lastName: string()
    .required("نام خانوادگی خود را وارد کنید")
    .max(25, "حداکثر 25 کاراکتر مجاز است"),
});
type Schema = InferType<typeof schema>;

// فیلتر اعداد در شماره موبایل
function filterDigits(e: Event) {
  const target = e.target as HTMLInputElement;
  target.value = target.value.replace(/\D/g, "");
  state.phone = target.value.slice(0, 11);
}

// ارسال فرم
const onSubmit = async (event) => {
  const body = {
    phone:event.data.phone,
    name: event.data.name,
    family: event.data.lastName,
    base: baseModel.value + "",
    education:
      education.value.find((e) => e.id === educationModel.value)?.label || "",
  };

  const res = await usePost({
    url: `lawyers`,
    includeAuthHeader: true,
    body,
  });

  console.log(res.statusCode);
};
</script>
