<template>
  <UForm
    :schema="ticketSchema"
    :state="state"
    class="w-full space-y-6"
    @submit="submit"
  >
    <div class="flex flex-col lg:flex-row gap-5">
      <UICInput v-model="state.title" name="title" label="عنوان تیکت" />

      <UICInput name="priority" label="اولویت">
        <template #input>
          <UICSelect
            v-model="state.priority"
            :items="priorities"
            placeholder="انتخاب کنید"
          />
        </template>
      </UICInput>

      <UICInput name="department" label="دپارتمان">
        <template #input>
          <UICSelect
            v-model="state.department"
            :items="departments"
            placeholder="انتخاب کنید"
          />
        </template>
      </UICInput>
    </div>

    <UICInput name="description" label="توضیحات">
      <template #input>
        <UTextarea
          v-model="state.description"
          class="w-full"
          :ui="{ base: 'max-h-[200px]!' }"
          placeholder="توضیحات خود را وارد کنید..."
        />
      </template>
    </UICInput>

    <UICInput name="attachment" label="افزودن پیوست">
      <template #input>
        <div class="w-full flex flex-col items-start">
          <UFileUpload
            v-model="fileModel"
            label="پیوست فایل"
            multiple
            :ui="{
              wrapper: 'flex-row items-center w-[140px]! py-[6px] px-[10px]',
              base: 'p-0 w-[140px]!',
              avatar: 'bg-transparent scale-[1.2]',
              label: 'm-0',
              root: 'lg:flex-row w-fit!',
              fileName: 'hidden lg:block',
              file: 'w-fit gap-1',
              fileSize: 'hidden lg:block',
              files: 'flex-row items-start flex-wrap',
            }"
            icon="line-md:uploading-loop"
            variant="button"
            :disabled="fileModel.length === 4"
            position="outside"
            accept="image/*,.pdf,.txt,.xlsx,.docs,.mp4"
            class="me-auto"
            layout="list"
          />
          <p v-if="fileModel.length > 0" class="mt-2 text-sm text-gray-500">
            حجم کل: {{ totalSizeInMB.toFixed(2) }} مگابایت
          </p>
        </div>
      </template>
    </UICInput>

    <div class="flex justify-end gap-3">
      <UICSecondaryBtn type="button" @click="back">بازگشت</UICSecondaryBtn>
      <UICSecondaryBtn type="submit">ارسال تیکت</UICSecondaryBtn>
    </div>
  </UForm>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { object, string, array } from "yup"; // array را از yup ایمپورت کنید

const fileModel = ref([]);
const filtersStore = useFiltersStore();

const priorities = filtersStore.ticketFilter.priority.slice(1);
const departments = filtersStore.ticketFilter.type.slice(1);

// داده‌های استیت
const state = reactive({
  priority: +priorities[0]?.id,
  department: "financial",
  title: "",
  description: "",
  attachment: fileModel, // اتصال fileModel به state برای اعتبارسنجی
});

// محاسبه حجم کل برای نمایش به کاربر (اختیاری اما برای UX خوب است)
const totalSizeInMB = computed(() => {
  if (!fileModel.value || fileModel.value.length === 0) return 0;
  const totalBytes = fileModel.value.reduce((acc, file) => acc + file.size, 0);
  return totalBytes / (1024 * 1024);
});

// اسکیمای ولیدیشن با قانون سفارشی برای حجم فایل
const ticketSchema = object({
  priority: string().required("انتخاب اولویت الزامی است"),
  department: string().required("انتخاب دپارتمان الزامی است"),
  title: string().required("عنوان تیکت الزامی است"),
  description: string()
    .required("توضیحات الزامی است")
    .min(10, "حداقل ۱۰ کاراکتر وارد کنید"),
  attachment: array().test(
    "fileSize", // نام تست
    "حجم کل فایل‌ها نباید بیشتر از ۱۰ مگابایت باشد.", // پیام خطا
    (files) => {
      // اگر فایلی وجود نداشت، اعتبارسنجی موفق است
      if (!files || files.length === 0) {
        return true;
      }
      // محاسبه مجموع حجم فایل‌ها به بایت
      const totalSize = files.reduce((total, file) => total + file.size, 0);
      const maxSize = 10 * 1024 * 1024; // 10 MB
      // اگر حجم کل کمتر یا مساوی حداکثر حجم مجاز بود، true برگردان
      return totalSize <= maxSize;
    }
  ),
});

// برگشت
const back = () => {
  navigateTo("/dashboard/ticket/tickets");
};

// ارسال
const submit = async (e) => {
  console.log("Ticket Data:", e.data);
  const formData = new FormData();
  formData.append("title", e.data.title);
  formData.append("description", e.data.description);
  formData.append("type", e.data.department);
  formData.append("priority", e.data.priority);
  if (e.data.attachment.length > 0) {
    e.data.attachment.forEach((file) => {
      formData.append("attachments[]", file);
    });
  }

  const res = await usePost({
    url: "tickets",
    includeAuthHeader: true,
    body: formData,
  });
  console.log(res.statusCode);
  
  if (res.statusCode === 200) {
    navigateTo(`/dashboard/ticket/${res.data.data.data.ticket.id}`);
    useToast().add({ title: "تیکت با موفقیت ثبت شد", color: "success" });
  }
  e.data.priority = 1;
};
</script>