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
      validate: {
        notEmpty: { msg: "O nome da vacina e obrigatorio" }
      },
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "O fabricante e obrigatorio" }
      }
    },
    description: DataTypes.TEXT,
    dose_info: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "A informacao da dose e obrigtoria" }
      }
    },
    dose_interval_days: { 
      type: DataTypes.INTEGER,
      validate: {
        isInt: { msg: "O intervalo de doses deve ser um numero inteiro" },
        min: { 
          args: [0],
          msg: "O Intervalo de doses nao pode ser negativo"
        }
      }
    }, 
  }, {
    sequelize,
    modelName: 'Vaccine',
  });

  return Vaccine;
};