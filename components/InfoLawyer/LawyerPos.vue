<template>
  <ClientOnly>
    <LMap
      ref="map"
      :zoom="zoom"
      :center="pos"
      :use-global-leaflet="false"
      class="z-[1]"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        layer-type="base"
        name="OpenStreetMap"
      />
      <LMarker :lat-lng="pos" />
    </LMap>
  </ClientOnly>
</template>

<script setup>
  defineProps(['pos'])
  const zoom = ref(15);
</script>

<style>
</style>