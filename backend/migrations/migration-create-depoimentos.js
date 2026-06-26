'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('depoimentos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      autor: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cargo: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Cargo ou contexto do autor (ex: Voluntário, Beneficiário)'
      },
      texto: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      foto_url: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'URL da foto do autor'
      },
      destaque: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Se deve aparecer em destaque na home'
      },
      status: {
        type: Sequelize.ENUM('ativo', 'inativo'),
        defaultValue: 'ativo'
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
    await queryInterface.addIndex('depoimentos', ['status']);
    await queryInterface.addIndex('depoimentos', ['destaque']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('depoimentos');
  }
};
