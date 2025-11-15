'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  /**
   * Insere lista de usuarios de exemplo na tabela
   * 
   */
  async up (queryInterface) {

    const { v4: uuidv4 } = await import('uuid');
    const saltRounds = 10;

    await queryInterface.bulkInsert('users', [  
      { // user 1 -> paciente
        id: uuidv4(),
        name: 'Ricardo S', 
        email: 'rica.die@example.com',
        cpf: '33122233355', 
        birth_date: new Date('1990-01-15'),
        phone_number: '88997731130',
        password_hash: await bcrypt.hash('', saltRounds),
        sus_card_number: "1234567",
        role: 'patient', // 'patient' ou 'health_professional'
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { // user 2 -> profisional de saude
        id: uuidv4(),
        name: 'john Dee', 
        email: 'john.doe@example.com',
        cpf: '11122233355', 
        birth_date: new Date('1990-01-15'),
        phone_number: '51997631130',
        password_hash: await bcrypt.hash('', saltRounds),
        professional_register: "0000333",
        role: 'health_professional', 
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      // adicione quantos users quiser para teste
    ], {});
  },

  /**
   * Remove todos os registros da tabela
   * 
   */
  async down (queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  }
};