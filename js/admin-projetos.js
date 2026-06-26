// admin-projetos.js - Gerenciamento de projetos

const API_URL = 'http://localhost:3000/api';

// Estado da aplicação
let projetos = [];
let projetoEditando = null;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  INICIALIZAÇÃO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', () => {
  carregarProjetos();
  inicializarEventos();
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CARREGAR PROJETOS DA API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function carregarProjetos() {
  try {
    showLoading();
    
    const response = await fetch(`${API_URL}/projetos`);
    const data = await response.json();
    
    if (data.success) {
      projetos = data.data;
      renderizarProjetos();
      atualizarEstatisticas();
    } else {
      mostrarErro('Erro ao carregar projetos');
    }
  } catch (error) {
    console.error('Erro:', error);
    mostrarErro('Erro ao conectar com o servidor');
  } finally {
    hideLoading();
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  RENDERIZAR GRID DE PROJETOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function renderizarProjetos() {
  const container = document.getElementById('projetos-grid');
  
  if (!container) return;
  
  if (projetos.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #666;">
        <span class="material-symbols-rounded" style="font-size: 4rem; display: block; margin-bottom: 1rem;">folder_off</span>
        <p style="font-size: 1.125rem; margin-bottom: 1rem;">Nenhum projeto cadastrado</p>
        <button onclick="abrirModalCriar()" class="btn btn-primary">
          <span class="material-symbols-rounded">add</span>
          Criar Primeiro Projeto
        </button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = projetos.map(projeto => {
    const percentual = (projeto.arrecadado_atual / projeto.meta_financeira * 100).toFixed(0);
    const ativo = projeto.status === 'ativo';
    
    return `
      <div class="admin-card">
        <div class="admin-card-title">
          <span class="material-symbols-rounded" style="color: ${ativo ? 'var(--secondary)' : '#999'};">
            ${ativo ? 'check_circle' : 'pause_circle'}
          </span>
          <h3>${projeto.nome}</h3>
        </div>
        
        <p class="admin-card-description">${projeto.descricao || 'Sem descrição'}</p>
        
        <div class="admin-card-stats">
          <div class="admin-stat-item">
            <strong>R$ ${formatarValor(projeto.arrecadado_atual)}</strong>
            <span>Arrecadado</span>
          </div>
          <div class="admin-stat-item">
            <strong>R$ ${formatarValor(projeto.meta_financeira)}</strong>
            <span>Meta</span>
          </div>
        </div>
        
        <div style="margin: 1rem 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem;">
            <span style="color: #666;">Progresso</span>
            <span style="font-weight: 700; color: var(--secondary);">${percentual}%</span>
          </div>
          <div style="width: 100%; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden;">
            <div style="width: ${Math.min(percentual, 100)}%; height: 100%; background: ${percentual >= 100 ? 'var(--secondary)' : 'var(--primary)'}; transition: width 0.3s;"></div>
          </div>
        </div>
        
        <div class="admin-card-meta">
          <div class="admin-meta-item">
            <span class="material-symbols-rounded">calendar_today</span>
            Criado em ${formatarData(projeto.created_at)}
          </div>
        </div>
        
        <div class="admin-card-footer">
          <button onclick="visualizarProjeto(${projeto.id})" class="admin-btn admin-btn-outline" style="flex: 1;">
            <span class="material-symbols-rounded">visibility</span>
            Ver
          </button>
          <button onclick="editarProjeto(${projeto.id})" class="admin-btn admin-btn-outline" style="flex: 1;">
            <span class="material-symbols-rounded">edit</span>
            Editar
          </button>
          <button onclick="deletarProjeto(${projeto.id})" class="admin-btn admin-btn-outline" style="color: #dc2626;">
            <span class="material-symbols-rounded">delete</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ATUALIZAR ESTATÍSTICAS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function atualizarEstatisticas() {
  const totalProjetos = projetos.length;
  const projetosAtivos = projetos.filter(p => p.status === 'ativo').length;
  const totalArrecadado = projetos.reduce((sum, p) => sum + parseFloat(p.arrecadado_atual || 0), 0);
  const totalMeta = projetos.reduce((sum, p) => sum + parseFloat(p.meta_financeira || 0), 0);
  
  // Atualizar cards
  const totalElement = document.getElementById('total-projetos');
  if (totalElement) totalElement.textContent = totalProjetos;
  
  const ativosElement = document.getElementById('projetos-ativos');
  if (ativosElement) ativosElement.textContent = projetosAtivos;
  
  const arrecadadoElement = document.getElementById('total-arrecadado-projetos');
  if (arrecadadoElement) arrecadadoElement.textContent = `R$ ${formatarValor(totalArrecadado)}`;
  
  const metaElement = document.getElementById('total-meta');
  if (metaElement) metaElement.textContent = `R$ ${formatarValor(totalMeta)}`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  EVENTOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function inicializarEventos() {
  // Botão criar projeto
  const btnCriar = document.getElementById('btn-criar-projeto');
  if (btnCriar) {
    btnCriar.addEventListener('click', abrirModalCriar);
  }
  
  // Formulário de projeto
  const form = document.getElementById('form-projeto');
  if (form) {
    form.addEventListener('submit', salvarProjeto);
  }
  
  // Fechar modal
  const btnFechar = document.getElementById('fechar-modal');
  if (btnFechar) {
    btnFechar.addEventListener('click', fecharModal);
  }
  
  // Overlay do modal
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', fecharModal);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function abrirModalCriar() {
  projetoEditando = null;
  document.getElementById('modal-titulo').textContent = 'Criar Novo Projeto';
  document.getElementById('form-projeto').reset();
  document.getElementById('modal-projeto').classList.add('active');
}

function abrirModalEditar(projeto) {
  projetoEditando = projeto;
  document.getElementById('modal-titulo').textContent = 'Editar Projeto';
  
  // Preencher form
  document.getElementById('nome').value = projeto.nome;
  document.getElementById('descricao').value = projeto.descricao || '';
  document.getElementById('meta_financeira').value = projeto.meta_financeira;
  document.getElementById('data_inicio').value = projeto.data_inicio ? projeto.data_inicio.split('T')[0] : '';
  document.getElementById('data_fim').value = projeto.data_fim ? projeto.data_fim.split('T')[0] : '';
  document.getElementById('status').value = projeto.status || 'ativo';
  
  document.getElementById('modal-projeto').classList.add('active');
}

function fecharModal() {
  document.getElementById('modal-projeto').classList.remove('active');
  projetoEditando = null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  AÇÕES DE PROJETO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function visualizarProjeto(id) {
  try {
    const response = await fetch(`${API_URL}/projetos/${id}`);
    const data = await response.json();
    
    if (data.success) {
      const projeto = data.data;
      const percentual = (projeto.arrecadado_atual / projeto.meta_financeira * 100).toFixed(1);
      
      alert(`
📁 DETALHES DO PROJETO

Nome: ${projeto.nome}
Descrição: ${projeto.descricao || 'Sem descrição'}

💰 FINANCEIRO:
Meta: R$ ${formatarValor(projeto.meta_financeira)}
Arrecadado: R$ ${formatarValor(projeto.arrecadado_atual)}
Progresso: ${percentual}%

📅 DATAS:
Início: ${projeto.data_inicio ? formatarData(projeto.data_inicio) : 'Não definido'}
Fim: ${projeto.data_fim ? formatarData(projeto.data_fim) : 'Não definido'}

Status: ${projeto.status === 'ativo' ? '🟢 Ativo' : '🔴 Inativo'}
Criado em: ${formatarDataCompleta(projeto.created_at)}
      `);
    }
  } catch (error) {
    console.error('Erro:', error);
    mostrarErro('Erro ao buscar projeto');
  }
}

async function editarProjeto(id) {
  try {
    const response = await fetch(`${API_URL}/projetos/${id}`);
    const data = await response.json();
    
    if (data.success) {
      abrirModalEditar(data.data);
    }
  } catch (error) {
    console.error('Erro:', error);
    mostrarErro('Erro ao buscar projeto');
  }
}

async function salvarProjeto(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const dados = {
    nome: formData.get('nome'),
    descricao: formData.get('descricao'),
    meta_financeira: parseFloat(formData.get('meta_financeira')),
    data_inicio: formData.get('data_inicio') || null,
    data_fim: formData.get('data_fim') || null,
    status: formData.get('status') || 'ativo'
  };
  
  try {
    const url = projetoEditando 
      ? `${API_URL}/projetos/${projetoEditando.id}`
      : `${API_URL}/projetos`;
    
    const method = projetoEditando ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    
    const data = await response.json();
    
    if (data.success) {
      mostrarSucesso(projetoEditando ? 'Projeto atualizado!' : 'Projeto criado!');
      fecharModal();
      carregarProjetos();
    } else {
      mostrarErro(data.message || 'Erro ao salvar projeto');
    }
  } catch (error) {
    console.error('Erro:', error);
    mostrarErro('Erro ao salvar projeto');
  }
}

async function deletarProjeto(id) {
  const projeto = projetos.find(p => p.id === id);
  if (!projeto) return;
  
  if (!confirm(`Deseja realmente deletar o projeto "${projeto.nome}"?\n\nEsta ação não pode ser desfeita!`)) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/projetos/${id}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (data.success) {
      mostrarSucesso('Projeto removido com sucesso!');
      carregarProjetos();
    } else {
      mostrarErro(data.message || 'Erro ao deletar');
    }
  } catch (error) {
    console.error('Erro:', error);
    mostrarErro('Erro ao deletar projeto');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UTILITÁRIOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function formatarValor(valor) {
  return parseFloat(valor).toFixed(2).replace('.', ',');
}

function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}

function formatarDataCompleta(data) {
  return new Date(data).toLocaleString('pt-BR');
}

function showLoading() {
  // Implementar loading
}

function hideLoading() {
  // Implementar loading
}

function mostrarErro(mensagem) {
  alert('❌ ' + mensagem);
}

function mostrarSucesso(mensagem) {
  alert('✅ ' + mensagem);
}
