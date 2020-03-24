<template>
  <div id="app">
    <b-container fluid>
      <b-navbar type="light" variant="light" toggleable="lg">
        <b-navbar-brand>TriAS risk maps</b-navbar-brand>
      </b-navbar>
    </b-container>

    <b-container>
      <RiskMap msg="truc" />
    </b-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import RiskMap from "./components/RiskMap.vue";

export default Vue.extend({
  name: "App",
  components: {
    RiskMap
  }
});
</script>