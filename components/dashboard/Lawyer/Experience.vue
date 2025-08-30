<template>
  <div>
    <div v-if="isInitialLoading" class="space-y-12">
      <section v-for="i in 3" :key="i">
        <USkeleton class="h-8 w-48 mb-6" />

        <div class="ds-form-grid">
          <USkeleton class="h-10 w-full" />
          <USkeleton class="h-10 w-full" />
          <USkeleton class="h-10 w-full" />
          <USkeleton class="h-10 w-full" />
        </div>
        <USkeleton class="h-10 w-40 mt-4" />

        <div class="ds-table-con mt-6">
          <div class="space-y-3">
            <USkeleton class="h-8 w-full" />
            <USkeleton class="h-8 w-full" />
            <USkeleton class="h-8 w-full" />
          </div>
        </div>
      </section>
    </div>

    <div v-else class="space-y-12">
      <section>
        <h2 class="text-xl font-bold mb-4 pb-2">سوابق تحصیلی</h2>
        <UForm
          :schema="educationSchema"
          :state="educationState"
          class="ds-form"
          @submit="onEducationSubmit"
        >
          <div class="ds-form-grid">
            <UICInput name="degree" label="مدرک تحصیلی">
              <template #input>
                <UICSelect
                  v-model="educationState.degree"
                  :items="degreeOptions"
                />
              </template>
            </UICInput>
            <UICInput
              v-model="educationState.field_of_study"
              name="field_of_study"
              label="رشته تحصیلی"
            />
            <UICInput
              v-model="educationState.university"
              name="university"
              label="دانشگاه"
            />
            <UICInput
              v-model="educationState.place_of_study"
              name="place_of_study"
              label="محل تحصیل"
            />
          </div>
          <UICSecondaryBtn
            type="submit"
            :disabled="isEducationLoading"
            class="mt-4"
          >
            {{
              isEducationLoading ? "در حال افزودن..." : "افزودن سابقه تحصیلی"
            }}
          </UICSecondaryBtn>
        </UForm>

        <div class="ds-table-con mt-6">
          <UICDataTable :columns="educationColumns" :data="educationHistory" />
        </div>
      </section>

      <section>
        <h2 class="text-xl font-bold mb-4 pb-2">سوابق کاری</h2>
        <UForm
          :schema="workSchema"
          :state="workState"
          class="ds-form"
          @submit="onWorkSubmit"
        >
          <div class="ds-form-grid">
            <UICInput name="experience_years" label="سابقه کاری">
              <template #input>
                <UICSelect
                  v-model="workState.experience_years"
                  :items="experienceOptions"
                />
              </template>
            </UICInput>
            <UICInput
              v-model="workState.position"
              name="position"
              label="سمت"
            />
            <UICInput
              v-model="workState.organization"
              name="organization"
              label="ارگان / شرکت"
            />
            <UICInput
              v-model="workState.work_place"
              name="work_place"
              label="محل کار"
            />
          </div>
          <UICSecondaryBtn type="submit" :disabled="isWorkLoading" class="mt-4">
            {{ isWorkLoading ? "در حال افزودن..." : "افزودن سابقه کاری" }}
          </UICSecondaryBtn>
        </UForm>

        <div class="ds-table-con mt-6">
          <UICDataTable :columns="workColumns" :data="workHistory" />
        </div>
      </section>

      <section>
        <h2 class="text-xl font-bold mb-4 pb-2">جوایز و افتخارات</h2>
        <UForm
          :schema="awardSchema"
          :state="awardState"
          class="ds-form"
          @submit="onAwardSubmit"
        >
          <div class="ds-form-grid">
            <UICInput
              v-model="awardState.award_name"
              name="award_name"
              label="عنوان افتخار"
            />
            <UICInput
              v-model="awardState.issuing_organization"
              name="issuing_organization"
              label="ارگان / شرکت صادر کننده"
            />
            <UICInput name="image" label="تصویر لوح افتخار">
              <template #input>
                <UFileUpload
                  v-model="awardState.image"
                  class="cursor-pointer"
                  label="انتخاب تصویر"
                  :ui="{
                    wrapper: 'flex-row items-center px-[10px] field-base ',
                    base: 'p-0 border-gray-400',
                    avatar: 'bg-transparent scale-[1.2]',
                    label: 'm-0',
                    fileName: 'hidden lg:block',
                    file: 'w-fit gap-1',
                    fileSize: 'hidden lg:block',
                    files: 'flex-wrap',
                  }"
                  icon="line-md:uploading-loop"
                  variant="area"
                  position="outside"
                  layout="list"
                  accept="image/*"
                />
              </template>
            </UICInput>
          </div>
          <UICSecondaryBtn
            type="submit"
            :disabled="isAwardLoading"
            class="mt-4"
          >
            {{ isAwardLoading ? "در حال افزودن..." : "افزودن افتخار" }}
          </UICSecondaryBtn>
        </UForm>
        <div class="ds-table-con mt-6">
          <UICDataTable :columns="awardColumns" :data="awardsHistory" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, h, resolveComponent } from "vue";
