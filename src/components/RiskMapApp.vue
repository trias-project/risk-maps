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
      :occurrences-url="occurrencesUrl"
      :overlays-conf="overlaysConf"
      :topic="mapTopic"
      :showOccurrenceLayer="occurrencesCurrentlyVisible"
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
    "value": 3189866,
    "text": "Acer negundo L."
  },
  {
    "value": 3190653,
    "text": "Ailanthus altissima (Mill.) Swingle"
  },
  {
    "value": 3024109,
    "text": "Amelanchier lamarckii F.G.Schroed."
  },
  {
    "value": 3039269,
    "text": "Elaeagnus angustifolia L."
  },
  {
    "value": 2891783,
    "text": "Impatiens balfourii Hook.f."
  },
  {
    "value": 2891774,
    "text": "Impatiens capensis Meerb."
  },
  {
    "value": 2891770,
    "text": "Impatiens glandulifera Royle"
  },
  {
    "value": 3003709,
    "text": "Rosa glauca Pourr."
  },
  {
    "value": 7501634,
    "text": "Rosa multiflora Murray"
  },
  {
    "value": 2992543,
    "text": "Rubus laciniatus Willd."
  },
  {
    "value": 2993761,
    "text": "Rubus spectabilis Pursh"
  },
  {
    "value": 9202318,
    "text": "Symphyotrichum lanceolatum (Willd.) G.L.Nesom"
  },
  {
    "value": 3151618,
    "text": "Symphyotrichum novae-angliae (L.) G.L.Nesom"
  },
  {
    "value": 3151558,
    "text": "Symphyotrichum novi-belgii (L.) G.L.Nesom"
  },
  {
    "value": 2882849,
    "text": "Vaccinium corymbosum L."
  },
  {
    "value": 7777960,
    "text": "Vaccinium macrocarpum Ait."
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
          text: "model based on climate forecasts under RCP 4.5 for 2040-2070"
        },
        {
          value: "rcp85",
          text: "model based on climate forecasts under RCP 8.5 for 2040-2070"
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
        { text: "Modelled data", value: "model" },
        { text: "Occurrence data", value: "realized" },
        { text: "Both", value: "both" }
      ],

      publicPath: process.env.BASE_URL
    };
  },
  methods: {},
  computed: {
    modelCurrentlyVisible: function(): boolean {
      return (this.modelOrRealized === 'realized' ? false : true)
    },
    occurrencesCurrentlyVisible: function(): boolean {
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
      return [
        { filename: "ecoregions.geojson", label: "Ecoregions", keyProperty: 'REGION', nameProperty: 'REGION' },
        { filename: "bioregions.geojson", label: "Bioregions", keyProperty: 'PK_UID', nameProperty: 'name' }
        ].map( // The features that have the same 'REGION' property will be highlighted together
        e => {
          return {
            url: `${this.publicPath}overlays/${e.filename}`,
            name: e.label,
            keyProperty: e.keyProperty,
            nameProperty: e.nameProperty
          };
        }
      );
    },
    occurrencesUrl: function(): string {
      return `${this.publicPath}occurrences/be_${this.speciesId}_occurrences.geojson`;
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
