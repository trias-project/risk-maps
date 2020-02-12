<template>
  <div>
    <div id="map" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import L from "leaflet";

type NullableMap = L.Map | null;

export default Vue.extend({
  name: "RiskMap",
  props: {},
  data: function() {
    return {
      map: null as NullableMap
    };
  },
  mounted: function() {
    this.initMap();
  },
  methods: {
    initMap: function() {
      this.map = L.map("map").setView([38.63, -90.23], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
      }).addTo(this.map);
    }
  }
});
</script>

<style scoped>
@import "../../node_modules/leaflet/dist/leaflet.css";

div#map {
  width: 640px;
  height: 480px;
}
</style>