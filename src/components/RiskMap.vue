<template>
  <div>
    <div id="map" />
  </div>
</template>

<script lang="ts">
// TODO: remove unnecessary axios dependency
import Vue from "vue";
import L, { LatLngExpression } from "leaflet";
import parseGeoraster from "georaster";
//import { GeoRasterLayer } from "georaster-layer-for-leaflet";
import GeoRasterLayer from "georaster-layer-for-leaflet";

/*import * as proj4 from 'proj4';
window['proj4'] = proj4.default;*/

type NullableMap = L.Map | null;

export default Vue.extend({
  name: "RiskMap",
  props: {},
  data: function() {
    return {
      map: null as NullableMap,
      mapCenter: [50.83333, 4] as LatLngExpression,
      zoomLevel: 7
    };
  },
  mounted: function() {
    this.initMap(this.mapCenter, this.zoomLevel);
    this.addGeoTif();
  },
  methods: {
    addGeoTif: function() {
      //const urlToGeotif = "/geotiffs/be_3190653_hist.tif";

      fetch("http://localhost:8081/geotiffs/be_3190653_hist.tif")
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
          parseGeoraster(arrayBuffer).then(georaster => {
            console.log("georaster:", georaster);

            const layer = new GeoRasterLayer({
              georaster: georaster,
              opacity: 0.7,
              pixelValuesToColorFn: values =>
                values[0] > 100 ? "#ff0000" : "#0000ff",
              resolution: 64 // optional parameter for adjusting display resolution
            });
            layer.addTo(this.map);

            this.map.fitBounds(layer.getBounds());
          });
        });
    },
    initMap: function(center: LatLngExpression, zoom: number) {
      this.map = L.map("map").setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
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