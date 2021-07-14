const Sequelize = require('sequelize');

const databaseConfig = require('../config/database');

const User = require('../app/models/User');
const Citie = require('../app/models/Citie');
const Client = require('../app/models/Client');

const models = [User, Citie, Client];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

module.exports = new Database();
