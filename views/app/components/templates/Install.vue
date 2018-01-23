<template>
  <div class="row justify-content-md-center">
    <div class="card" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Looks like you didn't install anything yet!</h5>
        <p class="card-text">Let's go look for some bridges in your network. Make sure your Bridge is connected to the
          same network.</p>
        <p class="card-text">Press the button on top of the bridge when you want to connect.</p>
        <button class="btn btn-primary" @click="this.lookForBridges" v-if="!this.looking">Let's go</button>
        <div v-else>
          <em v-if="!this.done">Looking for bridges...</em>
          <ul class="list-group">
            <li class="list-group-item" v-if="this.done && !this.bridges.length" @click="this.lookForBridges"
                style="cursor: pointer">No bridges found, retry?
            </li>
            <li class="list-group-item" v-for="bridge in bridges" @click="registerBridge(bridge.ipaddress)">
              {{bridge.name}}
              <small>{{bridge.ipaddress}}</small>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as types from "../../store/mutation-types";

  export default {
    name: "Install",
    methods: {
      lookForBridges() {
        this.done = false;
        this.looking = true;

        socket.emit('bridges list', '');
        socket.on('bridges list new', (bridges) => {
          this.bridges = bridges;
          this.done = true;
        });
      },
      registerBridge(bridge) {
        socket.emit('bridge register', { bridge, description: 'Mijn nieuwe bridge' });

        socket.on('register error', (msg) => {
          alert(msg.message)
        });

        socket.on('register success', () => {
          alert('Registering succesful! Please restart your server');
          this.$store.commit(types.RECEIVE_SITE, { site: {isConfigurated:true} });
          window.location = 'http://localhost:3000';
        });
      }
    },
    data() {
      return {
        looking: false,
        done: false,
        bridges: []
      }
    }
  };
</script>

<style lang="scss">
  .card {
    border: 0;
  }
</style>