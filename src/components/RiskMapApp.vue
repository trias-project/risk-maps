<template>
  <div>
    <b-row class="my-3">
      <b-col>
        <b-form>
          <b-form-select v-model="speciesId" :options="availableSpecies" size="sm"></b-form-select>
          <b-form-select v-model="climateScenarioId" :options="availableScenarii" size="sm"></b-form-select>
          <b-form-select v-model="mapTypeId" :options="availableMapTypes" size="sm"></b-form-select>
        </b-form>
      </b-col>
    </b-row>
    
    <Map :geotiff-url="geotiffUrl" :overlays-conf="overlaysConf" />
    
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import Map from "./Map.vue";
import { OverlayConf } from "../interfaces";

export default Vue.extend({
  name: "RiskMapApp",
  props: {},
  data: function() {
    return {
      speciesId: null,
      availableSpecies: [
        { value: null, text: "-- Please select a species --", disabled: true },
        // TODO: load available species from (automatically generated) config file
        { value: 3189866, text: "Acer negundo L." },
        { value: 3190653, text: "Ailanthus altissima (Mill.) Swingle" }
      ],

      climateScenarioId: null,
      availableScenarii: [
        {
          value: null,
          text: "-- Please select an scenario --",
          disabled: true
        },
        { value: "hist", text: "model based on historical climate data" },
        {
          value: "rcp26",
          text: "model based on climate forecasts under RCP 2.6 for 2040-2070"
        },
        {
          value: "rcp45",
          text: "model based on climate forecasts under RCP 4.5 for 2040-2071"
        },
        {
          value: "rcp85",
          text: "model based on climate forecasts under RCP 8.5 for 2040-2072"
        }
      ],

      mapTypeId: null,
      availableMapTypes: [
        { value: null, text: "-- Please select a map type --", disabled: true },
        { value: "", text: "risk map" },
        {
          value: "diff",
          text:
            "map of difference in risk between the RCP climate scenario risk maps and the risk map based on historical climate"
        },
        {
          value: "conf",
          text: "map of confidence of predicted risk for each risk map"
        }
      ],

      publicPath: process.env.BASE_URL
    };
  },
  methods: {},
  computed: {
    overlaysConf: function(): OverlayConf[] {
      return [{ filename: "ecoregions.geojson", label: "Ecoregions" }].map(
        e => {
          return {
            url: `${this.publicPath}overlays/${e.filename}`,
            name: e.label
          };
        }
      );
    },
    geotiffUrl: function(): string {
      if (this.selectionMade) {
        if (this.mapTypeId === "") {
          return `${this.publicPath}geotiffs/be_${this.speciesId}_${this.climateScenarioId}.4326.tif`;
        } else {
          return `${this.publicPath}geotiffs/be_${this.speciesId}_${this.climateScenarioId}_${this.mapTypeId}.4326.tif`;
        }
      } else {
        return "";
      }
    },
    selectionMade: function(): boolean {
      return this.climateScenarioId != null &&
        this.speciesId != null &&
        this.mapTypeId != null
        ? true
        : false;
    }
  },
  components: {
    Map
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