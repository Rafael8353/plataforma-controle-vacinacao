'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   * Insere lista de registros de vacinacao de exemplo na tabela
   * lOGICA ADICIONADA PARA LIDAR COM AS CHAVES ESTRANGEIRAS E ATUALIZACAO DE ESTOQUE
   * */
  async up (queryInterface) {
    
    const { v4: uuidv4 } = await import('uuid');
    
    // Isso garante que, se a atualização do estoque falhar, a criação do registro também será desfeita.
    const t = await queryInterface.sequelize.transaction();

    try {
      // Busca IDs REAIS do banco de dados (criados pelos seeders anteriores)
      const [patients] = await queryInterface.sequelize.query(
        'SELECT id FROM "users" WHERE role = \'patient\' LIMIT 1;',
        { transaction: t }
      );
      const [professionals] = await queryInterface.sequelize.query(
        'SELECT id FROM "users" WHERE role = \'health_professional\' LIMIT 1;',
        { transaction: t }
      );
      // Busca um lote que TENHA estoque
      const [lots] = await queryInterface.sequelize.query(
        'SELECT id FROM "vaccineLots" WHERE quantity_current > 0 LIMIT 1;',
        { transaction: t }
      );

      // Verifica se temos os dados necessários
      if (!patients.length || !professionals.length || !lots.length) {
        throw new Error('Seeders de Users ou VaccineLots não criaram dados suficientes ou não há lotes com estoque.');
      }

      const patientId = patients[0].id;
      const professionalId = professionals[0].id;
      const lotId = lots[0].id;

      await queryInterface.bulkInsert('vaccinationRecords', [
        {
          id: uuidv4(),
          application_date: new Date('2023-01-15T10:00:00Z'),
          location: 'Clinica Central (SEEDED)',
          notes: 'Primeira dose administrada (seeder).',
          patient_id: patientId,         
          professional_id: professionalId, 
          vaccine_lot_id: lotId,          
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], { transaction: t }); // Passa a transação para o bulkInsert

      // Decrementar o estoque do lote (dentro da transação)
      await queryInterface.sequelize.query(
        'UPDATE "vaccineLots" SET quantity_current = quantity_current - 1 WHERE id = :lotId',
        {
          replacements: { lotId: lotId },
          transaction: t, // Garante que esta query faça parte da transação
        }
      );

      await t.commit();

    } catch (error) {
      await t.rollback();
      console.error('Erro no seeder VaccinationRecords:', error.message);
      throw error;
    }
  },

  /**
   * Remove todos os registros da tabela
   * */
  async down (queryInterface) {
    // O 'down' não precisa de transação, apenas deleta os registros.
    // Não precisamos "devolver" o estoque ao deletar os registros de teste.
    await queryInterface.bulkDelete('vaccinationRecords', null, {});
  }
};