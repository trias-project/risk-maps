<template>
  <div id="app">
    <b-navbar type="light" variant="light">
      <b-container>
        <b-navbar-brand>TrIAS risk maps</b-navbar-brand>
      </b-container>
    </b-navbar>
    
    <Home />

    <footer class="bg-dark text-muted">
      <b-container>
        <b-row>
          <b-col cols="9">
            Created by the <a href="https://oscibio.inbo.be">Open science lab for biodiversity</a> for 
            <a href="http://trias-project.be">Tracking Invasive Alien Species (TrIAS)</a>.
          </b-col>
          <b-col cols="3" class="text-right">
            <a href="https://github.com/trias-project/risk-maps/">Source code</a> version 
            <code><a :href="'https://github.com/trias-project/risk-maps/tree/' + commitHash()">{{ commitHash() }}</a></code>
          </b-col>
        </b-row>
      </b-container>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Home from "@/components/Home.vue";

declare const __COMMIT_HASH__: string;

export default Vue.extend({
  name: "App",
  components: {
    Home
  },
  methods: {
    commitHash: function (): string {
      return __COMMIT_HASH__;
    },
  }
});
</script>

<style>
main {
  min-height: calc(
    100vh - 54px
  ); /* Viewport height minus medium screen navbar height, to push footer to bottom */
  padding-bottom: 30px; /* Don't stick to footer */
}
/* Colours and style */
.navbar {
  background-color: white!important;
  border-bottom: 1px solid #e9ecef;
}
.bg-dark {
  background-color: #2c2c2c!important; /* Slightly darker than #343a4f to improve contrast with text */
}
footer {
  border-top: 5px solid #e9ecef;
  font-size: 0.9rem;
  padding: 15px 0;
  }
  footer a,
  footer a:hover,
  footer a:visited {
    color: white;
  }
</style>
