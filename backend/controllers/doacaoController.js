const { Doacao, Projeto } = require('../models');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GET /api/doacoes - Listar todas as doações
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GET /api/doacoes/:id - Buscar doação por ID
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const doacao = await Doacao.findByPk(id, {
      include: [{
        model: Projeto,
        as: 'projeto',
        attributes: ['id', 'nome', 'descricao']
      }]
    });

    if (!doacao) {
      return res.status(404).json({
        success: false,
        message: 'Doação não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: doacao
    });
  } catch (error) {
    console.error('Erro ao buscar doação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar doação',
      error: error.message
    });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  POST /api/doacoes - Registrar nova doação
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PUT /api/doacoes/:id - Atualizar doação
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status_pagamento,
      doador_nome,
      doador_email,
      doador_cpf,
      observacoes
    } = req.body;

    const doacao = await Doacao.findByPk(id);

    if (!doacao) {
      return res.status(404).json({
        success: false,
        message: 'Doação não encontrada'
      });
    }

    // Preparar dados para atualização
    const dadosAtualizacao = {};
    
    if (status_pagamento) dadosAtualizacao.status_pagamento = status_pagamento;
    if (doador_nome) dadosAtualizacao.doador_nome = doador_nome;
    if (doador_email) dadosAtualizacao.doador_email = doador_email;
    if (doador_cpf !== undefined) dadosAtualizacao.doador_cpf = doador_cpf;
    if (observacoes !== undefined) dadosAtualizacao.observacoes = observacoes;

    await doacao.update(dadosAtualizacao);

    res.status(200).json({
      success: true,
      message: 'Doação atualizada com sucesso',
      data: doacao
    });
  } catch (error) {
    console.error('Erro ao atualizar doação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar doação',
      error: error.message
    });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DELETE /api/doacoes/:id - Deletar doação
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;

    const doacao = await Doacao.findByPk(id);

    if (!doacao) {
      return res.status(404).json({
        success: false,
        message: 'Doação não encontrada'
      });
    }

    // Se tinha projeto associado, atualizar valor arrecadado
    if (doacao.projeto_id) {
      const projeto = await Projeto.findByPk(doacao.projeto_id);
      if (projeto) {
        await projeto.update({
          arrecadado_atual: parseFloat(projeto.arrecadado_atual) - parseFloat(doacao.valor)
        });
      }
    }

    await doacao.destroy();

    res.status(200).json({
      success: true,
      message: 'Doação removida com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar doação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar doação',
      error: error.message
    });
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GET /api/doacoes/relatorio - Relatório de doações
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

    // Estatísticas por status
    const porStatus = await Doacao.findAll({
      attributes: [
        'status_pagamento',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'quantidade'],
        [Sequelize.fn('SUM', Sequelize.col('valor')), 'total']
      ],
      group: ['status_pagamento'],
      raw: true
    });

    res.status(200).json({
      success: true,
      data: {
        total_geral: totalGeral || 0,
        por_projeto: totalPorProjeto,
        por_status: porStatus
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
