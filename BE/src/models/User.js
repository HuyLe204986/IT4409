'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    }
  }
  User.init({
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    phone: { type: DataTypes.INTEGER },
    address: { type: DataTypes.STRING },
    avatar: { type: DataTypes.TEXT },
    city: { type: DataTypes.STRING }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};