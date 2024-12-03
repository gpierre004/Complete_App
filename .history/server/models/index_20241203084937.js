const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: config.logging
});

// Import models
const Company = require('./company');
const StockPrice = require('./stockPrice');
const User = require('./user');
const Transaction = require('./transaction');
const Watchlist = require('./watchlist');

// Initialize models
const models = {
  Company: Company(sequelize),
  StockPrice: StockPrice(sequelize),
  User: User(sequelize),
  Transaction: Transaction(sequelize),
  Watchlist: Watchlist(sequelize)
};

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
