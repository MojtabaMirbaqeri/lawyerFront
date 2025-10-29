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
              <UICSelectButton v-model="defVisitTime" :items="timeSlots" />
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
            layout="list"
          >
          </UFileUpload>
          </div>
        </div>
        <div v-if="step === 2" class="step2 flex flex-col gap-3">
          <UICBackBtn @click="step--" />
          <ReservePayDetail :detailPrice="detailPrice" />
          <ReserveSelectPay
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
          src="/images/null-avatar.png"
          :fullname="`${lawyer.name} ${lawyer.family}`"
          skill="وکیل پایه یک دادگستری"
          :active-day="activeDay"
          paymentType="پرداخت حضوری"
          v-model="step" />

        <ReserveSelectPay
          v-if="step === 2"
          class="hidden lg:flex"
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
  const body = {
    lawyer_id: lawyer.value.id,
    type: route.query.visit_type,
    date: activeDay.value,
    time: defVisitTime.value,
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
    useToast().add({
      title: "نوبت شما با موفقیت ثبت شد.",
      icon: "hugeicons:appointment-02",
      color: "success",
    });
    navigateTo("/dashboard/appointments");
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

const bookingData = ref([]);

resData.data.weekly_data.forEach((day) => {
  day.appointments.forEach((appointment) => {
    bookingData.value.push({
      lawyer_id: Number(resData.data.lawyer_id),
      type: resData.data.visit_type,
      date: day.date,
      time: appointment.time,
      duration: Number(appointment.duration),
      description: appointment.description,
    });
  });
});

console.log(bookingData.value);

function addTimeAndDuration(timeStr, durationMinutes) {
  const [h, m, s] = timeStr.split(":").map(Number);
  const totalMinutes = h * 60 + m + durationMinutes;

  const newHour = Math.floor(totalMinutes / 60);
  const newMinute = totalMinutes % 60;

  return String(newHour).padStart(2, "0") + ":" + String(newMinute).padStart(2, "0");
}

// رزروهای ثبت‌شده
const bookings = ref(
  bookingData.value.map((b) => {
    return {
      date: b.date,
      start: toMinutes(b.time),
      end: toMinutes(addTimeAndDuration(b.time, b.duration)),
    };
  })
);

const detailPrice = ref();

onMounted(() => {
  fetchHolidays();
  detailPrice.value = useCalculatePrice(deftime.value, basePrice);
});

watch(
  () => deftime.value,
  (newVal) => {
    console.log(newVal)
    if (step.value === 1) {
      detailPrice.value = useCalculatePrice(newVal, basePrice);
    }
  }
);

watch(activeDay, (newVal) => {
  const found = dateButtons.value.find((btn) => btn.id === newVal);
  if (found) selectedDate.value = found.iso;
  console.log(newVal);
});

// دریافت لیست تعطیلات رسمی از API باد صبا
function fetchHolidays() {
  const today = new Date();
  const { jy, jm } = gregorianToJalali(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );

  fetch(`https://badesaba.ir/api/site/getDataCalendar/${jm}/${jy}`)
    .then((res) => res.json())
    .then((data) => {
      holidayDates.value = data
        .filter((d) => d.events.some((e) => e.holiday))
        .map((d) => d.date);

      generateDateButtons();
    });
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
    const isWorkingDay = availableDays.hasOwnProperty(weekdayIndex);

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

// تولید اسلات‌های زمانی
const timeSlots = computed(() => {
  if (!selectedDate.value) return [];

  const btn = dateButtons.value.find((b) => b.id === activeDay.value);
  if (!btn) return [];

  const weekdayIndex = btn.weekdayIndex;
  const config = availableDays[weekdayIndex];
  if (!config) return [];

  const startTime = toMinutes(config.start);
  const endTime = toMinutes(config.end);
  const slots = [];

  for (let start = startTime; start + selectedDuration.value <= endTime; start += 30) {
    const end = start + selectedDuration.value;
    const isFree = !bookings.value.some(
      (b) => b.date === selectedDate.value && overlap(start, end, b.start, b.end)
    );
    slots.push({
      title: `${formatTime(start)} - ${formatTime(end)}`,
      disabled: !isFree,
      id: formatTime(start),
    });
  }

  return slots;
});

watchEffect(() => {
  const available = timeSlots.value.filter((t) => !t.disabled);
  if (available.length > 0) {
    defVisitTime.value = available[0].id;
  }
});

/* Helpers */
function toMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(m) {
  return (
    String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0")
  );
}

function overlap(aS, aE, bS, bE) {
  return aS < bE && bS < aE;
}

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
