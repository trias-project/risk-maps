<template>
  <b-row class="bg-light py-3">
    <b-col cols="9">
      <b-alert :show="loadError" variant="warning">GeoTiff missing for this selection</b-alert>
      <div id="map"></div>
    </b-col>
    <b-col cols="3">
      <b-form>
        <b-form-group label="Overlays">
          <b-form-select
            v-model="currentOverlayUrl"
            :options="availableOverlaysForSelect"
            size="sm"
          ></b-form-select>
          <b-form-text id="highlightedRegion">
            {{ highlightedFeatureName }}
          </b-form-text>
        </b-form-group>

        <b-form-group label="Data layer opacity">
          <b-form-input
            :disabled="!geoTiffLayerVisible"
            id="opacity"
            v-model="geotifDataLayerOpacity"
            type="range"
            min="0"
            max="1"
            step="0.01"
          ></b-form-input>
          <color-legend
            v-if="geoTiffLayerVisible"
            :color-scale="colorScale"
            :opacity="geotifDataLayerOpacity"
            :topic="topic"
          ></color-legend>
        </b-form-group>
      </b-form>
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

const noHiglightedFeatureString = "";

export default Vue.extend({
  name: "RiskMap",
  props: {
    geotiffUrl: {
      type: String,
      default: null
    },
    occurrencesUrl: {
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
  },
  data: function () {
    return {
      lMapObj: (null as unknown) as L.Map,
      currentOverlayLayer: (null as unknown) as L.GeoJSON,
      currentOverlayUrl: "",
      highlightedFeatureName: noHiglightedFeatureString,
      highlightedFeatureKeyValue: "", // Overlays: features with the same value will be highlighted together
      initialMapPosition: [
        50.47294859181385,
        4.4839374800019005
      ] as LatLngExpression,
      initialZoomLevel: 8,
      occurrenceLayer: (null as unknown) as L.GeoJSON,
      geotifDataLayer: (null as unknown) as GeoRasterLayer,
      georasterTopic: "risk",
      geotifDataLayerOpacity: 0.7,
      colorScale: d3.scaleSequential(d3.interpolateTurbo).domain([0, 1]), // TODO: add typescript definition to avoid this error (+ the one in pixelsValuesToColorFn) (see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/38939)
      loadError: false
    };
  },
  computed: {
    geoTiffLayerVisible: function (): boolean {
      return this.geotiffUrl !== null
    },

    currentOverlayConf: function (): OverlayConf | undefined {
      return this.overlaysConf.find(e => {
        return e.url === this.currentOverlayUrl;
      });
    },

    overlayLayerVisible: function (): boolean {
      return this.currentOverlayLayer != null;
    },

    availableOverlaysForSelect: function () {
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
  mounted: function () {
    this.initMap(this.initialMapPosition, this.initialZoomLevel);
  },
  watch: {
    geotifDataLayerOpacity: {
      handler: function (newVal: number) {
        this.geotifDataLayer.setOpacity(newVal);
      }
    },
    currentOverlayUrl: {
      handler: function (newVal: string) {
        if (this.currentOverlayLayer) {
          this.currentOverlayLayer.removeFrom(this.lMapObj);
          this.currentOverlayLayer = (null as unknown) as L.GeoJSON;
        }

        if (newVal !== "") {
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
      handler: function (newUrl: string | null) {
        this.removeLayerFromMapIfExists(this.geotifDataLayer);
        if (newUrl !== null) {
          const handleErrors = function (response: Response) {
            if (!response.ok) {
              throw Error(response.statusText);
            }
            return response;
          };
          fetch(newUrl) // So far, it doesn't work with the inital file but it looks better once reprojected to 4326
            .then(handleErrors)
            .then(function (response) {
              return response.arrayBuffer();
            })
            .then(arrayBuffer => {
              parseGeoraster(arrayBuffer).then(georaster => {
                this.geotifDataLayer = new GeoRasterLayer({
                  georaster: georaster,
                  opacity: this.geotifDataLayerOpacity,
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

                this.addLayerToMap(this.geotifDataLayer);
                this.loadError = false;
              });
            })
            .catch(() => {
              this.loadError = true;
            });


        }
      }
    },
    occurrencesUrl: {
      immediate: true,
      handler: function (newUrl: string | null) {
        this.removeLayerFromMapIfExists(this.occurrenceLayer);
        if (newUrl !== null) {
          fetch(newUrl)
            .then(function (response) {
              return response.json();
            })
            .then(data => {
              this.occurrenceLayer = L.geoJSON(data);
              this.addLayerToMap(this.occurrenceLayer);
            });
        }
      }
    }
  },
  components: {
    ColorLegend
  },
  methods: {
    removeLayerFromMapIfExists(layer: L.GeoJSON | GeoRasterLayer): void {
      if (layer) {
        layer.removeFrom(this.lMapObj);
      }
    },

    addLayerToMap(layer: L.GeoJSON | GeoRasterLayer): void {
      this.lMapObj.addLayer(layer);
    },

    resetHighlight: function () {
      this.currentOverlayLayer.resetStyle();
      this.highlightedFeatureName = noHiglightedFeatureString;
      this.highlightedFeatureKeyValue = "";
    },

    overlayStyle: function (): L.PathOptions {
      return {
        fillColor: "#DC571D",
        weight: 2,
        opacity: 1,
        color: "#DC571D",
        fillOpacity: 0
      };
    },

    highlightFeature: function (e: L.LeafletEvent) {
      if (this.currentOverlayConf) {
        this.highlightedFeatureName =
          e.target.feature.properties[this.currentOverlayConf.nameProperty];
        this.highlightedFeatureKeyValue =
          e.target.feature.properties[this.currentOverlayConf.keyProperty];

        // All the features with the same name (polder...) are highlighted together
        // @ts-ignore: layer is L.GeoJSON, but the leaflet type definitions suggest it's a basic Layer object

        this.currentOverlayLayer.eachLayer((layer: L.GeoJSON) => {
          if (
            // @ts-ignore
            layer.feature.properties[this.currentOverlayConf.keyProperty] ==
            this.highlightedFeatureKeyValue
          ) {
            layer.setStyle({
              fillOpacity: 0.6
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
            }
          }
        });
      }
    },

    onEachFeature: function (feature: geojson.Feature, layer: L.GeoJSON) {
      layer.on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight
      });
    },
    initMap: function (center: LatLngExpression, zoom: number): void {
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
  }
});
</script>

<style scoped>
@import "../../node_modules/leaflet/dist/leaflet.css";
#map {
  height: 640px;
}

#highlightedRegion {
  min-height: 30px; /* So this block has height even without a highlighted region */
}
</style>
