"use strict";
const hue = require('node-hue-api');
const HueApi = hue.HueApi;
const lightState = hue.lightState;

const config = require('../config');

class Lights {
  constructor() {
    this.list = this.list.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  setSocket(socket) {
    this.api = new HueApi(config.host, config.username);
    this.state = lightState.create();
    this.socket = socket;
  }

  list() {
    this.api.lights()
      .then(({lights}) => {
        this.socket.emit('lights new', lights);
      })
      .done();
  }

  toggle(id) {
    this.api.lightStatus(id)
      .then((light) => {

        const newState = (light.state.on) ? this.state.off() : this.state.on();
        this.api.setLightState(id, newState)
          .fail()
          .done(this.list);
      })
      .done();
  }
}

module.exports = Lights;