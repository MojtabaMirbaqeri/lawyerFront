<template>
  <div>
    <InfoLawyerBookingCard
      :duration-options="durationOptions"
      :duration="duration"
      :items="items"
      :can-reserve="canReserve"
      :active-visit-type="activeVisitType"
      :active-day="activeDay"
      :date-buttons="dateButtons"
      :schedule-loaded="scheduleLoaded"
      :schedule-unavailable="scheduleUnavailable"
      :time-slots="timeSlots"
      :def-visit-time="defVisitTime"
      :display-price="displayPrice"
      :days-drag="daysDrag"
      :times-drag="timesDrag"
      :phone-number="phoneNumber"
      :lawyer-id="lawyerId"
      @update:duration="duration = $event"
      @update:active-visit-type="activeVisitType = $event"
      @update:active-day="activeDay = $event"
      @update:def-visit-time="defVisitTime = $event"
      @reserve-click="openReserveModal" />

    <InfoLawyerReserveBookingModal
      v-model:case-description="caseDescription"
      v-model:discount-code="discountCode"
      v-model:reserve-files="reserveFiles"
      :open="reserveModalOpen"
      :step="reserveStep"
      :total-steps="totalReserveSteps"
      :lawyer-name="lawyerName"
      :summary-date-text="summaryDateText"
      :summary-duration-text="summaryDurationText"
      :visit-type-title="selectedItem?.title"
      :display-price="mainPriceDisplay"
      :final-price-display="finalPriceDisplay"
      :offer-value-display="offerValueDisplay"
      :can-reserve="canReserve"
      @update:open="onReserveModalOpenChange"
      @apply-discount="applyDiscount"
      @back="reserveModalBack"
      @next="reserveModalNext"
      @confirm-payment="confirmPayment" />
  </div>
</template>

<script setup>
const props = defineProps({
  items: { type: Array, required: true },
  phoneNumber: { type: String, default: "" },
  lawyerId: { type: [String, Number], default: null },
  lawyerName: { type: String, default: "" },
  active: { type: Boolean, default: true },
});

/** اسکرول افقی با درگ ماوس — هر بار یک مجموعه هندلر برای یک باکس برمی‌گرداند */
function useDragScroll() {
  let el = null;
  let startX = 0;
  let scrollLeftStart = 0;
  const isDragging = ref(false);
  const didDrag = ref(false);

  function onMouseMove(e) {
    if (!el) return;
    if (Math.abs(e.clientX - startX) > 5) didDrag.value = true;
    el.scrollLeft = scrollLeftStart + (startX - e.clientX); // درگ راست = اسکرول راست
  }

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    el = null;
    isDragging.value = false;
  }

  function onMouseDown(e) {
    el = e.currentTarget;
    if (!el) return;
    isDragging.value = true;
    didDrag.value = false;
    startX = e.clientX;
    scrollLeftStart = el.scrollLeft;
    e.preventDefault();
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  function onContainerClick(e) {
    if (didDrag.value) {
      e.preventDefault();
      e.stopPropagation();
      didDrag.value = false;
    }
  }

  return { onMouseDown, onContainerClick, isDragging };
}

const daysDrag = useDragScroll();
const timesDrag = useDragScroll();

// مودال رزرو چندمرحله‌ای
// مودال رزرو — state و هندلرها
const reserveModalOpen = ref(false);
const reserveStep = ref(1);
const totalReserveSteps = 2;
const caseDescription = ref("");
const reserveFiles = ref([]);
const discountCode = ref("");

function openReserveModal() {
  reserveStep.value = 1;
  caseDescription.value = "";
  reserveFiles.value = [];
  appliedCoupon.value = null;
  reserveModalOpen.value = true;
}

function onReserveModalOpenChange(isOpen) {
  reserveModalOpen.value = isOpen;
  if (!isOpen) reserveStep.value = 1;
}

function reserveModalBack() {
  if (reserveStep.value === 1) {
    reserveModalOpen.value = false;
    return;
  }
  reserveStep.value--;
}

function reserveModalNext() {
  console.log(canReserve.value);
  if (reserveStep.value >= totalReserveSteps) return;
  reserveStep.value++;
}

