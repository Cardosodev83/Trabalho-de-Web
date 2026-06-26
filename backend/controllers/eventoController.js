const { Evento } = require('../models');
const { Op } = require('sequelize');

// GET /api/eventos - Listar todos
exports.listarEventos = async (req, res) => {
  try {
    const { status, mes, ano } = req.query;
    
    const where = {};
    
    if (status) {
      where.status = status;
    }
    
    // Filtrar por mês/ano
    if (mes && ano) {
      const dataInicio = new Date(ano, mes - 1, 1);
      const dataFim = new Date(ano, mes, 0, 23, 59, 59);
      
      where.data_evento = {
        [Op.between]: [dataInicio, dataFim]
      };
    }
    
    const eventos = await Evento.findAll({
      where,
      order: [['data_evento', 'ASC']]
    });
    
    res.json({ eventos });
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    res.status(500).json({ 
      error: 'Erro ao listar eventos',
      message: error.message 
    });
  }
};

// GET /api/eventos/stats - Estatísticas
exports.obterEstatisticas = async (req, res) => {
  try {
    const total = await Evento.count();
    const publicados = await Evento.count({ where: { status: 'publicado' } });
    
    // Eventos futuros
    const proximos = await Evento.count({
      where: {
        data_evento: {
          [Op.gte]: new Date()
        },
        status: 'publicado'
      }
    });
    
    // Eventos em destaque
    const destaques = await Evento.count({
      where: { 
        destaque: true,
        status: 'publicado'
      }
    });
    
    res.json({
      total,
      publicados,
      proximos,
      destaques
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ 
      error: 'Erro ao obter estatísticas',
      message: error.message 
    });
  }
};

// GET /api/eventos/:id - Buscar por ID
exports.buscarEventoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const evento = await Evento.findByPk(id);
    
    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    
    res.json(evento);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar evento',
      message: error.message 
    });
  }
};

// POST /api/eventos - Criar novo
exports.criarEvento = async (req, res) => {
  try {
    const { 
      titulo, descricao, data_evento, local, endereco,
      vagas, imagem_url, organizador, status, destaque 
    } = req.body;
    
    // Validação básica
    if (!titulo || !descricao || !data_evento || !local) {
      return res.status(400).json({ 
        error: 'Título, descrição, data e local são obrigatórios' 
      });
    }
    
    const novoEvento = await Evento.create({
      titulo,
      descricao,
      data_evento,
      local,
      endereco: endereco || null,
      vagas: vagas || null,
      vagas_preenchidas: 0,
      imagem_url: imagem_url || null,
      organizador: organizador || null,
      status: status || 'rascunho',
      destaque: destaque || false
    });
    
    res.status(201).json(novoEvento);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ 
      error: 'Erro ao criar evento',
      message: error.message 
    });
  }
};

// PUT /api/eventos/:id - Atualizar
exports.atualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      titulo, descricao, data_evento, local, endereco,
      vagas, vagas_preenchidas, imagem_url, organizador, status, destaque 
    } = req.body;
    
    const evento = await Evento.findByPk(id);
    
    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    
    await evento.update({
      titulo: titulo || evento.titulo,
      descricao: descricao || evento.descricao,
      data_evento: data_evento || evento.data_evento,
      local: local || evento.local,
      endereco: endereco !== undefined ? endereco : evento.endereco,
      vagas: vagas !== undefined ? vagas : evento.vagas,
      vagas_preenchidas: vagas_preenchidas !== undefined ? vagas_preenchidas : evento.vagas_preenchidas,
      imagem_url: imagem_url !== undefined ? imagem_url : evento.imagem_url,
      organizador: organizador !== undefined ? organizador : evento.organizador,
      status: status || evento.status,
      destaque: destaque !== undefined ? destaque : evento.destaque
    });
    
    res.json(evento);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ 
      error: 'Erro ao atualizar evento',
      message: error.message 
    });
  }
};

// DELETE /api/eventos/:id - Deletar
exports.deletarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    
    const evento = await Evento.findByPk(id);
    
    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    
    await evento.destroy();
    
    res.json({ message: 'Evento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    res.status(500).json({ 
      error: 'Erro ao deletar evento',
      message: error.message 
    });
  }
};
