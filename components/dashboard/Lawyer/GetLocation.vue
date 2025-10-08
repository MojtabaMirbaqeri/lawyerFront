  <template>
    <div class="relative">
      <!-- دکمه برای تشخیص موقعیت فعلی -->
      <button
        class="mb-2 absolute z-50 p-2 bg-white right-3 rounded-[8px] top-3 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        @click="detectLocation"
      >
        <UIcon name="solar:gps-outline" class="size-5!"/>
      </button>

      <!-- نقشه -->
      <div style="height: 250px; width: 100%">
        <LMap
          ref="mapRef"
          :zoom="zoom"
          :center="center"
          :use-global-leaflet="false"
          class="z-[1]"
          @click="onMapClick"
          @ready="onMapReady"
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
    </div>
  </template>

  <script setup>
  import { ref, watch, nextTick } from 'vue';
  import "leaflet/dist/leaflet.css";
  import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";

  // props & emit برای v-model
  const props = defineProps({
    modelValue: {
      type: Array, // [lat, lng]
      default: null,
    },
  });
  const emit = defineEmits(['update:modelValue']);

  // متغیرهای نقشه
  const zoom = ref(6);
  const center = ref([32.4279, 53.6880]); // مرکز ایران
  const currentLocation = ref(null);
  const mapRef = ref(null);
  const isDetectingLocation = ref(false);
  const lastDetectedLocation = ref(null); // ذخیره آخرین موقعیت تشخیص داده شده

  // محدوده ایران
  const IRAN_BOUNDS = {
    minLat: 24.0,
    maxLat: 40.0,
    minLng: 44.0,
    maxLng: 64.0,
  };
  function isWithinIran(lat, lng) {
    return (
      lat >= IRAN_BOUNDS.minLat &&
      lat <= IRAN_BOUNDS.maxLat &&
      lng >= IRAN_BOUNDS.minLng &&
      lng <= IRAN_BOUNDS.maxLng
    );
  }

   // تابع بروزرسانی موقعیت
   async function updateLocation(location, _isUserLocation = false) {
     if (location && isWithinIran(location[0], location[1])) {
       currentLocation.value = location;
       
       // همیشه از setView استفاده کن - بدون panBy
       await nextTick();
       mapRef.value?.leafletObject?.setView(location, 15, {
         animate: true,
         duration: 1.0
       });
       // تنظیم center و zoom برای هماهنگی
       center.value = location;
       zoom.value = 15;
     } else {
       currentLocation.value = null;
       center.value = [32.4279, 53.6880];
       zoom.value = 6;
     }
   }

  watch(() => props.modelValue, (newLocation) => {
    // فقط در صورتی که موقعیت از خارج تغییر کرده باشد (نه از detectLocation)
    if (newLocation && !isDetectingLocation.value) {
      updateLocation(newLocation);
    }
  }, { immediate: true });

  // آماده شدن نقشه
  function onMapReady() {
    // نقشه آماده است
    console.log('Map is ready');
  }

  // کلیک روی نقشه
  function onMapClick(event) {
    const newLocation = [event.latlng.lat, event.latlng.lng];
    if (isWithinIran(newLocation[0], newLocation[1])) {
      emit('update:modelValue', newLocation);
    } else {
      alert("لطفاً نقطه‌ای در محدوده ایران انتخاب کنید.");
    }
  }

  // تابع محاسبه فاصله بین دو نقطه (به متر)
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // شعاع زمین به متر
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // فاصله به متر
  }

  // ✅ تابع تشخیص موقعیت فعلی کاربر
  // ✅ تابع تشخیص موقعیت فعلی کاربر
  function detectLocation() {
    if (!navigator.geolocation) {
      alert("مرورگر شما از موقعیت‌یاب پشتیبانی نمی‌کند.");
      return;
    }

    if (isDetectingLocation.value) return;
    isDetectingLocation.value = true;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const newLocation = [latitude, longitude];
        console.log( latitude, longitude );
        console.log( newLocation );
        
        if (!isWithinIran(latitude, longitude)) {
          alert("موقعیت شما خارج از محدوده ایران است.");
          isDetectingLocation.value = false;
          return;
        }

         // بررسی فاصله با موقعیت آخرین تشخیص
         let shouldMoveMap = false;
 
         if (!lastDetectedLocation.value) {
           // اولین بار است → نقشه را حرکت بده
           shouldMoveMap = true;
           console.log('First time detecting location - moving map');
         } else {
           const distance = getDistance(
             latitude,
             longitude,
             lastDetectedLocation.value[0],
             lastDetectedLocation.value[1]
           );
           // اگر فاصله بیش از 10 متر باشد، نقشه را جابه‌جا کن
           shouldMoveMap = distance > 10;
           console.log(`Distance from last location: ${distance.toFixed(2)} meters`);
         }

        emit("update:modelValue", newLocation);
        lastDetectedLocation.value = [...newLocation];
        currentLocation.value = newLocation;

         if (shouldMoveMap) {
           console.log('Moving map to new location:', newLocation);
           await updateLocation(newLocation, true);
           await nextTick();
           // اطمینان از سنتر شدن کامل
           setTimeout(() => {
             mapRef.value?.leafletObject?.invalidateSize();
           }, 100);
         } else {
           console.log('Location is close to previous, not moving map');
         }

        isDetectingLocation.value = false;
      },
      (err) => {
        console.error(err);
        alert("دسترسی به موقعیت فعلی رد شد یا خطایی رخ داد.");
        isDetectingLocation.value = false;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }
  </script>
