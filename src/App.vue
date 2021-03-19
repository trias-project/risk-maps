<template>
  <div id="app">
    <b-navbar type="light" variant="light">
      <b-container>
        <b-navbar-brand>TrIAS risk maps</b-navbar-brand>
      </b-container>
    </b-navbar>
    
    <Home />

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Home from "@/components/Home.vue";

export default Vue.extend({
  name: "App",
  components: {
    Home
  }
});
</script>

<style>
/* Colours and style */
.navbar {
  background-color: white!important;
  border-bottom: 1px solid #e9ecef;
}
</style>
