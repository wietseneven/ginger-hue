<template>
  <div id="app">
    <Page>
      <router-view :key="$route.path"></router-view>
    </Page>
  </div>
</template>

<script>
import debounce from "lodash.debounce";
import EventBus from "./util/EventBus";
import * as types from "./store/mutation-types";

import Page from './components/organisms/Page';

export default {
  name: "app",
  components: {
    Page
  },
  data() {
    return {};
  },
  beforeCreate() {
    this.$store.commit(types.RECEIVE_PAGES, { pages: window.hue_data.pages });
    this.$store.commit(types.RECEIVE_SITE, { site: window.hue_data.site });
  }
};
</script>

<style lang="scss">
@import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

#app {
  min-height: 100%;
  margin-top: 2em;
}

body {
    background: #c00d0d;  
}
</style>
