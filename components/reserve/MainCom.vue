<template>
  <div class="container pt-5">
    <h1 v-if="step === 1" class="sec-header mb-3">رزرو نوبت مشاوره</h1>

    <div class="flex lg:gap-3 items-start">
      <div class="shadow-none! w-full right">
        <div v-if="step === 1" class="step1 flex flex-col gap-3">
          <div class="primary-box flex flex-col gap-3 p-5">
            <div class="dates">
              <reserve-select-btn
                v-model="activeDay"
                :items="dateButtons"
                option-label="title"
                option-value="id" />
            </div>

            <div class="controls selectBtnCon">
              <span class="">مدت زمان جلسه:</span>
              <UICSelectButton :items="times" v-model="deftime" />
            </div>

            <div class="slots selectBtnCon">
              <span>انتخاب زمان جلسه:</span>
              <div v-if="slotsLoading" class="text-sm text-slate-500">در حال بارگذاری زمان‌های موجود...</div>
              <template v-else-if="timeSlots.length === 0">
                <p class="text-sm text-slate-500">برای این روز زمانی موجود نیست.</p>
              </template>
              <UICSelectButton v-else v-model="defVisitTime" :items="timeSlots" />
            </div>
          </div>

          <div class="primary-box p-5 flex lg:mb-0 flex-col gap-3">
            <h1 class="sec-header">توضیحات</h1>
            <label for="dis">شرح حال</label>
            <ThingTextarea
              id="dis"
              v-model="dismodel"
              :maxlength="300"
              placeholder="شرح حال خود را برای وکیل بنویسید" />
            <p class="text-sm text-left text-muted-foreground">
              300 / {{ dismodel.length }}
            </p>

            <UFileUpload
              v-model="fileModel"
              label="پیوست فایل"
              multiple
              :ui="{
                wrapper: 'flex-row items-center w-[140px]! py-[6px] px-[10px]',
                base: 'p-0 w-[140px]!',
                avatar: 'bg-transparent scale-[1.2]',
                label: 'm-0',
                root: '',
                fileName: 'hidden lg:block',
                file: 'w-fit gap-1',
                fileSize: 'hidden lg:block',
                files: 'flex-row items-start flex-wrap',
              }"
              icon="line-md:uploading-loop"
              variant="button"
              :disabled="fileModel.length === 4"
              position="outside"
              accept="image/*,.pdf,.txt,.xlsx,.docs"
              class="me-auto"
              layout="list">
            </UFileUpload>
          </div>
        </div>
        <div v-if="step === 2" class="step2 flex flex-col gap-3">
          <UICBackBtn @click="step--" />
          <div v-if="effectiveBookingPolicy" class="primary-box p-4 rounded-lg border border-gray-200">
            <p class="text-sm text-muted-foreground">
              <span v-if="effectiveBookingPolicy.auto_accept">تایید خودکار: نوبت بلافاصله رزرو می‌شود.</span>
              <span v-else>نیاز به تایید وکیل: پس از ثبت، وکیل درخواست را بررسی می‌کند.</span>
            </p>
            <p class="text-sm text-muted-foreground mt-1">
              <span v-if="effectiveBookingPolicy.policy === 'offline_only'">پرداخت آنلاین لازم نیست.</span>
              <span v-else-if="effectiveBookingPolicy.policy === 'deposit_required'">پیش‌پرداخت لازم است.</span>
              <span v-else-if="effectiveBookingPolicy.policy === 'full_payment_required'">پرداخت کامل لازم است.</span>
            </p>
          </div>
          <ReservePayDetail
            :detail-price="detailPrice"
            :booking-policy="effectiveBookingPolicy"
            :visit-type="route.query.visit_type || 'inperson'" />
          <ReserveSelectPay
            :booking-policy="effectiveBookingPolicy"
            @subCopun="(val) => addOffer(val)"
            @subReserve="addReserve"
            class="flex lg:hidden"
            v-if="step === 2" />
          <ReserveAttention />
          <ReserveVisitInfo
            :defVisitTime="defVisitTime"
            :activeDay="activeDay"
            :def-time="deftime" />
        </div>
      </div>
      <div class="left sticky z-10 flex-col gap-3 top-[90px] lg:w-[350px] shrink-0 flex">
        <UICProfileDetail
          src="/images/nullavatar.png"
          :fullname="`${lawyer.name} ${lawyer.family}`"
          skill="وکیل پایه یک دادگستری"
          :active-day="activeDay"
          :paymentType="effectiveBookingPolicy && (effectiveBookingPolicy.policy === 'deposit_required' || effectiveBookingPolicy.policy === 'full_payment_required') ? 'پرداخت آنلاین' : 'پرداخت حضوری'"
          v-model="step" />

        <ReserveSelectPay
          v-if="step === 2"
          class="hidden lg:flex"
          :booking-policy="effectiveBookingPolicy"
          @subCopun="(val) => addOffer(val)"
          @subReserve="addReserve" />
      </div>
    </div>
  </div>
