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
        socket.on('lights new', this.updateLights);

        window.addEventListener('keydown', this.checkKeys);
      }
    },
    methods: {
      updateLights(lights) {
        this.lights = lights;
      },
      checkKeys({ key }) {
        for (let i = 0; i < hue_data.app.program.length; i += 1) {
          const program = hue_data.app.program[i];
          if (program.key === key) {
            socket.emit(program.function, program.lights);
          }
        }
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