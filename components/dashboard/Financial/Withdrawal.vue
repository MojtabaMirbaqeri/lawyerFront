<template>
  <div>
    <div v-if="isInitialLoading">
      <div class="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <div class="lg:col-span-2">
          <div
            class="space-y-4 border border-gray-200 rounded-lg p-6 bg-gray-50 dark:bg-gray-800/50"
          >
            <USkeleton class="h-8 w-1/2" />
            <USkeleton class="h-12 w-full" />
            <USkeleton class="h-10 w-full" />
            <USkeleton class="h-24 w-full" />
            <USkeleton class="h-12 w-full" />
          </div>
        </div>
        <div class="lg:col-span-4">
          <USkeleton class="h-12 w-full rounded-t-lg" />
          <div class="mt-1 space-y-3 border border-gray-200 rounded-b-lg p-4">
            <USkeleton v-for="i in 4" :key="i" class="h-8 w-full" />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 xl:grid-cols-6 gap-8 items-start">
      <section
        class="xl:col-span-2 order-1 xl:order-2 bg-gray-50 border border-gray-100 rounded-lg p-4 lg:p-6 space-y-4"
      >
        <div class="space-y-1">
          <h2 class="text-xl font-bold">درخواست برداشت</h2>
          <div
            class="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <span class="text-sm text-gray-600">موجودی:</span>
            <span class="text-lg font-semibold text-blue-600 dark:text-blue-400"
              >{{ walletBalance.toLocaleString() }}
              <span class="text-sm">تومان</span></span
            >
          </div>
        </div>

        <UForm
          ref="withdrawForm"
          :schema="schema"
          :state="state"
          class="ds-form"
          @submit="onSubmit"
        >
          <div class="w-full relative">
            <UICInput
              v-model="state.amount"
              type="number"
              placeholder="حداقل ۱۰۰,۰۰۰ تومان"
              name="amount"
              label="مبلغ (تومان)"
            />
            <span
              class="text-[#1e3a5f] text-sm absolute end-0 top-full cursor-pointer mt-0.5"
              @click="fillWithFullBalance"
              >همه موجودی</span
            >
          </div>

          <UICInput name="bank_card_id" label="واریز به کارت">
            <template #input>
              <div class="flex flex-col sm:flex-row items-stretch gap-2">
                <USelectMenu
                  v-model="state.bank_card_id"
                  :items="bankCards"
                  value-key="id"
                  label-key="card_number"
                  class="flex-grow"
                  placeholder="یک کارت را انتخاب کنید"
                  size="lg"
                  :ui="{
                    itemLabel: 'w-full',
                    value: 'ltr-force',
                    itemTrailingIcon: 'hidden!',
                  }"
                >
                  <template #item-label="{ item }">
                    <div class="flex items-center justify-between w-full">
                      <span class="flex items-center gap-1">
                        <span v-html="useGetBankLogo(item?.card_number)"></span>
                        {{ item?.bank_name }}
                      </span>
                      <span style="direction: ltr !important">{{
                        item?.card_number
                      }}</span>
                    </div>
                  </template>
                  <template #leading="{ modelValue }">
                    <span class="flex items-center gap-1">
                      <span
                        v-html="
                          useGetBankLogo(
                            bankCards.find((c) => c.id === modelValue)
                              ?.card_number
                          )
                        "
                      ></span>
                    </span>
                  </template>
                </USelectMenu>
                <UButton
                  class="justify-center border border-blue-200 px-2.5"
                  icon="i-heroicons-plus"
                  variant="soft"
                  size="lg"
                  @click="emit('addCard')"
                >
                  <span class="sm:hidden"> افزودن حساب </span>
                </UButton>
              </div>
            </template>
          </UICInput>

          <div class="">
            <h2 class="font-bold">حواله پایا</h2>
            <div class="text-xs text-gray-500 mt-1">
              حواله پایا پس از تایید از طرف بانک مرکزی به حساب شما واریز خواهد
              شد. زمان واریز میتواند تا ۷۲ ساعت کاری طول بکشد.
            </div>
            <div
              class="text-xs text-gray-600 dark:text-gray-400 space-y-1 pt-2"
            >
              <p>
                * حداقل مبلغ قابل برداشت:
                <strong>{{ MIN_AMOUNT.toLocaleString() }} تومان</strong>
              </p>
              <p>
                * حداکثر مبلغ قابل برداشت:
                <strong>{{ MAX_AMOUNT.toLocaleString() }} تومان</strong>
              </p>
            </div>
          </div>

          <UICSecondaryBtn
            type="submit"
            :disabled="isLoading"
            class="w-full! !py-3 !text-base"
          >
            {{ isLoading ? "در حال ثبت..." : "ثبت درخواست" }}
          </UICSecondaryBtn>
        </UForm>
      </section>

      <section class="xl:col-span-4 order-2 xl:order-2">
        <UICDataTable
          v-model="page"
          :columns="columns"
          :data="withdrawalRequests"
          :total="total"
          :ui="{ thead: 'bg-primary' }"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { h, resolveComponent } from "vue";
