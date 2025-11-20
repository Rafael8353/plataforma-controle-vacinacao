'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VaccinationRecord extends Model {

    static associate(models) {
      // Um registro pertence a um paciente 
      this.belongsTo(models.User, { foreignKey: 'patient_id', as: 'patient' });
      // Um registro pertence a um profissional 
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
      validate: {
        notNull: { msg: "A data de aplicação é obrigatória." },
        isDate: { msg: "A data de aplicação deve ser uma data válida." },
      },
    },
    location: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3, 255],
          msg: "A localizacao deve conter entre 3 e 255 caracteres"
        }
      },
    },
    notes: {
      type: DataTypes.TEXT,
      validate: {
        len: {
          args: [0, 500], // definido o maximo de caracteres para notes (obs) em 500 
          msg: "Observacoes podem ter no maximo 500 caracteres"
        }
      },
    },
  }, {
    sequelize,
    modelName: 'VaccinationRecord',
    tableName: 'vaccinationRecords',
  });

  return VaccinationRecord;
};