import { object, string, mixed } from "yup";

// -- کامپوننت‌های لازم برای جدول --
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UICPictureModal = resolveComponent("UICPictureModal");

// -- متغیرهای State --
const educationHistory = ref([]);
const workHistory = ref([]);
const awardsHistory = ref([]);

const isEducationLoading = ref(false);
const isWorkLoading = ref(false);
const isAwardLoading = ref(false);

const toast = useToast();

const isInitialLoading = ref(true);

// -- تابع برای گرفتن داده‌های اولیه --
async function fetchInitialData() {
  try {
    const [educationRes, workRes, awardsRes] = await Promise.all([
      useGet({ url: "lawyer/profile/education", includeAuthHeader: true }),
      useGet({
        url: "lawyer/profile/work-experience",
        includeAuthHeader: true,
      }),
      useGet({ url: "lawyer/profile/awards", includeAuthHeader: true }),
    ]);

    if (educationRes.status && educationRes.data)
      educationHistory.value = educationRes.data.data || [];
    if (workRes.status && workRes.data)
      workHistory.value = workRes.data.data || [];
    if (awardsRes.status && awardsRes.data)
      awardsHistory.value = awardsRes.data.data || [];
  } catch (error) {
    console.error("Failed to fetch initial data:", error);
    toast.add({ description: "خطا در دریافت اطلاعات اولیه.", color: "error" });
  } finally {
    isInitialLoading.value = false; // پایان لودینگ و نمایش محتوای اصلی
  }
}

// -- فراخوانی تابع برای شروع گرفتن داده‌ها --
fetchInitialData();
// ======== بخش سوابق تحصیلی ========

const educationState = reactive({
  degree: "bachelor",
  field_of_study: "",
  university: "",
  place_of_study: "",
});

const degreeOptions = [
  { id: "diploma", label: "دیپلم" },
  { id: "bachelor", label: "کارشناسی" },
  { id: "master", label: "کارشناسی ارشد" },
  { id: "phd", label: "دکترا" },
];

const educationSchema = object({
  degree: string().required("مدرک تحصیلی الزامی است"),
  field_of_study: string().required("رشته تحصیلی الزامی است"),
  university: string().required("نام دانشگاه الزامی است"),
  place_of_study: string().required("محل تحصیل الزامی است"),
});

async function onEducationSubmit(event) {
  isEducationLoading.value = true;
  try {
    const res = await usePost({
      url: "lawyer/profile/education",
      includeAuthHeader: true,
      body: event.data,
    });

    // --[FIXED]--: No more refetch. Push the new item from the response directly.
    if (res.status && res.data && res.data.data) {
      toast.add({
        description: "سابقه تحصیلی با موفقیت افزوده شد.",
        color: "success",
      });
      educationHistory.value.push(res.data.data); // اضافه کردن آیتم جدید به لیست
      Object.assign(educationState, {
        degree: "bachelor",
        field_of_study: "",
        university: "",
        place_of_study: "",
      });
    } else {
      toast.add({ description: "خطا در افزودن سابقه تحصیلی.", color: "error" });
    }
  } catch (err) {
    console.error("Education submit error:", err);
    toast.add({ description: "خطای سرور.", color: "error" });
  } finally {
    isEducationLoading.value = false;
  }
}

// ======== بخش سوابق کاری ========

const workState = reactive({
  position: "",
  experience_years: "1-3",
  organization: "",
  work_place: "",
});

const experienceOptions = [
  { id: "0-1", label: "کمتر از یک سال" },
  { id: "1-3", label: "۱ تا ۳ سال" },
  { id: "3-5", label: "۳ تا ۵ سال" },
  { id: "5-10", label: "۵ تا ۱۰ سال" },
  { id: "10+", label: "بیشتر از ۱۰ سال" },
];

const workSchema = object({
  position: string().required("سمت الزامی است"),
  experience_years: string().required("سابقه کاری الزامی است"),
  organization: string().required("نام ارگان الزامی است"),
  work_place: string().required("محل کار الزامی است"),
});

async function onWorkSubmit(event) {
  isWorkLoading.value = true;
  try {
    const res = await usePost({
      url: "lawyer/profile/work-experience",
      includeAuthHeader: true,
      body: event.data,
    });

    // --[FIXED]--: No more refetch. Push the new item from the response directly.
    if (res.status && res.data && res.data.data) {
      toast.add({
        description: "سابقه کاری با موفقیت افزوده شد.",
        color: "success",
      });
      workHistory.value.push(res.data.data); // اضافه کردن آیتم جدید به لیست
      Object.assign(workState, {
        position: "",
        experience_years: "1-3",
        organization: "",
        work_place: "",
      });
    } else {
      toast.add({ description: "خطا در افزودن سابقه کاری.", color: "error" });
    }
  } catch (err) {
    console.error("Work submit error:", err);
    toast.add({ description: "خطای سرور.", color: "error" });
  } finally {
    isWorkLoading.value = false;
  }
}

