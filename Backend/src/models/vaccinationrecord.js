// src/models/vaccinationrecord.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VaccinationRecord extends Model {
    static associate(models) {
      // Um registro pertence a um paciente (User)
      this.belongsTo(models.User, { foreignKey: 'patient_id', as: 'patient' });
      // Um registro pertence a um profissional (User)
      this.belongsTo(models.User, { foreignKey: 'professional_id', as: 'professional' });
      // Um registro pertence a um lote de vacina
      this.belongsTo(models.VaccineLot, { foreignKey: 'vaccine_lot_id', as: 'vaccineLot' });
    }
  }
  VaccinationRecord.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    application_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: DataTypes.STRING,
    notes: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'VaccinationRecord',
  });
  return VaccinationRecord;
};