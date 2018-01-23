"use strict";
const hue = require('node-hue-api');
const HueApi = hue.HueApi;
const lightState = hue.lightState;

const color = require('./Color');
const Color = new color();

const config = require('../config');

class Lights {
  constructor() {
    this.list = this.list.bind(this);
    this.toggle = this.toggle.bind(this);
    this.color = this.color.bind(this);
    this.blink = this.blink.bind(this);
    this.average = this.average.bind(this);
    this.lights = [];
    this.api = {};
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
      .fail((err) => {
        console.log(err);
      })
      .done();
  }

  sent(ids, callback) {
    if (typeof ids === 'object') {
      for (let i = 0; i < ids.length; i += 1) {
        if (this.lightExists(ids[i])) callback(ids[i])
      }
    } else {
      if (this.lightExists(ids)) callback(ids);
    }
  }

  toggle({ids}) {
    this.sent(ids, (id) => {
      this.toggleLight(id);
    });
  }

  lightExists(id) {
    for (let i = 0; i < this.lights.length; i += 1) {
      if (this.lights[i].id === id) return true;
    }
  }

  toggleLight(id) {
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

  color({ids, data}) {
    this.sent(ids, (id) => {
      this.colorLight(id, data);
    });
  }

  colorLight(id, color) {
    color = (color) ? color : [Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255)];
    const newState = this.state.on().rgb(color);
    this.api.setLightState(id, newState)
      .fail((err) => {
        console.log(err);
      })
      .done(this.list);
  }

  blink({ids, data}) {
    this.sent(ids, (id) => {
      this.blinkLight(id, data);
    });
  }

  blinkLight(id, long) {
    const newState = (long) ? this.state.longAlert() : this.state.shortAlert();
    this.api.setLightState(id, newState)
      .fail((err) => {
        console.log(err);
      })
      .done(this.list);
  }

  average({ids, data}) {
    const rgb = Color.averageRgbs(data);
    this.color({ids, data: rgb})
  }
}

module.exports = Lights;