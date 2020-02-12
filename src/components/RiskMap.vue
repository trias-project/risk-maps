<template>
    <h1>Toto {{ msg }}</h1>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'RiskMap',
  props: {
    msg: String,
  },
});
</script>

<style scoped>
</style>