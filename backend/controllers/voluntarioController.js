const { Voluntario } = require('../models');

exports.listarVoluntarios = async (req, res) => {
  try {
    const voluntarios = await Voluntario.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ voluntarios });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro ao listar', message: error.message });
  }
};

exports.obterEstatisticas = async (req, res) => {
  try {
    const total = await Voluntario.count();
    res.json({ total, ativos: 0, inativos: 0, pendentes: 0 });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro stats', message: error.message });
  }
};

exports.buscarVoluntarioPorId = async (req, res) => {
  try {
    const voluntario = await Voluntario.findByPk(req.params.id);
    if (!voluntario) return res.status(404).json({ error: 'Não encontrado' });
    res.json(voluntario);
  } catch (error) {
    res.status(500).json({ error: 'Erro', message: error.message });
  }
};

exports.criarVoluntario = async (req, res) => {
  try {
    const { nome, email, telefone, projeto, disponibilidade } = req.body;
    if (!nome || !email || !telefone) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }
    const novo = await Voluntario.create({ nome, email, telefone, projeto, disponibilidade });
    res.status(201).json(novo);
  } catch (error) {
    res.status(500).json({ error: 'Erro criar', message: error.message });
  }
};

exports.atualizarVoluntario = async (req, res) => {
  try {
    const voluntario = await Voluntario.findByPk(req.params.id);
    if (!voluntario) return res.status(404).json({ error: 'Não encontrado' });
    await voluntario.update(req.body);
    res.json(voluntario);
  } catch (error) {
    res.status(500).json({ error: 'Erro', message: error.message });
  }
};

exports.deletarVoluntario = async (req, res) => {
  try {
    const voluntario = await Voluntario.findByPk(req.params.id);
    if (!voluntario) return res.status(404).json({ error: 'Não encontrado' });
    await voluntario.destroy();
    res.json({ message: 'Deletado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro', message: error.message });
  }
};
