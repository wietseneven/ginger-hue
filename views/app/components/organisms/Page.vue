<template>
  <div class="container">
    <slot />
  </div>
</template>

<script>

export default {
  name: "Page",
  components: {
  },
  methods: {
    menuChange(open) {
      this.menuOpen = open;
    }
  },
  props: {
    showNavigation: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menuOpen: this.showNavigation
    };
  }
};
</script>

<style lang="scss">

</style>