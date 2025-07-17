<template>
  <div class="container bg-white h-[100vh] flex flex-col gap-8">
    <h1>رزرو نوبت مشاوره</h1>

    <div class="dates">
      <reserve-select-btn
        v-model="activeDay"
        :items="dateButtons"
        option-label="title"
        option-value="id"
      />
    </div>

    <div class="controls">
      <span>مدت زمان جلسه:</span>
      <UICSelectButton
        base-class="rounded-[5px]! px-4 py-2 rounded-full border border-gray-300 text-sm lg:text-base transition cursor-pointer"
        :items="times"
        v-model="deftime"
      />
    </div>

    <div class="slots flex flex-col">
      <span>انتخاب زمان جلسه:</span>
      <UICSelectButton v-model="defVisitTime" :items="timeSlots" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";

// روزهای کاری وکیل به همراه ساعت شروع و پایان مخصوص هر روز
const availableDays = {
  0: { start: "10:00", end: "14:00" }, // شنبه
  2: { start: "12:00", end: "16:00" }, // دوشنبه
  4: { start: "13:00", end: "18:00" }, // چهارشنبه
};

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

const bookingData = ref([
  {
    lawyer_id: 4,
    type: "phone",
    date: "2025-07-16",
    time: "14:00:00",
    duration: 60,
    description: "سوال حقوقی درباره ارث",
  },
  {
    lawyer_id: 4,
    type: "phone",
    date: "2025-07-19",
    time: "12:00:00",
    duration: 30,
    description: "سوال حقوقی درباره ارث",
  },
  {
    lawyer_id: 4,
    type: "phone",
    date: "2025-07-16",
    time: "15:00:00",
    duration: 90,
    description: "سوال حقوقی درباره ارث",
  },
  {
    lawyer_id: 4,
    type: "phone",
    date: "2025-07-19",
    time: "13:00:00",
    duration: 60,
    description: "سوال حقوقی درباره ارث",
  },
]);

function addTimeAndDuration(timeStr, durationMinutes) {
  const [h, m, s] = timeStr.split(":").map(Number);
  const totalMinutes = h * 60 + m + durationMinutes;

  const newHour = Math.floor(totalMinutes / 60);
  const newMinute = totalMinutes % 60;

  return (
    String(newHour).padStart(2, "0") + ":" + String(newMinute).padStart(2, "0")
  );
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

onMounted(() => {
  fetchHolidays();
});

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

  const filtered = dateButtons.value.filter((day) => !day.nonworking);
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

  for (
    let start = startTime;
    start + selectedDuration.value <= endTime;
    start += 30
  ) {
    const end = start + selectedDuration.value;
    const isFree = !bookings.value.some(
      (b) =>
        b.date === selectedDate.value && overlap(start, end, b.start, b.end)
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
    String(Math.floor(m / 60)).padStart(2, "0") +
    ":" +
    String(m % 60).padStart(2, "0")
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
.controls button {
  padding: 8px 12px;
  cursor: pointer;
}
.controls button.active {
  background-color: #007bff;
  color: #fff;
}
.slots {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.slots button {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}
.slots button.disabled {
  background-color: #f0f0f0;
  border-color: #ddd;
  color: #888;
  cursor: not-allowed;
}
</style>
