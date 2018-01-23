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

    <div class="row">
      <h2 class="col-sm" style="color: #fff; margin: 1em 0 0;">Your choices</h2>
    </div>
    <div class="row">
      <div
          v-for="(choice, index) in choices"
          class="card col-sm"
          :style="{margin: '1rem', border: 0, backgroundColor: `rgb(${colors[index].join(',')})`}"
      >
        <div class="card-body">
          <h5 class="card-title" style="color: #fff;">
            {{choice}}
          </h5>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm">
        <button
            class="btn"
            @click="reset()">
          Reset
        </button>
      </div>
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

        socket.on('lights average new', this.updateBackground);
      }
    },
    methods: {
      updateLights(lights) {
        this.lights = lights;
      },
      updateBackground(color) {
        console.log(color);
        document.body.style.backgroundColor = `rgb(${color.join(',')})`;
      },
      checkKeys({ key }) {
        // Check if it's in range for our buttons
        if (key >= 0 && key <= 3) {
          this.selectedColors.push(this.colors[key]);
          this.choices[key] += 1;

          localStorage.setItem('selectedColors', JSON.stringify(this.selectedColors));
          localStorage.setItem('choices', JSON.stringify(this.choices));

          socket.emit('lights average', { ids: ['1', '3', '5'], data: this.selectedColors });
        }

        for (let i = 0; i < hue_data.app.program.length; i += 1) {
          const program = hue_data.app.program[i];
          if (program.key === key) {
            socket.emit(program.function, { ids: program.lights, data: program.data });
          }
        }
      },
      reset() {
        this.selectedColors = [];
        this.choices = [0, 0, 0, 0];

        localStorage.setItem('selectedColors', JSON.stringify([]));
        localStorage.setItem('choices', JSON.stringify([]));
      }
    },
    data() {
      const selectedColors = JSON.parse(localStorage.getItem('selectedColors'));
      const choices = JSON.parse(localStorage.getItem('choices'));

      return {
        lights: [],
        colors: [
          [255, 0, 0],
          [0, 255, 0],
          [0, 0, 255],
          [100, 0, 255]
        ],
        selectedColors: selectedColors || [],
        choices: choices || [0, 0, 0, 0]
      }
    }
  };
</script>

<style lang="scss">
  .card {
    border: 0;
  }
</style>