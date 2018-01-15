<template>
  <div class="card col-sm" style="margin: 1rem; border: 0;">
    <div class="card-body">
      <h5 class="card-title">{{name}}</h5>
      <p class="card-text">{{type}}</p>
      <button
          class="btn btn-primary"
          @click="toggle(id)">
        {{stateTitle}}
      </button>
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
      toggle(id) {
        socket.emit('light toggle', id);
      }
    },
    props: [
      'name',
      'type',
      'id',
      'state'
    ],
    computed: {
      stateTitle: function() {
        if (this.state.on) {
          return 'off';
        } else {
          return 'on';
        }
      }
    }
  };
</script>
