'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('doacoes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      projeto_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'projetos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      valor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      doador_nome: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      doador_email: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      doador_cpf: {
        type: Sequelize.STRING(11),
        allowNull: true
      },
      tipo: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'unica'
      },
      status_pagamento: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'pendente'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('doacoes');
  }
};
