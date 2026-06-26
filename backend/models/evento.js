'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Evento extends Model {
    static associate(models) {
      // Associações podem ser definidas aqui
    }
  }
  
  Evento.init({
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
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Descrição é obrigatória'
        }
      }
    },
    data_evento: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: {
          args: new Date().toISOString().split('T')[0],
          msg: 'Data do evento deve ser futura'
        }
      }
    },
    local: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    endereco: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    vagas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    vagas_preenchidas: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    imagem_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    organizador: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('rascunho', 'publicado', 'cancelado', 'finalizado'),
      defaultValue: 'rascunho'
    },
    destaque: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Evento',
    tableName: 'eventos',
    underscored: true,
    timestamps: true,
    hooks: {
      beforeValidate: (evento) => {
        // Garantir que vagas_preenchidas não exceda vagas
        if (evento.vagas && evento.vagas_preenchidas > evento.vagas) {
          throw new Error('Vagas preenchidas não pode exceder total de vagas');
        }
      }
    }
  });
  
  return Evento;
};
