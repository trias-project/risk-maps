<template>
    <b-row class="my-3">
      <b-col>
        <b-form>
          <b-form-group label-cols="2" label="Species">
            <b-form-select v-model="speciesId" :options="availableSpecies" size="sm"></b-form-select>
          </b-form-group>
  <main>
    <b-container fluid>

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
    </b-container>
  </main>
</template>

<script lang="ts">
import Vue from "vue";

import Map from "./Map.vue";
import { OverlayConf } from "../interfaces";

export default Vue.extend({
  name: "Home",
  props: {},
  data: function () {
    const species = [
      {
        "value": 2489010,
        "text": "Acridotheres cristatellus (Linnaeus, 1758)"
      },
      {
        "value": 2498388,
        "text": "Aix galericulata (Linnaeus, 1758)"
      },
      {
        "value": 2498387,
        "text": "Aix sponsa (Linnaeus, 1758)"
      },
      {
        "value": 2498110,
        "text": "Anas sibilatrix Poeppig, 1829"
      },
      {
        "value": 5281901,
        "text": "Campylopus introflexus Bridel, 1819"
      },
      {
        "value": 5189032,
        "text": "Corbicula fluminalis (O.F.M\u00fcller, 1774)"
      },
      {
        "value": 8190231,
        "text": "Corbicula fluminea (O.F.M\u00fcller, 1774)"
      },
      {
        "value": 3663237,
        "text": "Cornus sanguinea subsp. australis (C.A.Mey.) J\u00e1v."
      },
      {
        "value": 8421432,
        "text": "Cornus sanguinea subsp. hungarica (K\u00e1rp\u00e1ti) So\u00f3"
      },
      {
        "value": 3082244,
        "text": "Cornus sericea L."
      },
      {
        "value": 2715482,
        "text": "Cyperus eragrostis Lam."
      },
      {
        "value": 2716226,
        "text": "Cyperus esculentus L."
      },
      {
        "value": 5220136,
        "text": "Dama dama (Linnaeus, 1758)"
      },
      {
        "value": 8745918,
        "text": "Deroceras invadens Reise, Hutchinson, Schunack & Schlitt, 2011"
      },
      {
        "value": 7190901,
        "text": "Graptemys pseudogeographica pseudogeographica"
      },
      {
        "value": 2891783,
        "text": "Impatiens balfourii Hook.fil."
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
        "value": 2891782,
        "text": "Impatiens parviflora DC."
      },
      {
        "value": 9291405,
        "text": "Massylaea vermiculata (O.F.M\u00fcller, 1774)"
      },
      {
        "value": 2479407,
        "text": "Myiopsitta monachus (Boddaert, 1783)"
      },
      {
        "value": 2455523,
        "text": "Orthriophis taeniurus (Cope, 1861)"
      },
      {
        "value": 9185677,
        "text": "Podarcis siculus (Rafinesque-schmaltz, 1810)"
      },
      {
        "value": 5192470,
        "text": "Potamopyrgus antipodarum (Gray, 1843)"
      },
      {
        "value": 5229055,
        "text": "Psittacula eupatria (Linnaeus, 1766)"
      },
      {
        "value": 2479226,
        "text": "Psittacula krameri (Scopoli, 1769)"
      },
      {
        "value": 3003709,
        "text": "Rosa glauca Pourr."
      },
      {
        "value": 3003244,
        "text": "Rosa multiflora Thunb."
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
        "value": 4559541,
        "text": "Sinanodonta woodiana (I.Lea, 1834)"
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
        "value": 7826906,
        "text": "Thectocercus acuticaudatus (Vieillot, 1818)"
      },
      {
        "value": 2882849,
        "text": "Vaccinium corymbosum L."
      },
      {
        "value": 7777960,
        "text": "Vaccinium macrocarpum Aiton"
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
    modelCurrentlyVisible: function (): boolean {
      return (this.modelOrRealized === "realized" ? false : true)
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
        { filename: "bioregions.geojson", label: "Bioregions", keyProperty: "PK_UID", nameProperty: "name" }
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

<style scoped>
@import "../../node_modules/leaflet/dist/leaflet.css";

div#map {
  width: 800px;
  height: 600px;
}
</style>
