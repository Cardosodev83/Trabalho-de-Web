// js/api.js
const API_URL = 'http://localhost:3000/api';

const api = {
  // ============ PROJETOS ============
  
  // Listar todos os projetos
  async getProjetos() {
    try {
      const response = await fetch(`${API_URL}/projetos`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      return [];
    }
  },

  // Buscar projeto por ID
  async getProjetoById(id) {
    try {
      const response = await fetch(`${API_URL}/projetos/${id}`);
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Erro ao buscar projeto:', error);
      return null;
    }
  },

  // Criar novo projeto (admin)
  async criarProjeto(projeto) {
    try {
      const response = await fetch(`${API_URL}/projetos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projeto)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      return { success: false, message: error.message };
    }
  },

  // Atualizar projeto (admin)
  async atualizarProjeto(id, projeto) {
    try {
      const response = await fetch(`${API_URL}/projetos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projeto)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      return { success: false, message: error.message };
    }
  },

  // Deletar projeto (admin)
  async deletarProjeto(id) {
    try {
      const response = await fetch(`${API_URL}/projetos/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      return { success: false, message: error.message };
    }
  },

  // ============ DOAÇÕES ============
  
  // Criar doação
  async criarDoacao(doacao) {
    try {
      const response = await fetch(`${API_URL}/doacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(doacao)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao criar doação:', error);
      return { success: false, message: error.message };
    }
  },

  // Listar doações (admin)
  async getDoacoes() {
    try {
      const response = await fetch(`${API_URL}/doacoes`);
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Erro ao buscar doações:', error);
      return [];
    }
  },

  // Relatório de doações (admin)
  async getRelatorio() {
    try {
      const response = await fetch(`${API_URL}/doacoes/relatorio`);
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Erro ao buscar relatório:', error);
      return null;
    }
  }
};
