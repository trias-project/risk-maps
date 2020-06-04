<template>
  <b-row>
    <b-col cols="9">
      <b-alert :show="loadError" variant="warning">GeoTiff missing for this selection</b-alert>
      <div id="map" style="height: 640px; width: 825px;" />
    </b-col>

    <b-col cols="3">
      <h3 class="my-2">Overlays</h3>
      <b-form-select v-model="currentOverlayUrl" :options="availableOverlaysForSelect" size="sm"></b-form-select>
      <p v-if="highlightedFeatureName">Highlighted feature: {{ highlightedFeatureName }}</p>
      <h3 class="my-2">Data layer</h3>
      <label for="opacity">Opacity</label>
      <b-form-input
        id="opacity"
        v-model="dataLayerOpacity"
        type="range"
        min="0"
        max="1"
        step="0.01"
      ></b-form-input>
      <color-legend
        v-if="gbifMode === false"
        :color-scale="colorScale"
        :opacity="dataLayerOpacity"
        :topic="topic"
      ></color-legend>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import Vue from "vue";
import ColorLegend from "./ColorLegend.vue";
import L, { LatLngExpression, TileLayer } from "leaflet";
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
      default: (): OverlayConf[] => []
    },
    topic: {
      type: String
    },
    taxonId: {
      type: Number
    },
    gbifMode: {
      type: Boolean // If true, the distribution of taxonId is shown instead of the Geotiff
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
      currentDataLayer: (null as unknown) as L.TileLayer | GeoRasterLayer,
      georasterTopic: "risk",
      dataLayerOpacity: 0.7,
      colorScale: d3.scaleSequential(d3.interpolateTurbo).domain([0, 1]), // TODO: add typescript definition to avoid this error (+ the one in pixelsValuesToColorFn) (see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/38939)
      loadError: false
    };
  },
  computed: {
    gbifApiURL: function(): string {
      return `https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png?
        taxonKey=${this.taxonId}
        &bin=hex
        &hexPerTile=30
        &style=purpleYellow.poly
        &country=BE
        &basisOfRecord=OBSERVATION
        &basisOfRecord=HUMAN_OBSERVATION
        &basisOfRecord=MACHINE_OBSERVATION
        &basisOfRecord=MATERIAL_SAMPLE
        &basisOfRecord=PRESERVED_SPECIMEN
        &basisOfRecord=LIVING_SPECIMEN
        &basisOfRecord=LITERATURE`.replace(/ /g, "");
    },

    availableOverlaysForSelect: function() {
      const overlays = this.overlaysConf.map((e: OverlayConf) => {
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
    gbifMode: {
      handler: function() {
        this.renderDataLayer();
      }
    },
    dataLayerOpacity: {
      handler: function(newVal: number) {
        if (this.currentDataLayer) {
          this.currentDataLayer.setOpacity(newVal);
        }
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
      handler: function() {
        this.renderDataLayer();
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
    renderDataLayer: function() {
      this.removeDataLayer();
      if (this.gbifMode) {
        this.loadAndAddGbif();
      } else {
        this.loadAndAddGeoTif(this.geotiffUrl);
      }
    },
    removeDataLayer: function(): void {
      if (this.lMapObj && this.currentDataLayer) {
        this.lMapObj.removeLayer(this.currentDataLayer);
      }
    },
    loadAndAddGbif: function(): void {
      this.currentDataLayer = L.tileLayer(this.gbifApiURL, {
        opacity: this.dataLayerOpacity
      });
      this.currentDataLayer.addTo(this.lMapObj);
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
            this.currentDataLayer = new GeoRasterLayer({
              georaster: georaster,
              opacity: this.dataLayerOpacity,
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
            this.currentDataLayer.addTo(this.lMapObj);

            this.lMapObj.fitBounds(this.currentDataLayer.getBounds());
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