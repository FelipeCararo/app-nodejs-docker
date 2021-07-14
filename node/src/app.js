require('./database/');
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});
const routes = require('./routes');

const express = require('express');

class AppController {
  constructor() {
    this.express = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(express.json());
  }

  routes() {
    // this.express.use(require('./routes'));
    this.express.use('/', routes);
  }
}

module.exports = new AppController().express;
