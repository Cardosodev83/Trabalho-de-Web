'use strict';
const { Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Doacao extends Model {
    static associate(models) {
      //uma doacao pertence a um projeto
      Doacao.belongsTo(models.Projeto, {
        foreignKey: 'projeto_id',
        as: 'projeto'
      });
    }
  }
  // inicializa o modelo Doacao
  Doacao.init({
    projeto_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Projetos',
        key: 'id'
      }
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    doador_nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    doador_email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    doador_cpf: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'unica',
      validate: {
        isIn: [['unica', 'recorrente']]
      }
    },
    status_pagamento: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pendente',
      validate: {
        isIn: [['pendente', 'aprovado', 'recusado']]
      }
    }
    }, {
      sequelize,
      modelName: 'Doacao',
      tableName: 'doacoes',
      underscored: true,
      timestamps: true
    });
  return Doacao;
};