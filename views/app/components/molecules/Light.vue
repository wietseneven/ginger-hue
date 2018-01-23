<template>
  <div class="card col-sm" style="margin: 1rem; border: 0;">
    <div class="card-body">
      <h5 class="card-title">
        <small>#{{id}}</small>
        {{name}}
      </h5>
      <p class="card-text">{{type}}</p>
      <div class="buttons">
        <button
            class="btn btn-light"
            @click="toggle(id)">
          {{stateTitle}}
        </button>

        <input
            @change="color(id)"
            v-model="colorInput"
            type="color"
        />

        <button
            class="btn btn-light"
            @click="randomColor(id)">
          Random color
        </button>

        <button
            class="btn btn-light"
            @click="blink(id)">
          Blink
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Light",
    mounted() {

    },
    methods: {
      updateLights(lights) {
        this.lights = lights;
      },
      hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
          return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        ] : null;
      },
      toggle(id) {
        socket.emit('lights toggle', { ids: id });
      },
      color(id) {
        clearTimeout(this.changeTimeout);
        this.changeTimeout = setTimeout(() => {
          socket.emit('lights color', { ids: id, data: this.hexToRgb(this.colorInput) });
        }, 200);
      },
      randomColor(id) {
        socket.emit('lights color', { ids: id });
      },
      blink(id) {
        // change data to true for long blink
        socket.emit('lights blink', { ids: id, data: false });
      }
    },
    props: [
      'name',
      'type',
      'id',
      'state'
    ],
    data() {
      return {
        colorInput: '#000',
        changeTimeout: false
      }
    },
    computed: {
      stateTitle: function () {
        if (this.state.on) {
          return 'On';
        } else {
          return 'Off';
        }
      }
    }
  };
</script>

<style>
  .buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.5em;
  }
</style>
