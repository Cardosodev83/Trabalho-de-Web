'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Depoimento extends Model {
    static associate(models) {
      // Associações podem ser definidas aqui se necessário
    }
  }
  
  Depoimento.init({
    autor: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Nome do autor é obrigatório'
        }
      }
    },
    cargo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Texto do depoimento é obrigatório'
        },
        len: {
          args: [10, 1000],
          msg: 'O depoimento deve ter entre 10 e 1000 caracteres'
        }
      }
    },
    foto_url: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'URL da foto inválida'
        }
      }
    },
    destaque: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('ativo', 'inativo'),
      defaultValue: 'ativo'
    }
  }, {
    sequelize,
    modelName: 'Depoimento',
    tableName: 'depoimentos',
    underscored: true,
    timestamps: true
  });
  
  return Depoimento;
};
