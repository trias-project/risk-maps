<template>
  <main>
    <b-container class="mt-3 d-none">
      <p>Disclaimer ...</p>
    </b-container>
    <b-container fluid>
      <b-row>
        <b-col class="bg-dark text-light pt-3">
          <b-form>
            <b-row>
              <b-col lg="7">
                <b-form-group label="Species" label-cols="3">
                  <b-form-select
                    v-model="speciesId"
                    :options="speciesForSelect"
                    size="sm"
                  ></b-form-select>
                </b-form-group>
              </b-col>

              <b-col lg="5">
                <b-form-group label="Show" label-cols="3">
                  <b-form-radio-group
                    id="btn-radios-1"
                    v-model="modelOrRealized"
                    :options="modelOrRealizedOptions"
                    buttons
                    button-variant="outline-secondary"
                    size="sm"
                    name="radios-btn-default"
                  ></b-form-radio-group>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col lg="7">
                <b-form-group label="Model scenario" label-cols="3">
                  <b-form-select
                    v-model="climateScenarioId"
                    :options="availableScenarii"
                    size="sm"
                    :disabled="!modelCurrentlyVisible"
                  ></b-form-select>
                </b-form-group>
              </b-col>

              <b-col lg="5">
                <b-form-group label="Model type" label-cols="3">
                  <b-form-select
                    v-model="mapTypeId"
                    :options="availableMapTypes"
                    size="sm"
                    :disabled="!modelCurrentlyVisible"
                  ></b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
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
    </b-container>
  </main>
</template>

<script lang="ts">
import Vue from "vue";

import Map from "./Map.vue";
import { OverlayConf, SpeciesSelectOption, SpeciesConfigEntry, FormRadioOption } from "../interfaces";
import species_config from '../species_config.json';

export default Vue.extend({
  name: "Home",
  props: {},
  data: function () {
    const species = species_config  as SpeciesConfigEntry[];

    return {
      speciesId: species[0].value,
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
      publicPath: process.env.BASE_URL
    };
  },
  methods: {},
  watch: {
    speciesId: {
      immediate: true,
      handler: function() {
        const selection = this.selectedSpeciesConfig;
        if (selection?.hasOccurrenceData && selection.hasModellingData) {
          this.modelOrRealized = 'both'
        } else {
          if (selection?.hasOccurrenceData && !selection.hasModellingData) {
            this.modelOrRealized = 'realized';
          } else {
            this.modelOrRealized = 'model';
          }
        }
      }
    }
  },
  computed: {
    modelOrRealizedOptions: function(): FormRadioOption[] {
      return [
        { 
          text: "Modelled data", 
          value: "model",
          disabled: !(this.selectedSpeciesConfig.hasModellingData)
        },
        { 
          text: "Occurrence data", 
          value: "realized",
          disabled: !(this.selectedSpeciesConfig.hasOccurrenceData)
        },
        { 
          text: "Both", 
          value: "both",
          disabled: !(this.selectedSpeciesConfig.hasModellingData && this.selectedSpeciesConfig.hasOccurrenceData)
        }
      ]
    },
    selectedSpeciesConfig: function(): SpeciesConfigEntry {
      const found = this.availableSpecies.find(s => s.value == this.speciesId)
      return found ? found: this.availableSpecies[0]
    },
    modelCurrentlyVisible: function (): boolean {
      return (this.modelOrRealized === "realized" ? false : true)
    },
    speciesForSelect: function (): SpeciesSelectOption[] {
      return this.availableSpecies.map(s => {
        return {
          text: `${s.text} ${s.hasOccurrenceData ? '🌍':''} ${s.hasModellingData ? '📈':''}`,
          value: s.value,
        }
      });
    },
    occurrencesCurrentlyVisible: function (): boolean {
      return (this.modelOrRealized === "model" ? false : true)
    },
    mapTopic: function (): string {
      switch (this.mapTypeId) {
        case "diff":
          return "risk difference";
        case "conf":
          return "confidence";
        default:
          return "risk";
      }
    },
    overlaysConf: function (): OverlayConf[] {
      return [
        { filename: "ecoregions.geojson", label: "Ecoregions", keyProperty: "REGION", nameProperty: "REGION" },
        { filename: "bioregions.geojson", label: "Bioregions", keyProperty: "PK_UID", nameProperty: "name" },
        { filename: "drainage_basins.geojson", label: "Drainage basins", keyProperty: "name", nameProperty: "name"},
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
    occurrencesUrl: function (): string {
      return `${this.publicPath}occurrences/be_${this.speciesId}_occurrences.geojson`;
    },
    geotiffUrl: function (): string {
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
    selectionMade: function (): boolean {
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
