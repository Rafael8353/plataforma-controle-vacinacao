// src/models/vaccinelot.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VaccineLot extends Model {
    static associate(models) {
      // Um lote pertence a uma vacina
      this.belongsTo(models.Vaccine, { foreignKey: 'vaccine_id', as: 'vaccine' });
      // Um lote pode ser usado em vários registros de vacinação
      this.hasMany(models.VaccinationRecord, { foreignKey: 'vaccine_lot_id', as: 'records' });
    }
  }
  VaccineLot.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    lot_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    manufacturing_date: DataTypes.DATE,
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    quantity_initial: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity_current: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // O campo vaccine_id é criado automaticamente pela associação
  }, {
    sequelize,
    modelName: 'VaccineLot',
  });
  return VaccineLot;
};