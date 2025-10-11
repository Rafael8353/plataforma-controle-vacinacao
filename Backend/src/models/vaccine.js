// src/models/vaccine.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Vaccine extends Model {
    static associate(models) {
      // Uma vacina pode estar em vários lotes
      this.hasMany(models.VaccineLot, { foreignKey: 'vaccine_id', as: 'lots' });
    }
  }
  Vaccine.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    dose_info: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    dose_interval_days: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Vaccine',
  });
  return Vaccine;
};