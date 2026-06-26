const { Depoimento } = require('../models');
const { Op } = require('sequelize');

// GET /api/depoimentos - Listar todos os depoimentos
exports.listarDepoimentos = async (req, res) => {
  try {
    const { status, destaque } = req.query;
    
    const where = {};
    
    if (status) {
      where.status = status;
    }
    
    if (destaque !== undefined) {
      where.destaque = destaque === 'true';
    }
    
    const depoimentos = await Depoimento.findAll({
      where,
      order: [['created_at', 'DESC']]
    });
    
    res.json({ depoimentos });
  } catch (error) {
    console.error('Erro ao listar depoimentos:', error);
    res.status(500).json({ 
      error: 'Erro ao listar depoimentos',
      message: error.message 
    });
  }
};

// GET /api/depoimentos/stats - Estatísticas
exports.obterEstatisticas = async (req, res) => {
  try {
    const total = await Depoimento.count();
    const ativos = await Depoimento.count({ where: { status: 'ativo' } });
    const destaques = await Depoimento.count({ where: { destaque: true, status: 'ativo' } });
    
    // Últimos 30 dias
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 30);
    
    const novos = await Depoimento.count({
      where: {
        created_at: {
          [Op.gte]: dataLimite
        }
      }
    });
    
    res.json({
      total,
      ativos,
      destaques,
      novos_ultimos_30_dias: novos
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ 
      error: 'Erro ao obter estatísticas',
      message: error.message 
    });
  }
};

// GET /api/depoimentos/:id - Buscar depoimento por ID
exports.buscarDepoimentoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const depoimento = await Depoimento.findByPk(id);
    
    if (!depoimento) {
      return res.status(404).json({ error: 'Depoimento não encontrado' });
    }
    
    res.json(depoimento);
  } catch (error) {
    console.error('Erro ao buscar depoimento:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar depoimento',
      message: error.message 
    });
  }
};

// POST /api/depoimentos - Criar novo depoimento
exports.criarDepoimento = async (req, res) => {
  try {
    const { autor, cargo, texto, foto_url, destaque, status } = req.body;
    
    // Validação básica
    if (!autor || !texto) {
      return res.status(400).json({ 
        error: 'Autor e texto são obrigatórios' 
      });
    }
    
    const novoDepoimento = await Depoimento.create({
      autor,
      cargo: cargo || null,
      texto,
      foto_url: foto_url || null,
      destaque: destaque || false,
      status: status || 'ativo'
    });
    
    res.status(201).json(novoDepoimento);
  } catch (error) {
    console.error('Erro ao criar depoimento:', error);
    res.status(500).json({ 
      error: 'Erro ao criar depoimento',
      message: error.message 
    });
  }
};

// PUT /api/depoimentos/:id - Atualizar depoimento
exports.atualizarDepoimento = async (req, res) => {
  try {
    const { id } = req.params;
    const { autor, cargo, texto, foto_url, destaque, status } = req.body;
    
    const depoimento = await Depoimento.findByPk(id);
    
    if (!depoimento) {
      return res.status(404).json({ error: 'Depoimento não encontrado' });
    }
    
    await depoimento.update({
      autor: autor || depoimento.autor,
      cargo: cargo !== undefined ? cargo : depoimento.cargo,
      texto: texto || depoimento.texto,
      foto_url: foto_url !== undefined ? foto_url : depoimento.foto_url,
      destaque: destaque !== undefined ? destaque : depoimento.destaque,
      status: status || depoimento.status
    });
    
    res.json(depoimento);
  } catch (error) {
    console.error('Erro ao atualizar depoimento:', error);
    res.status(500).json({ 
      error: 'Erro ao atualizar depoimento',
      message: error.message 
    });
  }
};

// DELETE /api/depoimentos/:id - Deletar depoimento
exports.deletarDepoimento = async (req, res) => {
  try {
    const { id } = req.params;
    
    const depoimento = await Depoimento.findByPk(id);
    
    if (!depoimento) {
      return res.status(404).json({ error: 'Depoimento não encontrado' });
    }
    
    await depoimento.destroy();
    
    res.json({ message: 'Depoimento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar depoimento:', error);
    res.status(500).json({ 
      error: 'Erro ao deletar depoimento',
      message: error.message 
    });
  }
};
