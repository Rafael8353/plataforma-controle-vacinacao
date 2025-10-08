'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class User extends Model {
    /**
     * Definição de associações
     * 
     */
    static associate(models) {
      //
    }
  }

  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'users', 
    createdAt: 'created_at', 
    updatedAt: 'updated_at',
    // aqui
  });
  
  return User;
};