</template>

<script setup>
const res = await useGet({ url: `lawyers/${useRoute().params.id}` }, "");
const data = await res.data;
const lawyer = ref(data.data);

const codeOffer = ref("");
const fileModel = ref("");
const route = useRoute();

const addReserve = async () => {
  const timeStr = String(defVisitTime.value || "").trim();
  const timeForApi = timeStr.includes(":") && timeStr.split(":").length === 2 ? `${timeStr}:00` : timeStr;
  const body = {
    lawyer_id: lawyer.value.id,
    type: route.query.visit_type,
    date: selectedDate.value || activeDay.value,
    time: timeForApi,
    duration: +deftime.value,
    description: dismodel.value,
    coupon_code: codeOffer.value,
  };
  const res = await usePost({
    url: "appointments",
    includeAuthHeader: true,
    body: body,
  });
  if (res.statusCode === 200 || res.statusCode === 201) {
    const appointment = res.data?.data;
    const status = appointment?.status;
    let title = "نوبت شما با موفقیت ثبت شد.";
    if (status === "pending_lawyer_confirmation") {
      title = "درخواست رزرو شما ثبت شد. در انتظار تایید وکیل هستید.";
    } else if (status === "awaiting_payment") {
      title = "درخواست تایید شد. لطفا پرداخت را انجام دهید.";
    }
    useToast().add({
      title,
      icon: "hugeicons:appointment-02",
      color: "success",
    });
    if (status === "awaiting_payment" && appointment?.id) {
      navigateTo(`/dashboard/appointments?pay=${appointment.id}`);
    } else {
      navigateTo("/dashboard/appointments");
    }
  } else if (res.statusCode === 422) {
    useToast().add({
      title: "در این بازه زمانی وکیل نوبت دیگری دارد.",
      icon: "hugeicons:appointment-02",
      color: "error",
    });

    step.value = 1;
  }
  console.log(res);
};

const addOffer = async (val) => {
  if (detailPrice.value.offerValue === 0) {
    const res = await useGet({
      url: "coupons/validate",
      includeAuthHeader: true,
      query: { code: val },
    });
    const data = res.data?.data;
    if (res.statusCode === 200) {
      detailPrice.value = useCalculatePrice(deftime.value, basePrice, data);
      console.log(detailPrice.value);
      useToast().add({
        title: "کد تخفیف با موفقیت اعمال شد.",
        icon: "bx:bxs-offer",
        color: "success",
      });
      codeOffer.value = val;
    } else {
      useToast().add({
        title: "کد تخفیف نامعتبر هست.",
        icon: "bx:bxs-offer",
        color: "error",
      });
    }
  } else {
    useToast().add({
      title: "کد تخفیف با موفقیت اعمال شده است.",
      icon: "bx:bxs-offer",
      color: "warning",
    });
  }
};

const response = await useGet({
  url: `lawyers/${useRoute().params.id}/weekly-schedule`,
  query: { visit_type: route.query.visit_type },
});
const resData = await response.data;
const lawyerSchedules = resData.data.schedules;

const basePrice = resData.data.basePrice;
const bookingPolicy = ref(resData.data.booking_policy || null);

/** برای چت و تلفنی فقط پرداخت کامل؛ برای حضوری همان سیاست وکیل */
const effectiveBookingPolicy = computed(() => {
  const visitType = route.query.visit_type || "inperson";
  const policy = bookingPolicy.value;
  if (visitType === "phone" || visitType === "chat") {
    return policy ? { ...policy, policy: "full_payment_required" } : { policy: "full_payment_required" };
  }
  return policy;
});

