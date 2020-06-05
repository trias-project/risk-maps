<template>
  <div>
    <b-row class="my-3">
      <b-col>
        <b-form>
          <b-form-group label-cols="2" label="Species">
            <b-form-select v-model="speciesId" :options="availableSpecies" size="sm"></b-form-select>
          </b-form-group>

          <b-form-group label-cols="2" label="Show">
            <b-form-radio-group
              id="btn-radios-1"
              v-model="modelOrRealized"
              :options="modelOrRealizedOptions"
              buttons
              button-variant="outline-primary"
              size="sm"
              name="radios-btn-default"
            ></b-form-radio-group>
          </b-form-group>

          <b-form-group label-cols="2" label="Model scenario">
            <b-form-select v-model="climateScenarioId" :options="availableScenarii" size="sm" :disabled="!modelCurrentlyVisible"></b-form-select>
          </b-form-group>
          
          <b-form-group label-cols="2" label="Model type">
            <b-form-select v-model="mapTypeId" :options="availableMapTypes" size="sm" :disabled="!modelCurrentlyVisible"> </b-form-select>
          </b-form-group>  
        </b-form>
      </b-col>
    </b-row>

    <Map
      :geotiff-url="geotiffUrl"
      :overlays-conf="overlaysConf"
      :topic="mapTopic"
      :taxonId="speciesId"
      :showGbifLayer="gbifCurrentlyVisible"
      :showGeotiffLayer="modelCurrentlyVisible"
    />
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
    const species = [
      {
        value: 3189866,
        text: "Acer negundo L."
      },
      {
        value: 3190653,
        text: "Ailanthus altissima (Mill.) Swingle"
      },
      {
        value: 3024109,
        text: "Amelanchier lamarckii F.G.Schroed."
      },
      {
        value: 3039269,
        text: "Elaeagnus angustifolia L."
      }
    ];

    return {
      speciesId: species[1].value,
      availableSpecies: species,

      climateScenarioId: "hist",
      availableScenarii: [
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

      mapTypeId: "",
      availableMapTypes: [
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

      modelOrRealized: "model",
      modelOrRealizedOptions: [
        { text: "Model", value: "model" },
        { text: "Realized (GBIF) distribution", value: "realized" },
        { text: "Both (surimposed)", value: "both" }
      ],

      publicPath: process.env.BASE_URL
    };
  },
  methods: {},
  computed: {
    modelCurrentlyVisible: function(): boolean {
      return (this.modelOrRealized === 'realized' ? false : true)
    },
    gbifCurrentlyVisible: function(): boolean {
      return (this.modelOrRealized === 'model' ? false : true)
    },
    mapTopic: function(): string {
      switch (this.mapTypeId) {
        case "diff":
          return "risk difference";
        case "conf":
          return "confidence";
        default:
          return "risk";
      }
    },
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