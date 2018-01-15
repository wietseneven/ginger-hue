"use strict";
const express = require('express');
const http = require('http');
const socket = require('socket.io');
const cons = require('consolidate');
const fs = require('fs');
const stringifyObject = require('stringify-object');

const application = require('./application');

const bridge = require('./classes/Bridge');
const Bridge = new bridge();

const lights = require('./classes/Lights');
const Lights = new lights();

class App {
  constructor() {
    this.app = express();
    this.server = http.Server(this.app);
    this.io = socket(this.server);

    this.createServer();
    this.listen();
  }

  static getDefaults() {
    if (fs.existsSync(__dirname + '/config.json')) {
      return { isConfigurated: true }
    } else {
      return { isConfigurated: false }
    }
  }

  createServer() {
    this.app.engine('html', cons.mustache);
    this.app.set('view engine', 'html');

    this.app.use('/assets', express.static('views/build/assets'));

    this.app.get('*', (req, res) => {
      res.render(__dirname + '/views/build/index', {
        data: stringifyObject(App.getDefaults()), app: stringifyObject(application)
      });
    });

    this.server.listen(3000, function () {
      console.log('listening on *:3000');
    });
  }

  listen() {
    this.io.on('connection', (socket) => {
      Bridge.setSocket(socket);
      Lights.setSocket(socket);

      socket.on('bridges list', Bridge.list);

      socket.on('bridge register', (data) => {
        Bridge.registerOnBridge(data.bridge, data.description)
      });

      socket.on('lights list', Lights.list);
      socket.on('lights toggle', Lights.toggle);
    });
  }
}

const gingerHue = new App();

function stringify(obj_from_json) {
  if (typeof obj_from_json !== "object" || Array.isArray(obj_from_json)) {
    // not an object, stringify using native function
    return JSON.stringify(obj_from_json);
  }
  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  let props = Object
    .keys(obj_from_json)
    .map(key => `${key}:${stringify(obj_from_json[key])}`)
    .join(",");
  return `{${props}}`;
}

module.exports = App;