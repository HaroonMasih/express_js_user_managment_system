// User.js

const { DataTypes } = require("sequelize");
const db = require("./db");
const UserLog = require("./userLog");

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
});
// User.hasMany(UserLog, { foreignKey: 'UserId' });

module.exports = User;
