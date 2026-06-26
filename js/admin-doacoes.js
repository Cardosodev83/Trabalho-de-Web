// admin-doacoes.js - Gerenciamento de doações

const API_URL = 'http://localhost:3000/api';

// Estado da aplicação
let doacoes = [];
let filtroStatus = 'todos';
let buscaTexto = '';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  INICIALIZAÇÃO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', () => {
  carregarDoacoes();
  inicializarEventos();
  carregarEstatisticas();
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CARREGAR DOAÇÕES DA API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function carregarDoacoes() {
  try {
    showLoading();
    
    const response = await fetch(`${API_URL}/doacoes`);
    const data = await response.json();
    
    if (data.success) {
      doacoes = data.data;
      renderizarDoacoes();
    } else {
      mostrarErro('Erro ao carregar doações');
    }
  } catch (error) {
    console.error('Erro:', error);
    mostrarErro('Erro ao conectar com o servidor');
  } finally {
    hideLoading();
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  RENDERIZAR TABELA DE DOAÇÕES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function renderizarDoacoes() {
  const tbody = document.getElementById('tabela-doacoes-body');
  
  if (!tbody) return;
  
  // Filtrar doações
  let doacoesFiltradas = doacoes;
  
  // Filtrar por status
  if (filtroStatus !== 'todos') {
    doacoesFiltradas = doacoesFiltradas.filter(d => d.status_pagamento === filtroStatus);
  }
  
  // Filtrar por busca
  if (buscaTexto) {
    doacoesFiltradas = doacoesFiltradas.filter(d => 
      d.doador_nome.toLowerCase().includes(buscaTexto.toLowerCase()) ||
      d.doador_email.toLowerCase().includes(buscaTexto.toLowerCase())
    );
  }
  
  // Renderizar
  if (doacoesFiltradas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 3rem; color: #666;">
          <span class="material-symbols-rounded" style="font-size: 3rem; display: block; margin-bottom: 1rem;">search_off</span>
          Nenhuma doação encontrada
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = doacoesFiltradas.map(doacao => `
    <tr>
      <td>
        <div class="admin-table-cell-main">
          <div class="admin-table-icon">
            <span class="material-symbols-rounded">payments</span>
          </div>
          <div>
            <strong>${doacao.doador_nome}</strong>
            <small>${doacao.doador_email}</small>
          </div>
        </div>
      </td>
      <td><strong style="color: var(--tertiary);">R$ ${formatarValor(doacao.valor)}</strong></td>
      <td>
        ${doacao.projeto ? `
          <span style="font-size: 0.875rem;">${doacao.projeto.nome}</span>
        ` : `
          <span style="color: #999; font-size: 0.875rem;">Doação Geral</span>
        `}
      </td>
      <td>
        <span class="admin-badge ${getBadgeClass(doacao.status_pagamento)}">
          ${getStatusTexto(doacao.status_pagamento)}
        </span>
      </td>
      <td>
        <span style="font-size: 0.875rem;">${doacao.tipo === 'unica' ? 'Única' : 'Recorrente'}</span>
      </td>
      <td>
        <span style="font-size: 0.875rem;">${formatarData(doacao.created_at)}</span>
      </td>
      <td>
        <div class="admin-table-actions">
          <button class="admin-btn-icon" onclick="visualizarDoacao(${doacao.id})" title="Visualizar">
            <span class="material-symbols-rounded">visibility</span>
          </button>
          <button class="admin-btn-icon" onclick="editarDoacao(${doacao.id})" title="Editar">
            <span class="material-symbols-rounded">edit</span>
          </button>
          <button class="admin-btn-icon" onclick="deletarDoacao(${doacao.id})" title="Deletar">
            <span class="material-symbols-rounded">delete</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CARREGAR ESTATÍSTICAS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function carregarEstatisticas() {
  try {
    const response = await fetch(`${API_URL}/doacoes/relatorio`);
    const data = await response.json();
    
    if (data.success) {
      atualizarCards(data.data);
    }
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
  }
}

function atualizarCards(stats) {
  // Total arrecadado
  const totalElement = document.getElementById('total-arrecadado');
  if (totalElement) {
    totalElement.textContent = `R$ ${formatarValor(stats.total_geral || 0)}`;
  }
  
  // Número de doações
  const qtdElement = document.getElementById('qtd-doacoes');
  if (qtdElement) {
    qtdElement.textContent = doacoes.length;
  }
  
  // Média de doação
  const mediaElement = document.getElementById('media-doacao');
  if (mediaElement) {
    const media = doacoes.length > 0 ? stats.total_geral / doacoes.length : 0;
    mediaElement.textContent = `R$ ${formatarValor(media)}`;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  EVENTOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function inicializarEventos() {
  // Busca
  const inputBusca = document.getElementById('busca-doacao');
  if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
      buscaTexto = e.target.value;
      renderizarDoacoes();
    });
  }
  
  // Filtro de status
  const selectStatus = document.getElementById('filtro-status');
  if (selectStatus) {
    selectStatus.addEventListener('change', (e) => {
      filtroStatus = e.target.value;
      renderizarDoacoes();
    });
  }
  
  // Botão exportar
  const btnExportar = document.getElementById('btn-exportar');
  if (btnExportar) {
    btnExportar.addEventListener('click', exportarCSV);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  AÇÕES DE DOAÇÃO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function visualizarDoacao(id) {
  try {
    const response = await fetch(`${API_URL}/doacoes/${id}`);
    const data = await response.json();
    
    if (data.success) {
      const doacao = data.data;
      
      alert(`
DETALHES DA DOAÇÃO

Doador: ${doacao.doador_nome}
Email: ${doacao.doador_email}
CPF: ${doacao.doador_cpf || 'Não informado'}
Valor: R$ ${formatarValor(doacao.valor)}
Tipo: ${doacao.tipo === 'unica' ? 'Única' : 'Recorrente'}
Status: ${getStatusTexto(doacao.status_pagamento)}
Projeto: ${doacao.projeto ? doacao.projeto.nome : 'Doação Geral'}
Data: ${formatarDataCompleta(doacao.created_at)}
      `);
    }
  } catch (error) {
    console.error('Erro:', error);
    mostrarErro('Erro ao buscar doação');
  }
}

async function editarDoacao(id) {
  const doacao = doacoes.find(d => d.id === id);
  if (!doacao) return;
  
  const novoStatus = prompt(`Editar status do pagamento de ${doacao.doador_nome}:\n\nStatus atual: ${getStatusTexto(doacao.status_pagamento)}\n\nDigite o novo status:\n- aprovado\n- pendente\n- cancelado`, doacao.status_pagamento);
  
  if (!novoStatus || novoStatus === doacao.status_pagamento) return;
  
  try {
    const response = await fetch(`${API_URL}/doacoes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status_pagamento: novoStatus })
    });
    
    const data = await response.json();
    
    if (data.success) {
      mostrarSucesso('Doação atualizada com sucesso!');
      carregarDoacoes();
      carregarEstatisticas();
    } else {
      mostrarErro(data.message || 'Erro ao atualizar');
    }
  } catch (error) {
    console.error('Erro:', error);
    mostrarErro('Erro ao atualizar doação');
  }
}

