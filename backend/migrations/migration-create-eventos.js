'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('eventos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      data_evento: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Data e hora do evento'
      },
      local: {
        type: Sequelize.STRING,
        allowNull: false
      },
      endereco: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Endereço completo do evento'
      },
      vagas: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Número de vagas disponíveis (null = sem limite)'
      },
      vagas_preenchidas: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Número de vagas já preenchidas'
      },
      imagem_url: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'URL da imagem do evento'
      },
      organizador: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Nome do organizador responsável'
      },
      status: {
        type: Sequelize.ENUM('rascunho', 'publicado', 'cancelado', 'finalizado'),
        defaultValue: 'rascunho'
      },
      destaque: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Se deve aparecer em destaque'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Índices para melhorar performance
    await queryInterface.addIndex('eventos', ['data_evento']);
    await queryInterface.addIndex('eventos', ['status']);
    await queryInterface.addIndex('eventos', ['destaque']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('eventos');
  }
};
