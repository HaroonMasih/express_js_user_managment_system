// User.js

const { DataTypes } = require("sequelize");
const db = require("./db");
const UserLog = require('./userLog');


const User = db.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  archived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  loginHistory: {
    type: DataTypes.JSON, // Use JSON for an array-like structure
    defaultValue: [],
    get() {
      const rawValue = this.getDataValue('loginHistory');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('loginHistory', JSON.stringify(value));
    },
  },
  logoutHistory: {
    type: DataTypes.JSON, // Use JSON for an array-like structure
    defaultValue: [],
    get() {
      const rawValue = this.getDataValue('logoutHistory');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('logoutHistory', JSON.stringify(value));
    },
  },
});
User.hasMany(UserLog); // Establish the association

module.exports = User;
