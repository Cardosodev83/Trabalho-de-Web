'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Voluntario extends Model {
    static associate(models) {
      // Associações podem ser definidas aqui se necessário
    }
  }
  
  Voluntario.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: true
    },
    data_nascimento: {
      type: DataTypes.DATE,
      allowNull: true
    },
    areas_interesse: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON com array de áreas de interesse'
    },
    disponibilidade: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Informações sobre dias e horários disponíveis'
    },
    status: {
      type: DataTypes.ENUM('ativo', 'inativo'),
      defaultValue: 'ativo'
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Voluntario',
    tableName: 'voluntarios',
    underscored: true,
    timestamps: true
  });
  
  return Voluntario;
};
