// admin-depoimentos.js - Gerenciamento de depoimentos

const API_URL = 'http://localhost:3000/api';

let depoimentos = [];
let depoimentoEditando = null;

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Admin Depoimentos carregado');
  carregarDepoimentos();
  carregarEstatisticas();
  inicializarEventos();
});

// CARREGAR DEPOIMENTOS
async function carregarDepoimentos() {
  try {
    const response = await fetch(`${API_URL}/depoimentos`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📦 Depoimentos recebidos:', data);
    
    if (data.depoimentos) {
      depoimentos = data.depoimentos;
      renderizarDepoimentos();
    }
  } catch (error) {
    console.error('❌ Erro:', error);
    mostrarErro('Erro ao conectar com o servidor');
  }
}

// RENDERIZAR TABELA
function renderizarDepoimentos() {
  const tbody = document.getElementById('tabela-depoimentos-body');
  
  if (!tbody) {
    console.error('❌ Elemento não encontrado!');
    return;
  }
  
  if (depoimentos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 3rem;">
          <span class="material-symbols-rounded" style="font-size: 3rem; display: block; margin-bottom: 1rem;">rate_review</span>
          <p style="font-size: 1.2rem;">📝 Nenhum depoimento cadastrado</p>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = depoimentos.map(dep => {
    const textoPreview = dep.texto.length > 100 
      ? dep.texto.substring(0, 100) + '...' 
      : dep.texto;
    
    return `
      <tr>
        <td>
          <div class="admin-table-cell-main">
            <div class="admin-table-icon">
              ${dep.foto_url 
                ? `<img src="${dep.foto_url}" alt="${dep.autor}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">`
                : '<span class="material-symbols-rounded">person</span>'}
            </div>
            <div>
              <strong>${dep.autor}</strong>
              <small>${dep.cargo || 'Sem cargo definido'}</small>
            </div>
          </div>
        </td>
        <td>
          <p style="font-size: 0.875rem; line-height: 1.5; max-width: 400px;">
            "${textoPreview}"
          </p>
        </td>
        <td>
          <span class="admin-badge ${dep.destaque ? 'admin-badge-warning' : 'admin-badge-secondary'}">
            ${dep.destaque ? '⭐ Destaque' : 'Normal'}
          </span>
        </td>
        <td>
          <span class="admin-badge ${dep.status === 'ativo' ? 'admin-badge-success' : 'admin-badge-secondary'}">
            ${dep.status === 'ativo' ? 'Ativo' : 'Inativo'}
          </span>
        </td>
        <td>
          <div class="admin-table-actions">
            <button class="admin-btn-icon" 
                    onclick="visualizarDepoimento(${dep.id})"
                    aria-label="Visualizar depoimento de ${dep.autor}">
              <span class="material-symbols-rounded" aria-hidden="true">visibility</span>
            </button>
            <button class="admin-btn-icon" 
                    onclick="editarDepoimento(${dep.id})"
                    aria-label="Editar depoimento de ${dep.autor}">
              <span class="material-symbols-rounded" aria-hidden="true">edit</span>
            </button>
            <button class="admin-btn-icon" 
                    onclick="deletarDepoimento(${dep.id})"
                    aria-label="Excluir depoimento de ${dep.autor}">
              <span class="material-symbols-rounded" aria-hidden="true">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
  
  console.log(`✅ ${depoimentos.length} depoimentos renderizados`);
}

// ESTATÍSTICAS
async function carregarEstatisticas() {
  try {
    const response = await fetch(`${API_URL}/depoimentos/stats`);
    
    if (!response.ok) throw new Error('Erro ao carregar stats');
    
    const stats = await response.json();
    console.log('📊 Estatísticas:', stats);
    
    atualizarCards(stats);
  } catch (error) {
    console.error('❌ Erro stats:', error);
  }
}

function atualizarCards(stats) {
  const elementos = {
    'total-depoimentos': stats.total || 0,
    'depoimentos-ativos': stats.ativos || 0,
    'depoimentos-destaque': stats.destaques || 0
  };
  
  Object.entries(elementos).forEach(([id, valor]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
  });
}

// EVENTOS
function inicializarEventos() {
  const btnCriar = document.getElementById('btn-criar-depoimento');
  if (btnCriar) btnCriar.addEventListener('click', abrirModalCriar);
  
  const btnFechar = document.getElementById('fechar-modal');
  if (btnFechar) btnFechar.addEventListener('click', fecharModal);
  
  const form = document.getElementById('form-depoimento');
  if (form) form.addEventListener('submit', salvarDepoimento);
  
  const inputBusca = document.getElementById('busca-depoimento');
  if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
      const termo = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('#tabela-depoimentos-body tr');
      rows.forEach(row => {
        const texto = row.textContent.toLowerCase();
        row.style.display = texto.includes(termo) ? '' : 'none';
      });
    });
  }
}

// MODAL
function abrirModalCriar() {
  depoimentoEditando = null;
  document.getElementById('modal-titulo').textContent = 'Novo Depoimento';
  document.getElementById('form-depoimento').reset();
  document.getElementById('modal-depoimento').classList.add('active');
}

function abrirModalEditar(depoimento) {
  depoimentoEditando = depoimento;
  document.getElementById('modal-titulo').textContent = 'Editar Depoimento';
  
  document.getElementById('autor').value = depoimento.autor;
  document.getElementById('cargo').value = depoimento.cargo || '';
  document.getElementById('texto').value = depoimento.texto;
  document.getElementById('foto_url').value = depoimento.foto_url || '';
  document.getElementById('destaque').checked = depoimento.destaque;
  document.getElementById('status').value = depoimento.status;
  
  document.getElementById('modal-depoimento').classList.add('active');
}

function fecharModal() {
  document.getElementById('modal-depoimento').classList.remove('active');
  depoimentoEditando = null;
}

// AÇÕES
async function visualizarDepoimento(id) {
  try {
    const response = await fetch(`${API_URL}/depoimentos/${id}`);
    if (!response.ok) throw new Error('Não encontrado');
    
    const dep = await response.json();
    
    alert(`
👤 ${dep.autor}${dep.cargo ? ' - ' + dep.cargo : ''}

📝 DEPOIMENTO:
"${dep.texto}"

${dep.foto_url ? '📷 Foto: ' + dep.foto_url : ''}
${dep.destaque ? '⭐ EM DESTAQUE' : ''}
Status: ${dep.status === 'ativo' ? '🟢 Ativo' : '🔴 Inativo'}

Data: ${new Date(dep.created_at).toLocaleString('pt-BR')}
    `);
  } catch (error) {
    alert('❌ Erro ao buscar depoimento');
  }
}

async function editarDepoimento(id) {
  try {
    const response = await fetch(`${API_URL}/depoimentos/${id}`);
    if (!response.ok) throw new Error('Não encontrado');
    
    const depoimento = await response.json();
    abrirModalEditar(depoimento);
  } catch (error) {
    alert('❌ Erro ao buscar depoimento');
  }
}

async function salvarDepoimento(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  
  const dados = {
    autor: formData.get('autor'),
    cargo: formData.get('cargo') || null,
    texto: formData.get('texto'),
    foto_url: formData.get('foto_url') || null,
    destaque: formData.get('destaque') === 'on',
    status: formData.get('status') || 'ativo'
  };
  
  try {
    const url = depoimentoEditando 
      ? `${API_URL}/depoimentos/${depoimentoEditando.id}`
      : `${API_URL}/depoimentos`;
    
    const method = depoimentoEditando ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    
    if (response.ok || response.status === 201) {
      alert(`✅ Depoimento ${depoimentoEditando ? 'atualizado' : 'criado'} com sucesso!`);
      fecharModal();
      carregarDepoimentos();
      carregarEstatisticas();
    } else {
      const erro = await response.json();
      alert('❌ ' + (erro.message || erro.error));
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('❌ Erro ao salvar depoimento');
  }
}

async function deletarDepoimento(id) {
  const dep = depoimentos.find(d => d.id === id);
  if (!dep) return;
  
  if (!confirm(`Deseja realmente deletar o depoimento de ${dep.autor}?\n\nEsta ação não pode ser desfeita!`)) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/depoimentos/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      alert('✅ Depoimento removido!');
      carregarDepoimentos();
      carregarEstatisticas();
    } else {
      alert('❌ Erro ao deletar');
    }
  } catch (error) {
    alert('❌ Erro ao deletar depoimento');
  }
}

// UTILITÁRIOS
function mostrarErro(msg) {
  console.error('❌', msg);
  alert('❌ ' + msg);
}

console.log('✅ admin-depoimentos.js carregado!');
