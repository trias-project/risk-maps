<template>
  <div>
    <b-row>
      <b-col>
        <b-form inline>
          <b-form-select v-model="speciesId" :options="availableSpecies"></b-form-select>
        </b-form>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <Map :geotiff-url="geotiffUrl" />
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import Map from "./Map.vue";

export default Vue.extend({
  name: "RiskMapApp",
  props: {},
  data: function() {
    return {
      speciesId: null,
      availableSpecies: [
          { value: null, text: 'Please select an option' },
          // TODO: load available species from (automatically generated) config file
          { value: 3189866, text: 'Acer negundo L.' },
          { value: 3190653, text: 'Ailanthus altissima (Mill.) Swingle'}
        ],
      
      publicPath: process.env.BASE_URL,
    };
  },
  methods: {
  },
  computed: {
    geotiffUrl: function(): string {
      return `${this.publicPath}geotiffs/be_3190653_hist.4326.tif`;
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