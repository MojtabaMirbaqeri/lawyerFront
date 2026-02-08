<template>
  <div>
    <div v-if="isInitialLoading">
      <USkeleton class="h-8 w-48 mb-6" />
      <div class="ds-form-grid">
        <USkeleton v-for="i in 5" :key="i" class="h-10 w-full" />
      </div>
      <USkeleton class="h-10 w-40 mt-4" />
      <div class="mt-8 border border-gray-200 rounded-lg p-4 space-y-3">
        <USkeleton v-for="i in 2" :key="i" class="h-8 w-full" />
      </div>
    </div>

    <section v-else>
      <h2 class="text-xl font-bold mb-4 pb-2 border-b border-gray-200">
        مدیریت کارت‌های بانکی
      </h2>
      <UForm :schema="schema" :state="state" class="ds-form" @submit="onSubmit">
        <div class="ds-form-grid">
          <UICInput
            v-model="state.card_holder_name"
            name="card_holder_name"
            label="نام دارنده کارت" />
          <UICInput name="card_number" label="شماره کارت">
            <template #input>
              <UInput
                v-model="state.card_number"
                style="direction: ltr !important"
                class="w-full"
                :ui="{ base: 'field-base' }"
                placeholder="XXXX XXXX XXXX XXXX"
                maxlength="19" />
              <div class="absolute top-1/2 start-0 -translate-y-1/2 px-2.5">
                <span
                  v-html="useGetBankLogo(state.card_number?.replace(/\s/g, ''))"/>
              </div>
            </template>
          </UICInput>

          <UICInput name="sheba_number" label="شماره شبا">
            <template #input>
              <UInput
                v-model="state.sheba_number"
                style="direction: ltr !important"
                class="w-full"
                :ui="{ base: 'field-base' }"
                placeholder="XXXXXXXXXXXXXXXXXXXXXXXX"
                maxlength="24">
                <template #trailing>
                  <span class="text-gray-500 dark:text-gray-400 text-sm">IR</span>
                </template>
                <template #leading/>
              </UInput>
            </template>
          </UICInput>
        </div>
        <UICSecondaryBtn type="submit" :disabled="isLoading">
          {{ isLoading ? "در حال افزودن..." : "افزودن کارت" }}
        </UICSecondaryBtn>
      </UForm>

      <div class="mt-8">
        <UICDataTable :columns="columns" :data="bankCards" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { h, resolveComponent } from "vue";
import { getBankByCardNumber } from "iranian-bank-list";
import { object, string } from "yup";

// -- کامپوننت‌های لازم برای جدول --
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

// -- متغیرهای State --
const toast = useToast();
const isInitialLoading = ref(true);
const isLoading = ref(false);
const bankCards = ref([]);

const state = reactive({
  bank_name: "",
  card_holder_name: "",
  card_number: "",
  sheba_number: "",
});

// -- [FIXED] --: واچر فرمت‌بندی شماره کارت دوباره اضافه شد
watch(
  () => state.card_number,
  (newValue, oldValue) => {
    const digits = newValue.replace(/\D/g, "");
    if (digits.length > 16) {
      state.card_number = oldValue; // اگر از ۱۶ رقم بیشتر شد، به مقدار قبلی برگردان
      return;
    }
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    if (formatted !== newValue) {
      state.card_number = formatted;
    }
  }
);

// -- اسکیما ولیدیشن با Yup --
const schema = object({
  card_holder_name: string().required("نام دارنده کارت الزامی است"),
  card_number: string()
    .required("شماره کارت الزامی است")
    .transform((value) => value.replace(/\s/g, ""))
    .matches(/^\d{16}$/, "شماره کارت باید ۱۶ رقم باشد"),
  sheba_number: string()
    .optional()
    .default("")
    .matches(/^(\d{24})?$/, "شماره شبا در صورت وارد شدن باید ۲۴ رقم باشد"),
});

// -- منطق Fetch و Submit --
async function fetchBankCards() {
  try {
    const res = await useGet({ url: "bank-cards", includeAuthHeader: true });
    if (res.status) {
      bankCards.value = res.data.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch bank cards:", error);
    toast.add({ description: "خطا در دریافت لیست کارت‌ها.", color: "error" });
  } finally {
    isInitialLoading.value = false;
  }
}

async function onSubmit(event) {
  isLoading.value = true;
  const sheba = (event.data.sheba_number || "").trim();
  const payload = {
    bank_name: null,
    card_holder_name: event.data.card_holder_name,
    card_number: event.data.card_number.replace(/\s/g, ""),
    sheba_number: sheba ? `IR${sheba}` : null,
  };
  payload.bank_name = getBankByCardNumber(payload.card_number)?.bank_title;
  try {
    const res = await usePost({
      url: "bank-cards",
      includeAuthHeader: true,
      body: payload,
    });
    if (res.status && res.data.data) {
      toast.add({
        description: "کارت بانکی با موفقیت افزوده شد.",
        color: "success",
      });
      bankCards.value.push(res.data.data);
      Object.assign(state, {
        bank_name: "",
        card_holder_name: "",
        card_number: "",
        sheba_number: "",
      });
    } else {
      toast.add({
        description: res.message || res.data?.message || "خطا در افزودن کارت.",
        color: "error",
      });
    }
  } catch (err) {
    console.error("Submit error:", err);
    toast.add({ description: "خطای سرور.", color: "error" });
  } finally {
    isLoading.value = false;
  }
}

async function handleDelete(id) {
  const res = await useDelete({
    url: `bank-cards/${id}`,
    includeAuthHeader: true,
  });
  if (res.status) {
    bankCards.value = bankCards.value.filter((item) => item.id !== id);
    toast.add({ description: "کارت با موفقیت حذف شد.", color: "success" });
  } else {
    toast.add({ description: res.message || "خطا در حذف آیتم.", color: "error" });
  }
}

fetchBankCards();

// -- تعریف ستون‌های جدول --
const columns = [
  { accessorKey: "bank_name", header: "بانک" },
  { accessorKey: "card_holder_name", header: "نام دارنده" },
  {
    accessorKey: "card_number",
    header: "شماره کارت",
    cell: ({ row }) =>
      h("div", { style: "direction:ltr !important;" }, row.original.card_number),
  },
  {
    accessorKey: "sheba_number",
    header: "شماره شبا",
    cell: ({ row }) =>
      h("div", { style: "direction:ltr !important;" }, row.original.sheba_number),
  },
  {
    id: "actions",
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-center" },
        h(
          UDropdownMenu,
          {
            items: [
              [
                {
                  label: "حذف",
                  icon: "i-heroicons-trash-20-solid",
                  onSelect: () => handleDelete(row.original.id),
                },
              ],
            ],
          },
          () =>
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