// ======== بخش جوایز ========
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const awardState = reactive({
  award_name: "",
  issuing_organization: "",
  image: null,
});

const awardSchema = object({
  award_name: string().required("عنوان افتخار الزامی است"),
  issuing_organization: string().required("نام ارگان صادر کننده الزامی است"),
  image: mixed()
    .required("تصویر لوح افتخار الزامی است")
    .test(
      "fileSize",
      "حجم فایل نباید بیشتر از ۵ مگابایت باشد",
      (file) => file && file.size <= MAX_FILE_SIZE
    ),
});

async function onAwardSubmit(event) {
  isAwardLoading.value = true;
  const fd = new FormData();
  fd.append("award_name", event.data.award_name);
  fd.append("issuing_organization", event.data.issuing_organization);
  fd.append("image", event.data.image);

  try {
    const res = await usePost({
      url: "lawyer/profile/awards",
      includeAuthHeader: true,
      body: fd,
    });

    // --[FIXED]--: No more refetch. Push the new item from the response directly.
    if (res.status && res.data && res.data.data) {
      toast.add({
        description: "افتخار با موفقیت افزوده شد.",
        color: "success",
      });
      awardsHistory.value.push(res.data.data); // اضافه کردن آیتم جدید به لیست
      Object.assign(awardState, {
        award_name: "",
        issuing_organization: "",
        image: null,
      });
    } else {
      toast.add({ description: "خطا در افزودن افتخار.", color: "error" });
    }
  } catch (err) {
    console.error("Award submit error:", err);
    toast.add({ description: "خطای سرور.", color: "error" });
  } finally {
    isAwardLoading.value = false;
  }
}

// ======== تعریف ستون‌های جداول و عملیات حذف ========

async function handleDelete(type, id) {
  let url = "";
  let historyRef = null;

  switch (type) {
    case "education":
      url = `lawyer/profile/education/${id}`;
      historyRef = educationHistory;
      break;
    case "work":
      url = `lawyer/profile/work-experience/${id}`;
      historyRef = workHistory;
      break;
    case "award":
      url = `lawyer/profile/awards/${id}`;
      historyRef = awardsHistory;
      break;
  }

  if (!url) return;

  const res = await useDelete({ url, includeAuthHeader: true });
  if (res.status) {
    historyRef.value = historyRef.value.filter((item) => item.id !== id);
    toast.add({ description: "آیتم با موفقیت حذف شد.", color: "success" });
  } else {
    toast.add({ description: "خطا در حذف آیتم.", color: "error" });
  }
}

// تابع ساخت آیتم‌های Dropdown
function getRowItems(type, row) {
  return [
    {
      label: "حذف",
      icon: "solar:trash-bin-minimalistic-outline",
      onSelect: () => handleDelete(type, row.original.id),
    },
  ];
}

// ستون‌های سوابق تحصیلی
const educationColumns = [
  { accessorKey: "degree_text", header: "مدرک" },
  { accessorKey: "field_of_study", header: "رشته" },
  { accessorKey: "university", header: "دانشگاه" },
  { accessorKey: "place_of_study", header: "محل" },
  {
    id: "actions",
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-left" },
        h(UDropdownMenu, { items: getRowItems("education", row) }, () =>
          h(UButton, {
            icon: "i-lucide-ellipsis-vertical",
            color: "neutral",
            variant: "ghost",
          })
        )
      ),
  },
];

// ستون‌های سوابق کاری
const workColumns = [
  { accessorKey: "position", header: "سمت" },
  { accessorKey: "experience_years_text", header: "سابقه" },
  { accessorKey: "organization", header: "ارگان / شرکت" },
  { accessorKey: "work_place", header: "محل کار" },
  {
    id: "actions",
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-left" },
        h(UDropdownMenu, { items: getRowItems("work", row) }, () =>
          h(UButton, {
            icon: "i-lucide-ellipsis-vertical",
            color: "neutral",
            variant: "ghost",
          })
        )
      ),
  },
];

// ستون‌های جوایز
const awardColumns = [
  { accessorKey: "award_name", header: "نام افتخار" },
  { accessorKey: "issuing_organization", header: "صادر کننده" },
  {
    accessorKey: "image_url",
    header: "تصویر",
    cell: ({ row }) =>
      h(UICPictureModal, {
        title: "تصویر لوح افتخار",
        image: row.original.image_url,
      }),
  },
  {
    id: "actions",
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-left" },
        h(UDropdownMenu, { items: getRowItems("award", row) }, () =>
          h(UButton, {
            icon: "i-lucide-ellipsis-vertical",
            color: "neutral",
            variant: "ghost",
          })
        )
      ),
  },
];
</script>