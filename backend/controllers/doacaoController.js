const { Doacao, Projeto } = require('../models');

// GET /api/doacoes - Listar todas as doações
exports.listarTodas = async (req, res) => {
  try {
    const doacoes = await Doacao.findAll({
      include: [{
        model: Projeto,
        as: 'projeto',
        attributes: ['id', 'nome']
      }],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      total: doacoes.length,
      data: doacoes
    });
  } catch (error) {
    console.error('Erro ao listar doações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar doações',
      error: error.message
    });
  }
};

// POST /api/doacoes - Registrar nova doação
exports.criar = async (req, res) => {
  try {
    const {
      projeto_id,
      valor,
      doador_nome,
      doador_email,
      doador_cpf,
      tipo
    } = req.body;

    // Validações
    if (!valor || !doador_nome || !doador_email) {
      return res.status(400).json({
        success: false,
        message: 'Valor, nome e email do doador são obrigatórios'
      });
    }

    // Se tiver projeto_id, verificar se existe
    if (projeto_id) {
      const projeto = await Projeto.findByPk(projeto_id);
      if (!projeto) {
        return res.status(404).json({
          success: false,
          message: 'Projeto não encontrado'
        });
      }

      // Atualizar valor arrecadado do projeto
      await projeto.update({
        arrecadado_atual: parseFloat(projeto.arrecadado_atual) + parseFloat(valor)
      });
    }

    const novaDoacao = await Doacao.create({
      projeto_id: projeto_id || null,
      valor,
      doador_nome,
      doador_email,
      doador_cpf,
      tipo: tipo || 'unica',
      status_pagamento: 'aprovado' // Simulação - na real seria 'pendente'
    });

    res.status(201).json({
      success: true,
      message: 'Doação registrada com sucesso',
      data: novaDoacao
    });
  } catch (error) {
    console.error('Erro ao criar doação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar doação',
      error: error.message
    });
  }
};

// GET /api/doacoes/relatorio - Relatório de doações
exports.relatorio = async (req, res) => {
  try {
    const { Sequelize } = require('sequelize');
    
    // Total geral de doações
    const totalGeral = await Doacao.sum('valor');

    // Total por projeto
    const totalPorProjeto = await Doacao.findAll({
      attributes: [
        'projeto_id',
        [Sequelize.fn('SUM', Sequelize.col('Doacao.valor')), 'total'],
        [Sequelize.fn('COUNT', Sequelize.col('Doacao.id')), 'quantidade']
      ],
      include: [{
        model: Projeto,
        as: 'projeto',
        attributes: ['id', 'nome']
      }],
      group: ['Doacao.projeto_id', 'projeto.id', 'projeto.nome'],
      raw: true
    });

    res.status(200).json({
      success: true,
      data: {
        total_geral: totalGeral || 0,
        por_projeto: totalPorProjeto
      }
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar relatório',
      error: error.message
    });
  }
};
