// admin-voluntarios.js - VERSÃO CORRIGIDA

const API_URL = 'http://localhost:3000/api';

let voluntarios = [];
let filtroStatus = 'todos';
let buscaTexto = '';
let voluntarioEditando = null;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  INICIALIZAÇÃO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Página carregada');
  carregarVoluntarios();
  carregarEstatisticas();
  inicializarEventos();
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CARREGAR VOLUNTÁRIOS DA API - CORRIGIDO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function carregarVoluntarios() {
  try {
    showLoading();
    
    const url = `${API_URL}/voluntarios`;
    console.log('🔍 Buscando:', url);
    
    const response = await fetch(url);
    console.log('📥 Resposta:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📦 Dados recebidos:', data);
    
    // CORREÇÃO: A API retorna {voluntarios: [...]}
    // NÃO {success: true, data: [...]}
    if (data.voluntarios) {
      voluntarios = data.voluntarios;
      console.log(`✅ ${voluntarios.length} voluntários carregados`);
      renderizarVoluntarios();
    } else {
      console.warn('⚠️ Estrutura inesperada:', data);
      mostrarErro('Formato de resposta inválido');
    }
  } catch (error) {
    console.error('❌ Erro:', error);
    mostrarErro('Erro ao conectar com o servidor');
  } finally {
    hideLoading();
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  RENDERIZAR TABELA DE VOLUNTÁRIOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function renderizarVoluntarios() {
  const tbody = document.getElementById('tabela-voluntarios-body');
  
  if (!tbody) {
    console.error('❌ Elemento tabela-voluntarios-body não encontrado!');
    return;
  }
  
  if (voluntarios.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 3rem; color: #666;">
          <span class="material-symbols-rounded" style="font-size: 3rem; display: block; margin-bottom: 1rem;">person_off</span>
          <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">📋 Nenhum voluntário cadastrado</p>
          <p style="font-size: 0.9rem; color: #999;">Os voluntários aparecerão aqui quando forem cadastrados.</p>
        </td>
      </tr>
    `;
    console.log('ℹ️ Tabela vazia renderizada');
    return;
  }
  
  tbody.innerHTML = voluntarios.map(vol => {
    return `
      <tr>
        <td>
          <div class="admin-table-cell-main">
            <div class="admin-table-icon">
              <span class="material-symbols-rounded">person</span>
            </div>
            <div>
              <strong>${vol.nome || 'N/A'}</strong>
              <small>${vol.email || 'N/A'}</small>
            </div>
          </div>
        </td>
        <td>${vol.telefone || 'N/A'}</td>
        <td>${vol.projeto || 'Não definido'}</td>
        <td>
          <span class="admin-badge admin-badge-success">
            Ativo
          </span>
        </td>
        <td>
          <span style="font-size: 0.875rem;">${formatarData(vol.createdAt || new Date())}</span>
        </td>
        <td>
          <div class="admin-table-actions">
            <button class="admin-btn-icon" onclick="visualizarVoluntario(${vol.id})" title="Visualizar">
              <span class="material-symbols-rounded">visibility</span>
            </button>
            <button class="admin-btn-icon" onclick="editarVoluntario(${vol.id})" title="Editar">
              <span class="material-symbols-rounded">edit</span>
            </button>
            <button class="admin-btn-icon" onclick="deletarVoluntario(${vol.id})" title="Deletar">
              <span class="material-symbols-rounded">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
  
  console.log(`✅ Tabela renderizada com ${voluntarios.length} voluntários`);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CARREGAR ESTATÍSTICAS - CORRIGIDO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function carregarEstatisticas() {
  try {
    const response = await fetch(`${API_URL}/voluntarios/stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📊 Estatísticas:', data);
    
    // A API retorna direto: {total: 0, ativos: 0, ...}
    atualizarCards(data);
  } catch (error) {
    console.error('❌ Erro ao carregar estatísticas:', error);
  }
}

function atualizarCards(stats) {
  const elementos = {
    'total-voluntarios': stats.total || 0,
    'voluntarios-ativos': stats.ativos || 0,
    'novos-voluntarios': stats.pendentes || 0
  };
  
  Object.entries(elementos).forEach(([id, valor]) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.textContent = valor;
      console.log(`✅ ${id}: ${valor}`);
    } else {
      console.warn(`⚠️ Elemento #${id} não encontrado`);
    }
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  EVENTOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function inicializarEventos() {
  const inputBusca = document.getElementById('busca-voluntario');
  if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
      buscaTexto = e.target.value;
      filtrarTabela();
    });
  }
  
  const selectStatus = document.getElementById('filtro-status');
  if (selectStatus) {
    selectStatus.addEventListener('change', (e) => {
      filtroStatus = e.target.value;
      filtrarTabela();
    });
  }
  
  const btnCriar = document.getElementById('btn-criar-voluntario');
  if (btnCriar) {
    btnCriar.addEventListener('click', abrirModalCriar);
  }
  
  const btnExportar = document.getElementById('btn-exportar');
  if (btnExportar) {
    btnExportar.addEventListener('click', exportarCSV);
  }
  
  const btnFechar = document.getElementById('fechar-modal');
  if (btnFechar) {
    btnFechar.addEventListener('click', fecharModal);
  }
  
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', fecharModal);
  }
}

function filtrarTabela() {
  const rows = document.querySelectorAll('#tabela-voluntarios-body tr');
  rows.forEach(row => {
    const texto = row.textContent.toLowerCase();
    const match = texto.includes(buscaTexto.toLowerCase());
    row.style.display = match ? '' : 'none';
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function abrirModalCriar() {
  alert('Função de cadastro ainda não implementada no backend');
}

function fecharModal() {
  const modal = document.getElementById('modal-voluntario');
  if (modal) {
    modal.classList.remove('active');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  AÇÕES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function visualizarVoluntario(id) {
  try {
    const response = await fetch(`${API_URL}/voluntarios/${id}`);
    
    if (!response.ok) {
      throw new Error('Voluntário não encontrado');
    }
    
    const vol = await response.json();
    
    alert(`
👤 VOLUNTÁRIO #${vol.id}

Nome: ${vol.nome}
Email: ${vol.email}
Telefone: ${vol.telefone}
Projeto: ${vol.projeto || 'Não definido'}
Disponibilidade: ${vol.disponibilidade || 'Não definida'}

Cadastrado: ${formatarDataCompleta(vol.createdAt)}
    `);
  } catch (error) {
    console.error('Erro:', error);
    mostrarErro('Erro ao buscar voluntário');
  }
}

function editarVoluntario(id) {
  alert('Função de edição em desenvolvimento');
}

async function deletarVoluntario(id) {
  const voluntario = voluntarios.find(v => v.id === id);
  if (!voluntario) return;
  
  if (!confirm(`Deseja realmente deletar ${voluntario.nome}?\n\nEsta ação não pode ser desfeita!`)) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/voluntarios/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Erro ao deletar');
    }
    
    mostrarSucesso('Voluntário removido!');
    carregarVoluntarios();
    carregarEstatisticas();
  } catch (error) {
    console.error('Erro:', error);
    mostrarErro('Erro ao deletar voluntário');
  }
}

function exportarCSV() {
  const csv = [
    ['ID', 'Nome', 'Email', 'Telefone', 'Projeto'],
    ...voluntarios.map(v => [v.id, v.nome, v.email, v.telefone, v.projeto || ''])
  ].map(row => row.join(';')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `voluntarios_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  
  mostrarSucesso('Lista exportada!');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UTILITÁRIOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}

function formatarDataCompleta(data) {
  return new Date(data).toLocaleString('pt-BR');
}

function showLoading() {
  console.log('⏳ Loading...');
}

function hideLoading() {
  console.log('✅ Loading concluído');
}

function mostrarErro(mensagem) {
  console.error('❌', mensagem);
  alert('❌ ' + mensagem);
}

function mostrarSucesso(mensagem) {
  console.log('✅', mensagem);
  alert('✅ ' + mensagem);
}

console.log('📄 admin-voluntarios.js carregado e pronto!');
