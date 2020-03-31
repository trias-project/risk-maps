<template>
    <div>
        <b-alert :show="loadError" variant="warning">GeoTiff missing for this selection</b-alert>
        <div id="map" style="height: 640px; width: 1110px;" />
    </div>
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
      layersControl: (null as unknown) as L.Control.Layers,
      initialMapPosition: [50.47294859181385, 4.4839374800019005] as LatLngExpression,
      initialZoomLevel: 8,
      georasterLayer: null as unknown as GeoRasterLayer,
      colorScale: d3.interpolateViridis, // The domain being [0, 1] (identical to the interpolator range), we don't even need a D3 scale here
      loadError: false,
    };
  },
  mounted: function() {
    this.initMap(this.initialMapPosition, this.initialZoomLevel);
  },
  watch: {
    geotiffUrl: {
      immediate: true,  
      handler: function(newVal: string) {
        this.removeExistingGeoTif();  
        this.loadAndAddGeoTif(newVal);
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

      this.layersControl =  L.control.layers();
      this.layersControl.addTo(this.lMapObj);
      
      this.addOverlays();
    },
    addOverlays: function(): void {
      const overlaysConf = [
        {url: 'http://localhost:8080/overlays/ecoregions.geojson', name: 'Ecoregions'}
      ];

      for (const overlay of overlaysConf) {
        fetch(overlay.url)
          .then(res => res.json())
          .then(data => { 
            this.layersControl.addOverlay(L.geoJSON(data), overlay.name);
          });
      }
    },
    
    removeExistingGeoTif: function(): void {
        if (this.lMapObj && this.georasterLayer) {
            this.lMapObj.removeLayer(this.georasterLayer);
        }
    },
    loadAndAddGeoTif: function(url: string): void {
        const handleErrors = function (response: Response) {
            if (!response.ok) { throw Error(response.statusText); }
            return response;
        }
      fetch(url) // So far, it doesn't work with the inital file but it looks better once reprojected to 4326
        .then(handleErrors)
        .then(function(response) { return response.arrayBuffer() })
        .then(arrayBuffer => {
          parseGeoraster(arrayBuffer).then(georaster => {
            this.georasterLayer = new GeoRasterLayer({
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
            this.georasterLayer.addTo(this.lMapObj);

            this.lMapObj.fitBounds(this.georasterLayer.getBounds());
            this.loadError = false;
          });
        })
        .catch(() => {this.loadError = true });
    }
  }
});
</script>