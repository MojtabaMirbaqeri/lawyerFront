<template>
  <div style="height: 500px; width: 100%">
    <LMap
      ref="mapRef"
      :zoom="zoom"
      :center="center"
      :use-global-leaflet="false"
      class="z-[1]"
      @click="onMapClick"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        layer-type="base"
        name="OpenStreetMap"
      />
      <LMarker v-if="currentLocation" :lat-lng="currentLocation">
        <LPopup>موقعیت انتخاب شده</LPopup>
      </LMarker>
    </LMap>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";

// 1. تعریف پراپ و emit برای v-model
const props = defineProps({
  modelValue: {
    type: Array, // [lat, lng]
    default: null,
  }
});
const emit = defineEmits(['update:modelValue']);

// متغیرهای نقشه
const zoom = ref(6); // زوم اولیه را کمتر می‌کنیم تا کل ایران دیده شود
const center = ref([32.4279, 53.6880]); // مرکز ایران
const mapRef = ref(null); // رفرنس به خود نقشه برای کنترل بیشتر
const currentLocation = ref(null); // موقعیت فعلی مارکر

// 2. محدوده جغرافیایی ایران (Bounding Box)
const IRAN_BOUNDS = {
  minLat: 24.0,
  maxLat: 40.0,
  minLng: 44.0,
  maxLng: 64.0,
};

// 3. تابع برای بررسی اینکه آیا یک نقطه در محدوده ایران است یا خیر
function isWithinIran(lat, lng) {
  return (
    lat >= IRAN_BOUNDS.minLat &&
    lat <= IRAN_BOUNDS.maxLat &&
    lng >= IRAN_BOUNDS.minLng &&
    lng <= IRAN_BOUNDS.maxLng
  );
}

// 4. تابعی برای به‌روزرسانی موقعیت بر اساس ورودی
async function updateLocation(location) {
  if (location && isWithinIran(location[0], location[1])) {
    // اگر موقعیت معتبر و داخل ایران بود
    currentLocation.value = location;
    center.value = location; // مرکز نقشه را روی موقعیت جدید تنظیم کن
    zoom.value = 15; // می‌توانید زوم را برای دید بهتر بیشتر کنید

    // صبر می‌کنیم تا نقشه به‌روز شود
    await nextTick();

    // حالا نقشه را کمی به پایین جابجا می‌کنیم (محتوا به بالا می‌رود)
    // این کار باعث می‌شود نقطه در نیمه پایینی نقشه قرار بگیرد
    if (mapRef.value) {
      // مقدار 75- پیکسل در محور عمودی نقشه را جابجا می‌کند
      // می‌توانید این عدد را برای رسیدن به نتیجه دلخواه تغییر دهید
      mapRef.value?.leafletObject?.panBy([0, -75]);
    }
  } else {
    // اگر موقعیت خارج از ایران یا نامعتبر بود
    currentLocation.value = null; // مارکر را حذف کن
    center.value = [32.4279, 53.6880]; // مرکز نقشه را به مرکز ایران برگردان
    zoom.value = 6;
  }
}
// 5. با استفاده از watch، هر تغییری در v-model را بررسی می‌کنیم
watch(() => props.modelValue, (newLocation) => {
  updateLocation(newLocation);
}, { immediate: true }); // immediate: true باعث می‌شود این watch در لحظه ساخت کامپوننت هم یکبار اجرا شود

// 6. تابع کلیک روی نقشه
function onMapClick(event) {
  const newLocation = [event.latlng.lat, event.latlng.lng];
  
  // فقط در صورتی emit کن که کلیک داخل ایران باشد
  if (isWithinIran(newLocation[0], newLocation[1])) {
    emit('update:modelValue', newLocation);
  } else {
    // می‌توانید به کاربر اطلاع دهید که خارج از محدوده کلیک کرده است
    alert("لطفاً یک نقطه در محدوده ایران انتخاب کنید.");
  }
}
</script>