'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('galeria', {
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
        allowNull: true
      },
      imagem_url: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'URL da imagem'
      },
      categoria: {
        type: Sequelize.ENUM('projetos', 'eventos', 'voluntarios', 'instalacoes', 'geral'),
        defaultValue: 'geral',
        comment: 'Categoria da imagem'
      },
      destaque: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Aparecer em destaque na home'
      },
      status: {
        type: Sequelize.ENUM('ativo', 'inativo'),
        defaultValue: 'ativo'
      },
      ordem: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Ordem de exibição (menor = primeiro)'
      },
      autor: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Quem tirou a foto ou fez upload'
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

    // Índices
    await queryInterface.addIndex('galeria', ['categoria']);
    await queryInterface.addIndex('galeria', ['status']);
    await queryInterface.addIndex('galeria', ['destaque']);
    await queryInterface.addIndex('galeria', ['ordem']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('galeria');
  }
};
