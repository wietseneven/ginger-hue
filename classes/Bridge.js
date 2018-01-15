"use strict";
const hue = require('node-hue-api');
const fs = require('fs');

const hueApi = new hue.HueApi();

class Bridge {
  constructor() {
    this.list = this.list.bind(this);
  }

  setSocket(socket) {
    this.socket = socket;
  }

  list() {
    hue.nupnpSearch()
      .then((bridge) => {
        this.socket.emit('bridges list new', bridge);
      })
      .done();
  }

  registerOnBridge(host, userDescription) {
    hueApi.registerUser(host, userDescription)
      .then((res) => {
        const data = {
          username: res,
          host: host
        };

        fs.writeFile(__dirname + '/../config.json', JSON.stringify(data), (err) => {
          if (err) throw err;
          console.log("The file was succesfully saved!");
        });

        this.socket.emit('register success', true);
      })
      .fail((err) => {
        console.log(err);
        this.socket.emit('register error', err);
      })
      .done();
  }
}

module.exports = Bridge;