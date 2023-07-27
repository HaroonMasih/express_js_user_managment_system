// UserLog.js

const { DataTypes } = require('sequelize');
const db = require('./db');
const sequelize=require("./connection")
// const User = require('./user');


const UserLog = db.define('UserLog', {
  id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false 
  },
  action: {
    type: DataTypes.ENUM('login', 'logout'),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
});
// UserLog.belongsTo(User, { foreignKey: 'UserId' });
(async () => {
  try {
    await sequelize.sync({ alter: true }); // or { force: true } if you want to drop and re-create tables on each run (not recommended for production)
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('An error occurred while synchronizing the models:', error);
  }
})();


module.exports = UserLog;
