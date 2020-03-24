<template>
  <b-row>
    <b-col>
      <div id="map" />
    </b-col>
  </b-row>
</template>

<script lang="ts">
import Vue from "vue";
import L, { LatLngExpression } from "leaflet";
import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import * as d3 from "d3";

import * as proj4 from "proj4";
window["proj4"] = proj4.default;

export default Vue.extend({
  name: "RiskMap",
  props: {},
  data: function() {
    return {
      map: (null as unknown) as L.Map,
      mapCenter: [50.83333, 4] as LatLngExpression,
      zoomLevel: 7,

      publicPath: process.env.BASE_URL,
      colorScale: d3.interpolateViridis // The domain being [0, 1] (identical to the interpolator range), we don't even need a D3 scale here
    };
  },
  mounted: function() {
    this.initMap(this.mapCenter, this.zoomLevel);

    const urlToGeotif = `${this.publicPath}geotiffs/be_3190653_hist.4326.tif`;
    this.addGeoTif(urlToGeotif);
  },
  methods: {
    addGeoTif: function(urlToGeotif: string): void {
      fetch(urlToGeotif) // So far, it doesn't work with the inital file but it looks better once reprojected to 4326
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
          parseGeoraster(arrayBuffer).then(georaster => {
            const layer = new GeoRasterLayer({
              georaster: georaster,
              opacity: 0.7,
              pixelValuesToColorFn: values => {
                // no data is represented by very small values (normal range is [0,1])
                if (values[0] < -10000) {
                  return "rgba(0, 0, 0, 0)"; // transparent
                } else {
                  return this.colorScale(values[0]);
                }
              },
              resolution: 64 // optional parameter for adjusting display resolution
            });
            layer.addTo(this.map);

            this.map.fitBounds(layer.getBounds());
          });
        });
    },
    initMap: function(center: LatLngExpression, zoom: number): void {
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
  width: 800px;
  height: 600px;
}
</style>