const { Projeto, Doacao } = require('../models');

// GET /api/projetos - Listar todos os projetos
exports.listarTodos = async (req, res) => {
  try {
    const projetos = await Projeto.findAll({
      include: [{
        model: Doacao,
        as: 'doacoes',
        attributes: ['id', 'valor', 'doador_nome']
      }],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      total: projetos.length,
      data: projetos
    });
  } catch (error) {
    console.error('Erro ao listar projetos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar projetos',
      error: error.message
    });
  }
};

// GET /api/projetos/:id - Buscar um projeto por ID
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const projeto = await Projeto.findByPk(id, {
      include: [{
        model: Doacao,
        as: 'doacoes'
      }]
    });

    if (!projeto) {
      return res.status(404).json({
        success: false,
        message: 'Projeto não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: projeto
    });
  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar projeto',
      error: error.message
    });
  }
};

// POST /api/projetos - Criar novo projeto
exports.criar = async (req, res) => {
  try {
    const {
      nome,
      descricao,
      meta_financeira,
      beneficiarios_atendidos,
      imagem_url,
      status
    } = req.body;

    // Validação básica
    if (!nome) {
      return res.status(400).json({
        success: false,
        message: 'O nome do projeto é obrigatório'
      });
    }

    const novoProjeto = await Projeto.create({
      nome,
      descricao,
      meta_financeira: meta_financeira || 0,
      arrecadado_atual: 0,
      beneficiarios_atendidos: beneficiarios_atendidos || 0,
      imagem_url,
      status: status || 'ativo'
    });

    res.status(201).json({
      success: true,
      message: 'Projeto criado com sucesso',
      data: novoProjeto
    });
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar projeto',
      error: error.message
    });
  }
};

// PUT /api/projetos/:id - Atualizar projeto
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome,
      descricao,
      meta_financeira,
      arrecadado_atual,
      beneficiarios_atendidos,
      imagem_url,
      status
    } = req.body;

    const projeto = await Projeto.findByPk(id);

    if (!projeto) {
      return res.status(404).json({
        success: false,
        message: 'Projeto não encontrado'
      });
    }

    await projeto.update({
      nome: nome || projeto.nome,
      descricao: descricao || projeto.descricao,
      meta_financeira: meta_financeira !== undefined ? meta_financeira : projeto.meta_financeira,
      arrecadado_atual: arrecadado_atual !== undefined ? arrecadado_atual : projeto.arrecadado_atual,
      beneficiarios_atendidos: beneficiarios_atendidos !== undefined ? beneficiarios_atendidos : projeto.beneficiarios_atendidos,
      imagem_url: imagem_url || projeto.imagem_url,
      status: status || projeto.status
    });

    res.status(200).json({
      success: true,
      message: 'Projeto atualizado com sucesso',
      data: projeto
    });
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar projeto',
      error: error.message
    });
  }
};

// DELETE /api/projetos/:id - Deletar projeto
exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;

    const projeto = await Projeto.findByPk(id);

    if (!projeto) {
      return res.status(404).json({
        success: false,
        message: 'Projeto não encontrado'
      });
    }

    await projeto.destroy();

    res.status(200).json({
      success: true,
      message: 'Projeto deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar projeto',
      error: error.message
    });
  }
};