async function confirmPayment() {
  console.log(canReserve.value);
  
  if (!canReserve.value) return;

  const body = {
    lawyer_id: props.lawyerId,
    type: activeVisitType.value,
    date: activeDay.value,
    time: defVisitTime.value,
    duration: +duration.value,
    description: caseDescription.value,
    coupon_code: discountCode.value?.trim() || "",
  };

  const res = await usePost({
    url: "appointments",
    includeAuthHeader: true,
    body,
  });

  if (res.statusCode === 200 || res.statusCode === 201) {
    reserveModalOpen.value = false;
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
  }
}

// مدت جلسه: ۳۰، ۶۰، ۹۰ دقیقه — تایم‌ها نیم‌ساعت نیم‌ساعت (start += 30)
const durationOptions = [
  { id: "30", title: "۳۰ دقیقه" },
  { id: "60", title: "۶۰ دقیقه" },
  { id: "90", title: "۹۰ دقیقه" },
];

const duration = ref("30");
const selectedDuration = ref(30);
watch(duration, (val) => {
  selectedDuration.value = parseInt(val, 10);
});

// نوع مشاوره — پیش‌فرض اولین آیتم فعال
const activeVisitType = ref("");
watch(
  () => props.items,
  (items) => {
    if (!activeVisitType.value && items?.length) {
      const first = items.find((i) => i.active);
      if (first) activeVisitType.value = first.value;
    }
  },
  { immediate: true }
);

// ——— منطق برنامه‌هفتگی و روز/زمان (از MainCom.vue) ———
const scheduleLoaded = ref(false);
/** true وقتی این نوع مشاوره اصلاً برنامه یا روز/زمانی ندارد (دیزیبل شود) */
const scheduleUnavailable = ref(false);
const availableDays = ref({});
const bookingData = ref([]);
const bookings = ref([]);
const dateButtons = ref([]);
const holidayDates = ref([]);
const activeDay = ref(null);
const selectedDate = ref(null);
const defVisitTime = ref(null);

function toMinutes(t) {
  const [h, m] = String(t).split(":").map(Number);
  return h * 60 + (m || 0);
}

function formatTime(m) {
  return (
    String(Math.floor(m / 60)).padStart(2, "0") +
    ":" +
    String(m % 60).padStart(2, "0")
  );
}

function addTimeAndDuration(timeStr, durationMinutes) {
  const [h, m] = String(timeStr).split(":").map(Number);
  const totalMinutes = h * 60 + (m || 0) + durationMinutes;
  const newHour = Math.floor(totalMinutes / 60);
  const newMinute = totalMinutes % 60;
  return (
    String(newHour).padStart(2, "0") + ":" + String(newMinute).padStart(2, "0")
  );
}

function overlap(aS, aE, bS, bE) {
  return aS < bE && bS < aE;
}

function formatJalaliWeekday(d) {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    weekday: "short",
  }).format(d);
}

function fullJalaliDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDayMonthJalali(d) {
  const parts = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "2-digit",
    month: "short",
  }).formatToParts(d);
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  return `${day} ${month}`;
}

const SHAMSI_WEEKDAYS = {
  شنبه: 0,
  یکشنبه: 1,
  دوشنبه: 2,
  "سه‌شنبه": 3,
  چهارشنبه: 4,
  پنجشنبه: 5,
  جمعه: 6,
};

function getShamsiWeekdayIndex(date) {
  const weekday = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    weekday: "long",
  }).format(date);
  return SHAMSI_WEEKDAYS[weekday] ?? 0;
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
      holidayDates.value = (data || [])
        .filter((d) => d.events?.some((e) => e.holiday))
        .map((d) => d.date);
      generateDateButtons();
    })
    .catch(() => generateDateButtons());
}

