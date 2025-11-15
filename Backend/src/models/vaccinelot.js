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
      validate: {
        notEmpty: { msg: "O numero de lote e obrigatorio." }
      },
    },
    manufacturing_date: DataTypes.DATE,
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: "A data de validade e obrigatoria." },
        isDate: { msg: "A data de validade deve ser uma data valida." }
      },
    },
    quantity_initial: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "A quantidade inicial deve ser um numero inteiro." },
        min: {
          args: [0], // n pode ser neg
          msg: "A quantidade inicial nao pode ser negativa."
        },
      },
    },
    quantity_current: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "A quantidade atual deve ser um numero inteiro." },
        min: {
          args: [0], 
          msg: "A quantidade atual nao pode ser negativa."
        },
      },
    },
  }, {
    sequelize,
    modelName: 'VaccineLot',
    tableName: 'vaccineLots'
  });

  return VaccineLot;
};