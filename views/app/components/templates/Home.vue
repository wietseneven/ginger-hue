<template>
  <div>
    <div class="jumbotron">
      <h1 class="display-4">Ginger Hue!</h1>
      <p class="lead">Let's interact with your lights</p>
    </div>

    <div class="row">
      <Light
          v-for="light in lights"
          :key="light.id"
          :id="light.id"
          :name="light.name"
          :type="light.type"
          :state="light.state"
      />
    </div>
  </div>
</template>

<script>
  import Light from '../molecules/Light';

  export default {
    name: "Home",
    components: {
      Light
    },
    mounted() {
      if (!this.$store.getters.isConfigured()) {
        this.$router.push({ name: "install" });
      } else {
        socket.emit('lights list');
        socket.on('lights new', this.updateLights)
      }
    },
    methods: {
      updateLights(lights) {
        console.log(lights);
        this.lights = lights;
      }
    },
    data() {
      return {
        lights: []
      }
    }
  };
</script>

<style lang="scss">
  .card {
    border: 0;
  }
</style>