const step = ref(1);

const dismodel = ref("");
// روزهای کاری وکیل به همراه ساعت شروع و پایان مخصوص هر روز
const availableDays = lawyerSchedules.reduce((acc, item) => {
  acc[+item.day_of_week] = {
    start: item.start_time.slice(0, 5), // فقط HH:mm
    end: item.end_time.slice(0, 5),
  };
  return acc;
}, {});

const defVisitTime = ref(null);

// مدت جلسه انتخاب‌شده
const deftime = ref("30");
const selectedDuration = ref(30);
watch(deftime, (val) => {
  selectedDuration.value = parseInt(val);
});

// گزینه‌های مدت جلسه
const times = [
  { id: "30", title: "۳۰ دقیقه" },
  { id: "60", title: "۱ ساعت" },
  { id: "90", title: "۱ ساعت و نیم" },
];

const activeDay = ref(null);
const selectedDate = ref(null);
const holidayDates = ref([]);
const dateButtons = ref([]);

const detailPrice = ref();

/** اسلات‌های زمانی از API (ساختار جدید: ساعت کاری، زمان‌های مسدود، بافر، نوبت‌های موجود) */
const timeSlots = ref([]);
const slotsLoading = ref(false);

/** تبدیل زمان API (H:i یا H:i:s) به دقیقه برای محاسبه پایان */
function timeToMinutes(t) {
  const parts = String(t).split(":").map(Number);
  return (parts[0] || 0) * 60 + (parts[1] || 0);
}
function minutesToTimeStr(m) {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

/** ساخت لیست همهٔ اسلات‌های ممکن یک روز از بازهٔ کاری وکیل */
function buildAllSlotsForDay(weekdayIndex) {
  const config = availableDays[weekdayIndex];
  if (!config) return [];
  const startMin = timeToMinutes(config.start);
  const endMin = timeToMinutes(config.end);
  const duration = selectedDuration.value;
  const slots = [];
  for (let start = startMin; start + duration <= endMin; start += 30) {
    const end = start + duration;
    const startLabel = minutesToTimeStr(start);
    const endLabel = minutesToTimeStr(end);
    slots.push({ id: startLabel, title: `${startLabel} - ${endLabel}` });
  }
  return slots;
}

/** دریافت اسلات‌های موجود از API و ترکیب با همهٔ اسلات روز (غیرقابل‌رزرو با رنگ قرمز) */
async function fetchAvailableSlots() {
  const date = selectedDate.value;
  if (!date || !route.params.id || !route.query.visit_type) {
    timeSlots.value = [];
    return;
  }
  const btn = dateButtons.value.find((b) => b.id === activeDay.value);
  const weekdayIndex = btn?.weekdayIndex;
  const allSlotsForDay = weekdayIndex != null ? buildAllSlotsForDay(weekdayIndex) : [];

  slotsLoading.value = true;
  timeSlots.value = [];
  try {
    const res = await useGet({
      url: `lawyers/${route.params.id}/available-slots`,
      query: {
        date,
        visit_type: route.query.visit_type,
        duration: selectedDuration.value,
      },
    });
    const data = res.data?.data;
    const rawSlots = Array.isArray(data?.slots) ? data.slots : [];
    const duration = selectedDuration.value;
    const availableIds = new Set(
      rawSlots.map((timeStr) => minutesToTimeStr(timeToMinutes(timeStr)))
    );

    if (allSlotsForDay.length > 0) {
      timeSlots.value = allSlotsForDay.map((slot) => {
        const available = availableIds.has(slot.id);
        return {
          ...slot,
          disabled: !available,
          unavailable: !available,
        };
      });
    } else {
      timeSlots.value = rawSlots.map((timeStr) => {
        const startMin = timeToMinutes(timeStr);
        const endMin = startMin + duration;
        const startLabel = minutesToTimeStr(startMin);
        const endLabel = minutesToTimeStr(endMin);
        return {
          id: startLabel,
          title: `${startLabel} - ${endLabel}`,
          disabled: false,
          unavailable: false,
        };
      });
    }

    const firstAvailable = timeSlots.value.find((s) => !s.unavailable);
    if (firstAvailable) {
      defVisitTime.value = firstAvailable.id;
    } else if (timeSlots.value.length > 0) {
      defVisitTime.value = null;
    }
    if (defVisitTime.value) {
      const exists = timeSlots.value.some((s) => s.id === defVisitTime.value && !s.unavailable);
      if (!exists) defVisitTime.value = firstAvailable?.id ?? null;
    }
  } catch (e) {
    timeSlots.value = [];
  } finally {
    slotsLoading.value = false;
  }
}

onMounted(() => {
  fetchHolidays();
  detailPrice.value = useCalculatePrice(deftime.value, basePrice);
});

watch(
  () => deftime.value,
  (newVal) => {
    if (step.value === 1) {
      detailPrice.value = useCalculatePrice(newVal, basePrice);
    }
    if (selectedDate.value) fetchAvailableSlots();
  }
);

watch(activeDay, (newVal) => {
  const found = dateButtons.value.find((btn) => btn.id === newVal);
  if (found) selectedDate.value = found.iso;
});

watch(selectedDate, (val) => {
  if (val) fetchAvailableSlots();
});

// دریافت لیست تعطیلات رسمی از API باد صبا (موقتاً غیرفعال — در صورت قطع اتصال، دکمه‌های روز ساخته نمی‌شدند)
function fetchHolidays() {
  // const today = new Date();
  // const { jy, jm } = gregorianToJalali(
  //   today.getFullYear(),
  //   today.getMonth() + 1,
  //   today.getDate()
  // );
  // fetch(`https://badesaba.ir/api/site/getDataCalendar/${jm}/${jy}`)
  //   .then((res) => res.json())
  //   .then((data) => {
  //     holidayDates.value = data
  //       .filter((d) => d.events.some((e) => e.holiday))
  //       .map((d) => d.date);
  //     generateDateButtons();
  //   });

  holidayDates.value = [];
  generateDateButtons();
}

// تولید دکمه‌های انتخاب روز
function generateDateButtons() {
  const today = new Date();
  dateButtons.value = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const iso = date.toISOString().split("T")[0];
    const weekdayIndex = getShamsiWeekdayIndex(date);
    const isHoliday = holidayDates.value.includes(iso) || weekdayIndex === 6;
    const isWorkingDay = Object.prototype.hasOwnProperty.call(
      availableDays,
      weekdayIndex
    );

    dateButtons.value.push({
      iso,
      title: formatJalali(date), // مثال: شنبه 25 تیر
      shamsi: fullJalaliDate(date), // مثال: 1404/04/25
      disabled: isHoliday,
      nonworking: !isWorkingDay && !isHoliday,
      id: fullJalaliDate(date),
      weekdayIndex,
    });
  }

  const filtered = dateButtons.value.filter((day) => !day.nonworking && !day.disabled);
  if (filtered.length > 0) {
    activeDay.value = filtered[0].id;
    selectedDate.value = filtered[0].iso;
  }
}


