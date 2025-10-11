// src/database/migrations/xxxxxxxx-create-vaccine-lot.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('VaccineLots', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      // Chave Estrangeira para Vaccine
      vaccine_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Vaccines', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // Não deixa apagar a vacina se houver lotes
      },
      lot_number: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      manufacturing_date: {
        type: Sequelize.DATE,
      },
      expiry_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      quantity_initial: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantity_current: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('VaccineLots');
  }
};