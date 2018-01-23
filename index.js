"use strict";
const express = require('express');
const http = require('http');
const socket = require('socket.io');
const cons = require('consolidate');
const fs = require('fs');
const stringifyObject = require('stringify-object');

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
        data: stringifyObject(App.getDefaults()), app: stringifyObject(require('./application'))
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
      socket.on('lights color', Lights.color);
      socket.on('lights blink', Lights.blink);
      socket.on('lights average', Lights.average)
    });
  }
}

const gingerHue = new App();

module.exports = App;