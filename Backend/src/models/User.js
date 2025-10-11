// src/models/user.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Associação para registros onde o usuário é o PACIENTE
      this.hasMany(models.VaccinationRecord, {
        foreignKey: 'patient_id',
        as: 'patientRecords', // Alias para diferenciar
      });

      // Associação para registros onde o usuário é o PROFISSIONAL
      this.hasMany(models.VaccinationRecord, {
        foreignKey: 'professional_id',
        as: 'administeredRecords', // Alias para diferenciar
      });
    }
  }
  User.init({
    id: { // É bom definir o ID no init também
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true,
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: DataTypes.STRING(20),
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    professional_register: DataTypes.STRING(50),
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};