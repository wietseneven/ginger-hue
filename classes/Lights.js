"use strict";
const hue = require('node-hue-api');
const HueApi = hue.HueApi;
const lightState = hue.lightState;

const config = require('../config');

class Lights {
  constructor() {
    this.list = this.list.bind(this);
    this.toggle = this.toggle.bind(this);
    this.lights = [];
  }

  setSocket(socket) {
    this.api = new HueApi(config.host, config.username);
    this.state = lightState.create();
    this.socket = socket;
  }

  list() {
    this.api.lights()
      .then(({lights}) => {
        this.lights = lights;
        this.socket.emit('lights new', lights);
      })
      .done();
  }

  toggle(ids) {
    if (typeof ids === 'object') {
      for (let i = 0; i < ids.length; i += 1) {
        this.toggleLight(ids[i])
      }
    } else {
      this.toggleLight(ids);
    }
  }

  lightExists(id) {
    for (let i = 0; i < this.lights.length; i += 1) {
      if (this.lights[i].id === id) return true;
    }
  }

  toggleLight(id) {
    if (!this.lightExists(id)) return;
    this.api.lightStatus(id)
      .then((light) => {

        const newState = (light.state.on) ? this.state.off() : this.state.on();
        this.api.setLightState(id, newState)
          .fail()
          .done(this.list);
      })
      .fail()
      .done();
  }
}

module.exports = Lights;