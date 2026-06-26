'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Galeria extends Model {
    static associate(models) {
      // Associações podem ser definidas aqui
    }
  }
  
  Galeria.init({
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Título é obrigatório'
        },
        len: {
          args: [3, 200],
          msg: 'Título deve ter entre 3 e 200 caracteres'
        }
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imagem_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'URL da imagem é obrigatória'
        },
        isUrl: {
          msg: 'URL da imagem inválida'
        }
      }
    },
    categoria: {
      type: DataTypes.ENUM('projetos', 'eventos', 'voluntarios', 'instalacoes', 'geral'),
      defaultValue: 'geral'
    },
    destaque: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('ativo', 'inativo'),
      defaultValue: 'ativo'
    },
    ordem: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    autor: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Galeria',
    tableName: 'galeria',
    underscored: true,
    timestamps: true
  });
  
  return Galeria;
};
