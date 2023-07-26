// UserLog.js

const { DataTypes } = require('sequelize');
const db = require('./db');

const UserLog = db.define('UserLog', {
  action: {
    type: DataTypes.ENUM('login', 'logout'),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = UserLog;
