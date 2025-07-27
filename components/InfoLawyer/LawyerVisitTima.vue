<script setup>

const props = defineProps(['sch'])

const weekDays = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
];

// const res = await useGet(`lawyer_schedules/grouped/${useRoute().params.id}`,true)
// const sch = await res.data;


// این داده‌ها مثلاً از API اومدن
const scheduleData = props.sch

const items = ref([
  {
    label: "حضوری",
    value: "inperson",
  },
  {
    label: "چت",
    value: "chat",
  },
  {
    label: "تلفنی",
    value: "phone",
  },
]);

const value = ref("inperson");

const data = computed(() =>
  weekDays.map((day, index) => {
    const shifts = scheduleData[value.value]
      .filter((item) => Number(item.day_of_week) === index)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

    if (scheduleData[value.value].length > 0) {
      return {
        day,
        start_Time: shifts[0] ? shifts[0].start_time : "-",
        end_Time: shifts[0] ? shifts[0].end_time : "-",
      };
    }
  })
);

const isShowTable = computed(
  () => scheduleData[value.value] && scheduleData[value.value].length > 0
);
</script>

<template>
  <USelect v-model="value" :items="items" class="w-48" />
  <UTable
    v-if="isShowTable === true"
    :data="data"
    :ui="{ th: 'text-center!', td: 'text-center!' , tr:'even:bg-primary/10'}"
    :columns="[
      { accessorKey: 'day', header: 'روز' },
      { accessorKey: 'start_Time', header: 'ساعت شروع کار' },
      { accessorKey: 'end_Time', header: 'ساعت پایان کار' },
    ]"
  />
  <div v-else class="text-center p-4">
    وکیل مورد نظر در این مورد فعلا فعال نیست
  </div>
</template>
