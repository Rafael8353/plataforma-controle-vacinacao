'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    static associate(models) {
      this.hasMany(models.VaccinationRecord, { foreignKey: 'patient_id', as: 'patientRecords', });
      this.hasMany(models.VaccinationRecord, { foreignKey: 'professional_id', as: 'administeredRecords', });
    }
  }

  User.init({
    id: { 
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "O nome nao pode estar vazio," }
      },
    },
    cpf: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true,
      validate: {
        is: { args: /^\d{11}$/, msg: "O CPF deve conter exatamente 11 digitos." }
      },
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "O formato de email e invalido." }
      }
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    sus_card_number: {
      type: DataTypes.STRING(15),
      allowNull: true,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM('patient', 'health_professional'),
      allowNull: false,
    },
    professional_register: {
      type: DataTypes.STRING(50),
    },
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
       beforeValidate: (user) => {
          if (user.role === 'health_professional') {
            if (!user.professional_register) {
              throw new Error('O registro profissional é obrigatório para profissionais de saúde.');
            }
            user.sus_card_number = null; 
        } else if (user.role === 'patient') {
          if (!user.sus_card_number) {
            throw new Error('O número do cartão do SUS é obrigatório para pacientes.');
          }
          user.professional_register = null; 
        }
       }
    }
    
  });

  return User;
};