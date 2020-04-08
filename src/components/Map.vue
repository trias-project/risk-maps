<template>
  <b-row>
    <b-col cols="9">
      <b-alert :show="loadError" variant="warning">GeoTiff missing for this selection</b-alert>
      <div id="map" style="height: 640px; width: 825px;" />
    </b-col>

    <b-col cols="3">
      <label for="opacity">Opacity</label>
      <b-form-input id="opacity" v-model="georasterLayerOpacity" type="range" min="0" max="1" step="0.01"></b-form-input>
      <h3>Overlays</h3>
      <b-form-select v-model="currentOverlayUrl" :options="availableOverlaysForSelect" size="sm"></b-form-select>
      <p v-if="highlightedFeatureName">Highlighted feature: {{ highlightedFeatureName }}</p>
      <color-legend :color-scale="colorScale"></color-legend>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import Vue from "vue";
import ColorLegend from "./ColorLegend.vue";
import L, { LatLngExpression } from "leaflet";
import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import * as d3 from "d3";
import * as proj4 from "proj4"; // Is proj4 (implicitly) needed?
window["proj4"] = proj4.default; // Is proj4 (implicitly) needed?
import { OverlayConf } from "../interfaces";
import * as geojson from "geojson";

export default Vue.extend({
  name: "Map",
  props: {
    geotiffUrl: {
      type: String,
      default: null
    },
    overlaysConf: {
      type: Array as () => OverlayConf[],
      default: () => []
    }
  },
  data: function() {
    return {
      lMapObj: (null as unknown) as L.Map,
      currentOverlayLayer: (null as unknown) as L.GeoJSON,
      currentOverlayUrl: "",
      highlightedFeatureName: "",
      initialMapPosition: [
        50.47294859181385,
        4.4839374800019005
      ] as LatLngExpression,
      initialZoomLevel: 8,
      georasterLayer: (null as unknown) as GeoRasterLayer,
      georasterLayerOpacity: 0.7,
      colorScale: d3.scaleSequential(d3.interpolateSpectral).domain([0, 1]),
      loadError: false
    };
  },
  computed: {
    availableOverlaysForSelect: function() {
      const overlays = this.overlaysConf.map(e => {
        return {
          text: e.name,
          value: e.url
        };
      });

      overlays.unshift({ text: "None", value: "" });
      return overlays;
    }
  },
  mounted: function() {
    this.initMap(this.initialMapPosition, this.initialZoomLevel);
  },
  watch: {
    georasterLayerOpacity: {
      handler: function(newVal: number) {
        this.georasterLayer.setOpacity(newVal);
      }
    },
    currentOverlayUrl: {
      handler: function(newVal: string) {
        if (newVal === "") {
          this.currentOverlayLayer.removeFrom(this.lMapObj);
        } else {
          fetch(newVal)
            .then(res => res.json())
            .then(data => {
              this.currentOverlayLayer = L.geoJSON(data, {
                style: this.overlayStyle,
                onEachFeature: this.onEachFeature
              });

              this.currentOverlayLayer.addTo(this.lMapObj);
            });
        }
      }
    },
    geotiffUrl: {
      immediate: true,
      handler: function(newVal: string) {
        this.removeExistingGeoTif();
        this.loadAndAddGeoTif(newVal);
      }
    }
  },
  components: {
    ColorLegend
  },
  methods: {
    resetHighlight: function(e: L.LeafletEvent) {
      this.currentOverlayLayer.resetStyle(e.target);
      this.highlightedFeatureName = "";
    },

    overlayStyle: function(): L.PathOptions {
      return {
        fillColor: "#DC571D",
        weight: 2,
        opacity: 1,
        color: "#DC571D",
        fillOpacity: 0
      };
    },

    highlightFeature: function(e: L.LeafletEvent) {
      const layer = e.target;

      layer.setStyle({
        fillOpacity: 0.6
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }

      this.highlightedFeatureName = e.target.feature.properties.REGION;
    },

    zoomToFeature: function(e: L.LeafletEvent) {
      this.lMapObj.fitBounds(e.target.getBounds());
    },

    onEachFeature: function(feature: geojson.Feature, layer: L.GeoJSON) {
      layer.on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight,
        click: this.zoomToFeature
      });
    },
    initMap: function(center: LatLngExpression, zoom: number): void {
      this.lMapObj = L.map("map").setView(center, zoom);

      const backgroundLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
        }
      );

      backgroundLayer.addTo(this.lMapObj);
    },
    removeExistingGeoTif: function(): void {
      if (this.lMapObj && this.georasterLayer) {
        this.lMapObj.removeLayer(this.georasterLayer);
      }
    },
    loadAndAddGeoTif: function(url: string): void {
      const handleErrors = function(response: Response) {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      };
      fetch(url) // So far, it doesn't work with the inital file but it looks better once reprojected to 4326
        .then(handleErrors)
        .then(function(response) {
          return response.arrayBuffer();
        })
        .then(arrayBuffer => {
          parseGeoraster(arrayBuffer).then(georaster => {
            this.georasterLayer = new GeoRasterLayer({
              georaster: georaster,
              opacity: this.georasterLayerOpacity,
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
        .catch(() => {
          this.loadError = true;
        });
    }
  }
});
</script>