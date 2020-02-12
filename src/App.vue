<template>
  <div id="app">
    <RiskMap msg="truc" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import RiskMap from './components/RiskMap.vue'

export default Vue.extend({
  name: 'App',
  components: {
    RiskMap
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