function generateDateButtons() {
  const today = new Date();
  dateButtons.value = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const iso = date.toISOString().split("T")[0];
    const weekdayIndex = getShamsiWeekdayIndex(date);
    const isHoliday =
      holidayDates.value.includes(iso) || weekdayIndex === 6;
    const isWorkingDay = Object.prototype.hasOwnProperty.call(
      availableDays.value,
      weekdayIndex
    );

    dateButtons.value.push({
      iso,
      title: formatJalaliWeekday(date),
      dayMonth: formatDayMonthJalali(date),
      disabled: isHoliday,
      nonworking: !isWorkingDay && !isHoliday,
      id: fullJalaliDate(date),
      weekdayIndex,
    });
  }

  const filtered = dateButtons.value.filter(
    (day) => !day.nonworking && !day.disabled
  );
  if (filtered.length > 0) {
    activeDay.value = filtered[0].id;
    selectedDate.value = filtered[0].iso;
  } else {
    activeDay.value = null;
    selectedDate.value = null;
  }
}

watch(activeDay, (newVal) => {
  const found = dateButtons.value.find((btn) => btn.id === newVal);
  if (found) selectedDate.value = found.iso;
});

// اسلات‌های زمانی (مطابق MainCom)
const timeSlots = computed(() => {
  if (!selectedDate.value) return [];

  const btn = dateButtons.value.find((b) => b.id === activeDay.value);
  if (!btn) return [];

  const config = availableDays.value[btn.weekdayIndex];
  if (!config) return [];

  const startTime = toMinutes(config.start);
  const endTime = toMinutes(config.end);
  const slots = [];

  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];
  const isToday = selectedDate.value === todayISO;
  const currentMinutes = isToday
    ? today.getHours() * 60 + today.getMinutes()
    : 0;

  for (
    let start = startTime;
    start + selectedDuration.value <= endTime;
    start += 30
  ) {
    const end = start + selectedDuration.value;
    if (isToday && start <= currentMinutes) continue;

    const isFree = !bookings.value.some(
      (b) =>
        b.date === selectedDate.value && overlap(start, end, b.start, b.end)
    );
    const startStr = formatTime(start);
    const endStr = formatTime(end);
    slots.push({
      title: `${startStr} تا ${endStr}`,
      startTime: startStr,
      endTime: endStr,
      disabled: !isFree,
      id: startStr,
    });
  }

  return slots;
});

watchEffect(() => {
  const available = timeSlots.value.filter((t) => !t.disabled);
  if (available.length > 0 && !defVisitTime.value) {
    defVisitTime.value = available[0].id;
  }
});

// بارگذاری برنامه وقتی نوع مشاوره عوض شد (همان API و ساختار MainCom)
async function loadSchedule() {
  if (!props.lawyerId || !activeVisitType.value) {
    scheduleLoaded.value = false;
    scheduleUnavailable.value = false;
    return;
  }

  const item = props.items.find((i) => i.value === activeVisitType.value);
  if (!item?.active) {
    scheduleLoaded.value = false;
    scheduleUnavailable.value = true;
    return;
  }

  scheduleLoaded.value = false;
  scheduleUnavailable.value = false;
  defVisitTime.value = null;

  try {
    const response = await useGet({
      url: `lawyers/${props.lawyerId}/weekly-schedule`,
      query: { visit_type: activeVisitType.value },
    });
    const resData = await response.data;
    if (!resData?.data) {
      scheduleUnavailable.value = true;
      return;
    }

    const lawyerSchedules = resData.data.schedules || [];
    availableDays.value = lawyerSchedules.reduce((acc, s) => {
      acc[+s.day_of_week] = {
        start: (s.start_time || "").slice(0, 5),
        end: (s.end_time || "").slice(0, 5),
      };
      return acc;
    }, {});

    if (Object.keys(availableDays.value).length === 0) {
      scheduleUnavailable.value = true;
      return;
    }

    const bData = [];
    (resData.data.weekly_data || []).forEach((day) => {
      (day.appointments || []).forEach((appointment) => {
        bData.push({
          lawyer_id: Number(resData.data.lawyer_id),
          type: resData.data.visit_type,
          date: day.date,
          time: appointment.time,
          duration: Number(appointment.duration),
          description: appointment.description,
        });
      });
    });
    bookingData.value = bData;
    bookings.value = bData.map((b) => ({
      date: b.date,
      start: toMinutes(b.time),
      end: toMinutes(addTimeAndDuration(b.time, b.duration)),
    }));

    scheduleLoaded.value = true;
    fetchHolidays();
  } catch {
    scheduleLoaded.value = false;
    scheduleUnavailable.value = true;
  }
}