import { object, number, string } from "yup";
import { toJalaali } from "jalaali-js";

const withdrawForm = ref(null);

// -- تعریف Event برای باز کردن Drawer --
const emit = defineEmits(["addCard"]);

// -- کامپوننت‌های لازم برای جدول --
const UBadge = resolveComponent("UBadge");

// -- متغیرهای State --
const toast = useToast();
const isInitialLoading = ref(true);
const isLoading = ref(false);

// State فرم
const MIN_AMOUNT = 100000;
const MAX_AMOUNT = 50000000;
const walletBalance = ref(0);
const state = reactive({
  amount: "",
  bank_card_id: null,
});

// State جدول
const withdrawalRequests = ref([]);
const bankCards = ref([]);
const page = ref(1);
const total = ref(0);

// -- منطق Fetch اولیه داده‌ها --
async function refetch(newPage = 1) {
  // این شرط باعث میشه اسکلتون فقط در اولین بارگذاری نمایش داده بشه
  if (page.value === 1 && !withdrawalRequests.value.length)
    isInitialLoading.value = true;

  try {
    const requestsPromise = useGet({
      url: "withdrawal-requests/lawyer/pending",
      includeAuthHeader: true,
      query: { page: newPage },
    });
    const cardsPromise = useGet({ url: "bank-cards", includeAuthHeader: true });
    const walletPromise = useGet({ url: "wallet", includeAuthHeader: true });

    const [requestsRes, cardsRes, walletRes] = await Promise.all([
      requestsPromise,
      cardsPromise,
      walletPromise,
    ]);

    // --[FIXED]--: اصلاح مسیرهای دسترسی به داده‌ها
    if (requestsRes.status) {
      withdrawalRequests.value = requestsRes.data.data.data || [];
      total.value = requestsRes.data.data.total || 0;
    }
    if (cardsRes.status) {
      bankCards.value = cardsRes.data.data || [];
      console.log(bankCards.value[0]);
      if (!state.bank_card_id) {
        const defaultCard = bankCards.value.find((c) => c.is_default);
        if (defaultCard) state.bank_card_id = defaultCard.id;
      }
    }
    if (walletRes.status) {
      walletBalance.value =
        Number(walletRes.data.data.withdrawable_amount) || 0;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    toast.add({ description: "خطا در دریافت اطلاعات.", color: "error" });
  } finally {
    isInitialLoading.value = false;
  }
}

watch(page, (newPage) => refetch(newPage));
refetch(1); // فراخوانی اولیه

// -- ولیدیشن و Submit فرم --
const schema = object({
  amount: number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("مبلغ الزامی است")
    .min(
      MIN_AMOUNT,
      `حداقل مبلغ برداشت ${MIN_AMOUNT.toLocaleString()} تومان است`
    )
    .max(
      MAX_AMOUNT,
      `حداکثر مبلغ برداشت ${MAX_AMOUNT.toLocaleString()} تومان است`
    ),
  bank_card_id: string().required("انتخاب کارت بانکی الزامی است"),
});

function fillWithFullBalance() {
  state.amount = walletBalance.value;
  withdrawForm.value?.validate();
}

async function onSubmit(event) {
  isLoading.value = true;
  try {
    const res = await usePost({
      url: "withdrawal-requests",
      includeAuthHeader: true,
      body: event.data,
    });
    if (res.status && res.data.data) {
      toast.add({
        description: "درخواست برداشت با موفقیت ثبت شد.",
        color: "success",
      });

      // برای آپدیت شدن لیست و موجودی، همه چیز را دوباره fetch می‌کنیم
      await refetch(1);
      page.value = 1;

      state.amount = ""; // ریست کردن فرم
    } else {
      toast.add({
        description: res.message || res.data?.message || "خطا در ثبت درخواست.",
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

// -- ابزارهای جدول --
function formatDateTime(isoString) {
  if (!isoString) return "-";
  const date = new Date(isoString);
  const jDate = toJalaali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  const formattedJDate = `${jDate.jy}/${String(jDate.jm).padStart(
    2,
    "0"
  )}/${String(jDate.jd).padStart(2, "0")}`;

  const time = new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return `${formattedJDate} - ${time}`;
}

const columns = [
  {
    accessorKey: "id",
    header: "شناسه",
    cell: ({ row }) =>
      h("span", { class: "font-mono" }, `#${row.getValue("id")}`),
  },
  {
    accessorKey: "status",
    header: "وضعیت",
    cell: () =>
      h(UBadge, { variant: "soft", color: "warning" }, () => "در حال انتظار"),
  },
  {
    accessorKey: "amount",
    header: "مبلغ",
    cell: ({ row }) =>
      `${Number(row.getValue("amount")).toLocaleString()} تومان`,
  },
  {
    key: "bank_card.bank_name",
    header: "بانک مقصد",
    cell: ({ row }) => row.original.bank_card?.bank_name || "-",
  },
  {
    accessorKey: "created_at",
    header: "تاریخ",
    cell: ({ row }) => formatDateTime(row.getValue("created_at")),
  },
];
</script>