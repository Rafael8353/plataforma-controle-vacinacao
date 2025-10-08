'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  /**
   * Insere lista de usuarios de exemplo na tabela
   * 
   */
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [  
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        created_at: new Date(),
        updated_at: new Date(),
        //
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        created_at: new Date(),
        updated_at: new Date(),
        //
      },
    
      // adicione quantos users quiser para teste
      
    ], {});
  },

  /**
   * Remove todos os registros da tabela
   * 
   */
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};