async function deletarDoacao(id) {
  const doacao = doacoes.find(d => d.id === id);
  if (!doacao) return;
  
  if (!confirm(`Deseja realmente deletar a doação de ${doacao.doador_nome} (R$ ${formatarValor(doacao.valor)})?\n\nEsta ação não pode ser desfeita!`)) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/doacoes/${id}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (data.success) {
      mostrarSucesso('Doação removida com sucesso!');
      carregarDoacoes();
      carregarEstatisticas();
    } else {
      mostrarErro(data.message || 'Erro ao deletar');
    }
  } catch (error) {
    console.error('Erro:', error);
    mostrarErro('Erro ao deletar doação');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  EXPORTAR CSV
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function exportarCSV() {
  const csv = [
    ['ID', 'Doador', 'Email', 'CPF', 'Valor', 'Projeto', 'Tipo', 'Status', 'Data'],
    ...doacoes.map(d => [
      d.id,
      d.doador_nome,
      d.doador_email,
      d.doador_cpf || '',
      d.valor,
      d.projeto ? d.projeto.nome : 'Doação Geral',
      d.tipo,
      d.status_pagamento,
      formatarDataCompleta(d.created_at)
    ])
  ].map(row => row.join(';')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `doacoes_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  
  mostrarSucesso('Relatório exportado com sucesso!');
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

function getBadgeClass(status) {
  const classes = {
    'aprovado': 'admin-badge-success',
    'pendente': 'admin-badge-warning',
    'cancelado': 'admin-badge-danger'
  };
  return classes[status] || 'admin-badge-secondary';
}

function getStatusTexto(status) {
  const textos = {
    'aprovado': 'Aprovado',
    'pendente': 'Pendente',
    'cancelado': 'Cancelado'
  };
  return textos[status] || status;
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
