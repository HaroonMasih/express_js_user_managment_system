const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('worldtex', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
