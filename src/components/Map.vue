<template>
  <b-row>
    <b-col cols="9">
      <b-alert :show="loadError" variant="warning">GeoTiff missing for this selection</b-alert>
      <div style="height: 640px">
        <div style="height: 100%; width: 100%;">
          <div id="map" style="height: 100%" />
        </div>
      </div>
    </b-col>

    <b-col cols="3">
      <h3 class="my-2">Overlays</h3>
      <b-form-select v-model="currentOverlayUrl" :options="availableOverlaysForSelect" size="sm"></b-form-select>
      <b-alert :variant="highlightedAlertVariant" class="my-2" :show="overlayLayerVisible"><small>Highlighted: {{ highlightedFeatureName }}</small></b-alert>
      <h3 class="my-2">Data layer</h3>
      <label for="opacity">Model opacity</label>
      <b-form-input
        :disabled="!showGeotiffLayer"
        id="opacity"
        v-model="geotifDataLayerOpacity"
        type="range"
        min="0"
        max="1"
        step="0.01"
      ></b-form-input>
      <color-legend
        v-if="showGeotiffLayer"
        :color-scale="colorScale"
        :opacity="geotifDataLayerOpacity"
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

const noHiglightedFeatureString = 'None';

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
    showGbifLayer: {
      type: Boolean
    },
    showGeotiffLayer: {
      type: Boolean
    }
  },
  data: function() {
    return {
      lMapObj: (null as unknown) as L.Map,
      currentOverlayLayer: (null as unknown) as L.GeoJSON,
      currentOverlayUrl: "",
      highlightedFeatureName: noHiglightedFeatureString,
      initialMapPosition: [
        50.47294859181385,
        4.4839374800019005
      ] as LatLngExpression,
      initialZoomLevel: 8,
      gbifDataLayer: (null as unknown) as L.TileLayer,
      geotifDataLayer: (null as unknown) as GeoRasterLayer,
      georasterTopic: "risk",
      geotifDataLayerOpacity: 0.7,
      colorScale: d3.scaleSequential(d3.interpolateTurbo).domain([0, 1]), // TODO: add typescript definition to avoid this error (+ the one in pixelsValuesToColorFn) (see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/38939)
      loadError: false
    };
  },
  computed: {
    highlightedAlertVariant: function(): string {
      if (this.highlightedFeatureName === noHiglightedFeatureString) {
        return 'dark'
      } else {
        return 'primary'
      }
    },

    overlayLayerVisible: function(): boolean {
      return (this.currentOverlayLayer != null);
    },

    gbifApiURL: function(): string {
      return `https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png?
        taxonKey=${this.taxonId}
        &bin=hex
        &hexPerTile=30
        &style=green.poly
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
    this.prepareGbifLayer();
    this.prepareGeotifLayer(this.geotiffUrl);
  },
  watch: {
    showGeotiffLayer: {
      handler: function(newVal: boolean) {
        if (newVal === true) {
          this.geotifDataLayer.addTo(this.lMapObj);
        } else {
          this.geotifDataLayer.removeFrom(this.lMapObj);
        }
      }
    },
    showGbifLayer: {
      handler: function(newVal: boolean) {
        if (newVal === true) {
          this.gbifDataLayer.addTo(this.lMapObj);
          this.gbifDataLayer.bringToFront();
        } else {
          this.gbifDataLayer.removeFrom(this.lMapObj);
        }
      }
    },
    geotifDataLayerOpacity: {
      handler: function(newVal: number) {
        this.geotifDataLayer.setOpacity(newVal);
      }
    },
    currentOverlayUrl: {
      handler: function(newVal: string) {
        if (newVal === "") {
          this.currentOverlayLayer.removeFrom(this.lMapObj);
          this.currentOverlayLayer = (null as unknown) as L.GeoJSON;
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
      handler: function(newUrl: string) {
        this.geotifDataLayer.removeFrom(this.lMapObj);
        this.prepareGeotifLayer(newUrl); // (will also add it, if needed)
      }
    },
    taxonId: {
      handler: function() {
        if (this.gbifDataLayer) {
          this.gbifDataLayer.removeFrom(this.lMapObj);
        }
        this.prepareGbifLayer();
        if (this.showGbifLayer) {
          this.gbifDataLayer.addTo(this.lMapObj);
          this.gbifDataLayer.bringToFront();
        }
      }
    }
  },
  components: {
    ColorLegend
  },
  methods: {
    resetHighlight: function(e: L.LeafletEvent) {
      this.currentOverlayLayer.resetStyle(e.target);
      this.highlightedFeatureName = noHiglightedFeatureString;
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

    onEachFeature: function(feature: geojson.Feature, layer: L.GeoJSON) {
      layer.on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight
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
    prepareGbifLayer: function(): void {
      this.gbifDataLayer = L.tileLayer(this.gbifApiURL, {
        opacity: 0.9
      });
    },
    prepareGeotifLayer: function(url: string): void {
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

            if(this.showGeotiffLayer) {
              this.geotifDataLayer.addTo(this.lMapObj);
            }

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