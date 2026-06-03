'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Projeto extends Model {
   
    static associate(models) {
      // um projeto tem muitas doacoes
      Projeto.hasMany(models.Doacao, {
        foreignKey: 'projeto_id',
        as: 'doacoes'
      });
    }
  }
  // inicializa o modelo Projeto

  Projeto.init({
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100]
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    meta_financeira: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
      
    },
    arrecadado_atual: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    beneficiarios_atendidos: { 
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    imagem_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'ativo',
      validate: {
        isIn: [['ativo', 'inativo', 'concluido']]
      }
    }
  }, {
    sequelize,
    modelName: 'Projeto',
    tableName: 'projetos',
    underscored: true,
    timestamps: true
  });
  return Projeto;
};