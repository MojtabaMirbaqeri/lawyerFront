<template>
  <div class="booking">
    <h1>رزرو نوبت مشاوره</h1>

    <div class="dates">
      <UISelectButton v-model="activeDay" :items="dateButtons" />
    </div>

    <div class="controls">
      <span>مدت زمان جلسه:</span>
      <button
        v-for="d in [30, 60, 90]"
        :key="d"
        class="duration-btn"
        :class="{ active: selectedDuration === d }"
        @click="setDuration(d)"
      >
        {{ durationLabel(d) }}
      </button>
    </div>

    <div class="slots">
      <button
        v-for="slot in timeSlots"
        :key="slot.label"
        :class="{ disabled: slot.disabled }"
      >
        {{ slot.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";


const shiftStart = toMinutes("12:00");
const shiftEnd = toMinutes("18:00");

// تقویم شمسی: شنبه = 0، جمعه = 6
const availableDays = [0, 2, 4]; // شنبه، دوشنبه، چهارشنبه

const activeDay = ref()

const selectedDate = ref(null);
const selectedDuration = ref(30);
const holidayDates = ref([]);

const bookings = ref([
  { date: "2025-07-14", start: toMinutes("17:30"), end: toMinutes("18:00") },
]);

const dateButtons = ref([]);

onMounted(() => {
  fetchHolidays();
});

function setDuration(mins) {
  selectedDuration.value = mins;
}

function durationLabel(d) {
  if (d === 30) return "۳۰ دقیقه";
  if (d === 60) return "۱ ساعت";
  if (d === 90) return "۱ ساعت و نیم";
  return d + " دقیقه";
}

function selectDate(iso) {
  selectedDate.value = iso;
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
      holidayDates.value = data
        .filter((d) => d.events.some((e) => e.holiday))
        .map((d) => d.date);

      generateDateButtons();
    });
}

function generateDateButtons() {
  const today = new Date();
  dateButtons.value = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const iso = date.toISOString().split("T")[0];
    const weekdayIndex = getShamsiWeekdayIndex(date);
    const isHoliday = holidayDates.value.includes(iso) || weekdayIndex === 6;
    const isWorkingDay = availableDays.includes(weekdayIndex);

    

    dateButtons.value.push({
      iso,
      title: formatJalali(date),
      shamsi: fullJalaliDate(date),
      disabled: isHoliday,
      nonworking: !isWorkingDay && !isHoliday,
      id:formatJalali(date)
    });

    console.log(dateButtons.value);
    
  }
  const filterActiveDays = dateButtons.value.filter(day => {
    return day.nonworking === false
  })
   activeDay.value =filterActiveDays[0].id
}



const timeSlots = computed(() => {
  if (!selectedDate.value) return [];
  const slots = [];
  for (
    let start = shiftStart;
    start + selectedDuration.value <= shiftEnd;
    start += 30
  ) {
    const end = start + selectedDuration.value;
    const isFree = !bookings.value.some(
      (b) =>
        b.date === selectedDate.value && overlap(start, end, b.start, b.end)
    );
    slots.push({
      label: `${formatTime(start)} - ${formatTime(end)}`,
      disabled: !isFree,
    });
  }
  return slots;
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
    day: "2-digit",
    month: "2-digit",
  }).format(d);
}

function fullJalaliDate(d) {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
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
.booking {
  padding: 20px;
}
.controls {
  margin-bottom: 20px;
}
.controls button {
  margin-right: 8px;
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
  margin-top: 16px;
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
.dates {
  margin-bottom: 20px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.dates button {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}
.dates button.holiday {
  background-color: #ffe5e5;
  color: red;
  cursor: not-allowed;
}
.dates button.nonworking {
  background-color: #eef1ff;
  color: #666;
  border-color: #ccd;
  cursor: not-allowed;
}
.dates button.active {
  background-color: #28a745;
  color: #fff;
}
</style>