<template>
  <div id="app">
    <b-container fluid>
      <b-navbar type="light" variant="light" toggleable="lg">
        <b-navbar-brand>TriAS risk maps</b-navbar-brand>
      </b-navbar>
    </b-container>

    <b-container>
      <RiskMapApp />
    </b-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import RiskMapApp from "./components/RiskMapApp.vue";

export default Vue.extend({
  name: "App",
  components: {
    RiskMapApp
  }
});
</script>