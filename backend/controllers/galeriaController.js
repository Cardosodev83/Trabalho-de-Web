const { Galeria } = require('../models');
const { Op } = require('sequelize');

// GET /api/galeria - Listar todas
exports.listarImagens = async (req, res) => {
  try {
    const { categoria, status } = req.query;
    
    const where = {};
    
    if (categoria) {
      where.categoria = categoria;
    }
    
    if (status) {
      where.status = status;
    }
    
    const imagens = await Galeria.findAll({
      where,
      order: [
        ['ordem', 'ASC'],
        ['created_at', 'DESC']
      ]
    });
    
    res.json({ imagens });
  } catch (error) {
    console.error('Erro ao listar imagens:', error);
    res.status(500).json({ 
      error: 'Erro ao listar imagens',
      message: error.message 
    });
  }
};

// GET /api/galeria/stats - Estatísticas
exports.obterEstatisticas = async (req, res) => {
  try {
    const total = await Galeria.count();
    const ativas = await Galeria.count({ where: { status: 'ativo' } });
    const destaques = await Galeria.count({ 
      where: { destaque: true, status: 'ativo' } 
    });
    
    // Por categoria
    const porCategoria = await Galeria.findAll({
      attributes: [
        'categoria',
        [sequelize.fn('COUNT', sequelize.col('id')), 'total']
      ],
      where: { status: 'ativo' },
      group: ['categoria'],
      raw: true
    });
    
    const categorias = {};
    porCategoria.forEach(item => {
      categorias[item.categoria] = parseInt(item.total);
    });
    
    res.json({
      total,
      ativas,
      destaques,
      categorias
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ 
      error: 'Erro ao obter estatísticas',
      message: error.message 
    });
  }
};

// GET /api/galeria/:id - Buscar por ID
exports.buscarImagemPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const imagem = await Galeria.findByPk(id);
    
    if (!imagem) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }
    
    res.json(imagem);
  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar imagem',
      message: error.message 
    });
  }
};

// POST /api/galeria - Criar nova
exports.criarImagem = async (req, res) => {
  try {
    const { 
      titulo, descricao, imagem_url, categoria, 
      destaque, status, ordem, autor 
    } = req.body;
    
    // Validação básica
    if (!titulo || !imagem_url) {
      return res.status(400).json({ 
        error: 'Título e URL da imagem são obrigatórios' 
      });
    }
    
    const novaImagem = await Galeria.create({
      titulo,
      descricao: descricao || null,
      imagem_url,
      categoria: categoria || 'geral',
      destaque: destaque || false,
      status: status || 'ativo',
      ordem: ordem || 0,
      autor: autor || null
    });
    
    res.status(201).json(novaImagem);
  } catch (error) {
    console.error('Erro ao criar imagem:', error);
    res.status(500).json({ 
      error: 'Erro ao criar imagem',
      message: error.message 
    });
  }
};

// PUT /api/galeria/:id - Atualizar
exports.atualizarImagem = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      titulo, descricao, imagem_url, categoria,
      destaque, status, ordem, autor 
    } = req.body;
    
    const imagem = await Galeria.findByPk(id);
    
    if (!imagem) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }
    
    await imagem.update({
      titulo: titulo || imagem.titulo,
      descricao: descricao !== undefined ? descricao : imagem.descricao,
      imagem_url: imagem_url || imagem.imagem_url,
      categoria: categoria || imagem.categoria,
      destaque: destaque !== undefined ? destaque : imagem.destaque,
      status: status || imagem.status,
      ordem: ordem !== undefined ? ordem : imagem.ordem,
      autor: autor !== undefined ? autor : imagem.autor
    });
    
    res.json(imagem);
  } catch (error) {
    console.error('Erro ao atualizar imagem:', error);
    res.status(500).json({ 
      error: 'Erro ao atualizar imagem',
      message: error.message 
    });
  }
};

// DELETE /api/galeria/:id - Deletar
exports.deletarImagem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const imagem = await Galeria.findByPk(id);
    
    if (!imagem) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }
    
    await imagem.destroy();
    
    res.json({ message: 'Imagem deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    res.status(500).json({ 
      error: 'Erro ao deletar imagem',
      message: error.message 
    });
  }
};