watch(activeVisitType, loadSchedule, { immediate: true });

onMounted(() => {
  if (!holidayDates.value.length && Object.keys(availableDays.value).length)
    fetchHolidays();
});

// قیمت نمایشی و دکمه رزرو
const selectedItem = computed(() =>
  props.items.find((i) => i.value === activeVisitType.value)
);

const displayPrice = computed(() => {
  const p = selectedItem.value?.price;
  if (p == null) return "—";
  return Number(p).toLocaleString("fa-IR") + " تومان";
});

// خلاصه رزرو برای استپ ۲ مودال
const selectedDateButton = computed(() =>
  dateButtons.value.find((b) => b.id === activeDay.value)
);
const summaryDateText = computed(() => {
  if (!selectedDateButton.value || !defVisitTime.value) return "—";
  return `${selectedDateButton.value.title} ${selectedDateButton.value.dayMonth}، ساعت ${defVisitTime.value}`;
});
const summaryDurationText = computed(() => {
  const d = durationOptions.find((opt) => opt.id === duration.value);
  return d?.title ?? "—";
});

// محاسبه قیمت نهایی با استفاده از useCalculatePrice (قیمت پایه، مدت، کوپن)
const basePriceNum = computed(() => Number(selectedItem.value?.price) || 0);
const appliedCoupon = ref(null);
const calculatedPrice = computed(() =>
  useCalculatePrice(
    selectedDuration.value,
    basePriceNum.value,
    appliedCoupon.value
  )
);
const mainPriceDisplay = computed(() => {
  const p = calculatedPrice.value?.mainPrice ?? (selectedDuration.value / 30) * basePriceNum.value;
  if (p == null || Number.isNaN(p)) return displayPrice.value;
  return Number(p).toLocaleString("fa-IR") + " تومان";
});
const finalPriceDisplay = computed(() => {
  const p = calculatedPrice.value?.price ?? calculatedPrice.value?.mainPrice ?? basePriceNum.value;
  if (p == null || Number.isNaN(p)) return "—";
  return Number(p).toLocaleString("fa-IR") + " تومان";
});
const offerValueDisplay = computed(() => {
  const v = calculatedPrice.value?.offerValue ?? 0;
  if (!v || v <= 0) return null;
  return Number(v).toLocaleString("fa-IR") + " تومان";
});

async function applyDiscount() {
  if (!discountCode.value?.trim()) return;
  if (calculatedPrice.value?.offerValue > 0) {
    useToast().add({
      title: "کد تخفیف با موفقیت اعمال شده است.",
      icon: "bx:bxs-offer",
      color: "warning",
    });
    return;
  }
  try {
    const res = await useGet({
      url: "coupons/validate",
      includeAuthHeader: true,
      query: { code: discountCode.value.trim() },
    });
    const data = res?.data?.data;
    if (res?.statusCode === 200 && data) {
      appliedCoupon.value = data;
      useToast().add({
        title: "کد تخفیف با موفقیت اعمال شد.",
        icon: "bx:bxs-offer",
        color: "success",
      });
    } else {
      useToast().add({
        title: "کد تخفیف نامعتبر است.",
        icon: "bx:bxs-offer",
        color: "error",
      });
    }
  } catch {
    useToast().add({
      title: "کد تخفیف نامعتبر است.",
      icon: "bx:bxs-offer",
      color: "error",
    });
  }
}

const canReserve = computed(
  () =>
    activeVisitType.value &&
    activeDay.value &&
    defVisitTime.value &&
    selectedItem.value 
);

function _goToReserve() {
  if (!canReserve.value || !props.lawyerId) return;
  const query = {
    visit_type: activeVisitType.value,
    duration: duration.value,
    date: activeDay.value,
    time: defVisitTime.value,
  };
  if (discountCode.value?.trim()) {
    query.coupon_code = discountCode.value.trim();
  }
  navigateTo({
    path: `/reserve/${props.lawyerId}`,
    query,
  });
}
</script>

