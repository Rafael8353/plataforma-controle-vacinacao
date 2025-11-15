'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    /**
     * insere lista de lotes de vacinas de exemplo na tabela
    */
    const { v4: uuidv4 } = await import('uuid');

    // Obtém os IDs das vacinas inseridas pelo seeder de vacinas
    const [vaccines] = await queryInterface.sequelize.query(
      'SELECT id FROM "vaccines";'
    );

    if (!vaccines || vaccines.length < 2) {
      throw new Error('Seeder de vacinas (demo-vaccines) não foi executado ou não criou vacinas suficientes. Rode o seeder de vacinas primeiro.');
    }

    const vacinaA_id = vaccines[0].id;
    const vacinaB_id = vaccines[1].id;

    await queryInterface.bulkInsert('vaccineLots', [
      {
        id: uuidv4(),
        lot_number: 'LOT123456',
        manufacturing_date: new Date('2023-01-01'),
        expiry_date: new Date('2024-12-10'),
        quantity_initial: 1000,
        quantity_current: 800,
        vaccine_id: vacinaA_id, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        lot_number: 'LOT654321',
        manufacturing_date: new Date('2023-06-01'),
        expiry_date: new Date('2025-06-01'),
        quantity_initial: 500,
        quantity_current: 500,  
        vaccine_id: vacinaB_id, 
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  /**
   * Remove todos os registros da tabela
   * 
   */
  async down (queryInterface) {
    await queryInterface.bulkDelete('vaccineLots', null, {});
  }
};
