'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    /**
     * Insere lista de vacinas de exemplo na tabela
    */
    const { v4: uuidv4 } = await import('uuid');

    await queryInterface.bulkInsert('vaccines', [
      { // vacina 1
        id: uuidv4(),
        name: 'Vacina A',
        manufacturer: 'Fabricante A',
        description: 'Descricao da Vacina A',
        dose_info: '2 doses de 0.5ml',
        dose_interval_days: 28,
        createdAt: new Date(),  
        updatedAt: new Date()   
      },
      { // vacina 2
        id: uuidv4(),
        name: 'Vacina B',
        manufacturer: 'Fabricante B',
        description: 'Descricao da Vacina B',
        dose_info: '1 dose de 1ml',
        dose_interval_days: 0,
        createdAt: new Date(),  
        updatedAt: new Date()   
      },
      { // vacina 3
        id: uuidv4(),
        name: 'Vacina C',
        manufacturer: 'Fabricante C',
        description: 'Descricao da Vacina C',
        dose_info: '3 doses de 0.3ml',
        dose_interval_days: 21,
        createdAt: new Date(),  
        updatedAt: new Date()   
      }
    ], {});

  },

  async down (queryInterface) {
    /**
      * Remove todos os registros da tabela de vacinas
     */
    await queryInterface.bulkDelete('vaccines', null, {});
  }
};
