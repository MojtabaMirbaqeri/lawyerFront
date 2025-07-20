<script setup>
const weekDays = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
];

// این داده‌ها مثلاً از API اومدن
const scheduleData = {
  inperson: [
    {
      id: 1,
      lawyer_id: "4",
      day_of_week: "1",
      start_time: "10:00:00",
      end_time: "19:00:00",
      type: "inperson",
      day_name: "یکشنبه",
    },
    {
      id: 3,
      lawyer_id: "4",
      day_of_week: "0",
      start_time: "10:49:00",
      end_time: "13:49:00",
      type: "inperson",
      day_name: "شنبه",
    },
    {
      id: 6,
      lawyer_id: "4",
      day_of_week: "4",
      start_time: "10:49:00",
      end_time: "13:49:00",
      type: "inperson",
      day_name: "چهارشنبه",
    },
  ],
  chat: [
    {
      id: 1,
      lawyer_id: "4",
      day_of_week: "1",
      start_time: "10:00:00",
      end_time: "19:00:00",
      type: "inperson",
      day_name: "یکشنبه",
    },
    {
      id: 3,
      lawyer_id: "4",
      day_of_week: "0",
      start_time: "10:49:00",
      end_time: "13:49:00",
      type: "inperson",
      day_name: "شنبه",
    },
    {
      id: 6,
      lawyer_id: "4",
      day_of_week: "3",
      start_time: "10:49:00",
      end_time: "13:49:00",
      type: "inperson",
      day_name: "سه شنبه",
    },
  ],
  phone: [],
};

const items = ref([
    {
        label:'حضوری',
        value:'inperson'
    },
    {
        label:'چت آنلاین',
        value:'chat'
    },
    {
        label:'تلفنی',
        value:'phone'
    },
]);

const value = ref("inperson");



const data = computed(() =>
  weekDays.map((day, index) => {
    const shifts = scheduleData[value.value]
      .filter((item) => Number(item.day_of_week) === index)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

    if(scheduleData[value.value].length > 0){
        return {
          day,
          start_Time: shifts[0] ? shifts[0].start_time : "-",
          end_Time: shifts[0] ? shifts[0].end_time : "-",
        };
    }
    
  })
);

const isShowTable = computed(() =>
  scheduleData[value.value] && scheduleData[value.value].length > 0
);


</script>

<template>
  <USelect v-model="value" :items="items" class="w-48" />
  <UTable
    v-if="isShowTable === true"
    :data="data"
    :ui="{ th: 'text-center!', td: 'text-center!' }"
    :columns="[
      { accessorKey: 'day', header: 'روز' },
      { accessorKey: 'start_Time', header: 'ساعت شروع کار' },
      { accessorKey: 'end_Time', header: 'ساعت پایان کار' },
    ]"
  />
  <div v-else class="text-center p-4">وکیل مورد نظر در این مورد فعلا فعال نیست</div>
</template>