/* Helpers */
function formatJalali(d) {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    weekday: "short",
  }).format(d);
}

function fullJalaliDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const SHAMSI_WEEKDAYS = {
  شنبه: 0,
  یکشنبه: 1,
  دوشنبه: 2,
  سه‌شنبه: 3,
  چهارشنبه: 4,
  پنجشنبه: 5,
  جمعه: 6,
};

function getShamsiWeekdayIndex(date) {
  const weekday = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    weekday: "long",
  }).format(date);
  return SHAMSI_WEEKDAYS[weekday];
}

function gregorianToJalali(gy, gm, gd) {
  const gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  gy = gy - 1600 > 0 ? gy - 1600 : gy - 621;
  let days =
    365 * gy +
    Math.floor((gy + 3) / 4) -
    Math.floor((gy + 99) / 100) +
    Math.floor((gy + 399) / 400) -
    80 +
    gd +
    gdm[gm - 1];
  let jdays = 365;
  while (days >= jdays) {
    days -= jdays;
    jy++;
    jdays = (jy % 33) % 4 === 1 ? 366 : 365;
  }
  let jm = 0;
  const jmd = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  for (let i = 0; i < 12 && days >= jmd[i]; i++) {
    days -= jmd[i];
    jm++;
  }
  return { jy, jm: jm + 1, jd: days + 1 };
}
</script>

<style scoped>
@reference "tailwindcss";

.selectBtnCon {
  @apply flex flex-col gap-3  text-base lg:text-[18px];
}
</style>
