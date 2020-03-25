<template>
  <div id="map" />
</template>

<script lang="ts">
import Vue from "vue";
import L, { LatLngExpression } from "leaflet";
import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import * as d3 from "d3";
import * as proj4 from "proj4"; // Is proj4 (implicitly) needed?
window["proj4"] = proj4.default; // Is proj4 (implicitly) needed?

export default Vue.extend({
  name: "Map",
  props: {
    geotiffUrl: {
      type: String,
      default: null
    }
  },
  data: function() {
    return {
      lMapObj: (null as unknown) as L.Map,
      initialMapPosition: [50.83333, 4] as LatLngExpression,
      initialZoomLevel: 7,

      colorScale: d3.interpolateViridis // The domain being [0, 1] (identical to the interpolator range), we don't even need a D3 scale here
    };
  },
  mounted: function() {
    this.initMap(this.initialMapPosition, this.initialZoomLevel);
  },
  watch: {
    geotiffUrl: {
      immediate: true,  
      handler: function(newVal: string) {
        this.addGeoTif(newVal);
      }
    }
  },
  methods: {
    initMap: function(center: LatLngExpression, zoom: number): void {
      this.lMapObj = L.map("map").setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
      }).addTo(this.lMapObj);
    },
    addGeoTif: function(urlToGeotif: string): void {
      console.log("passe addGeoTif");
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
            layer.addTo(this.lMapObj);

            this.lMapObj.fitBounds(layer.getBounds());
          });
        });
    }
  }
});
</script>