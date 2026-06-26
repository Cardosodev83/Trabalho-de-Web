// admin-eventos.js - Gerenciamento de eventos

const API_URL = 'http://localhost:3000/api';

let eventos = [];
let eventoEditando = null;

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Admin Eventos carregado');
  carregarEventos();
  carregarEstatisticas();
  inicializarEventos();
});

// CARREGAR EVENTOS
async function carregarEventos() {
  try {
    const response = await fetch(`${API_URL}/eventos`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📦 Eventos recebidos:', data);
    
    if (data.eventos) {
      eventos = data.eventos;
      renderizarEventos();
    }
  } catch (error) {
    console.error('❌ Erro:', error);
    mostrarErro('Erro ao conectar com o servidor');
  }
}

// RENDERIZAR TABELA
function renderizarEventos() {
  const tbody = document.getElementById('tabela-eventos-body');
  
  if (!tbody) {
    console.error('❌ Elemento não encontrado!');
    return;
  }
  
  if (eventos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 3rem;">
          <span class="material-symbols-rounded" style="font-size: 3rem; display: block; margin-bottom: 1rem;">event</span>
          <p style="font-size: 1.2rem;">📅 Nenhum evento cadastrado</p>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = eventos.map(evt => {
    const dataEvento = new Date(evt.data_evento);
    const dataFormatada = dataEvento.toLocaleDateString('pt-BR');
    const horaFormatada = dataEvento.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const vagasTexto = evt.vagas 
      ? `${evt.vagas_preenchidas || 0}/${evt.vagas}` 
      : 'Sem limite';
    
    const statusBadge = {
      'rascunho': 'admin-badge-secondary',
      'publicado': 'admin-badge-success',
      'cancelado': 'admin-badge-danger',
      'finalizado': 'admin-badge-secondary'
    };
    
    const statusTexto = {
      'rascunho': 'Rascunho',
      'publicado': 'Publicado',
      'cancelado': 'Cancelado',
      'finalizado': 'Finalizado'
    };
    
    return `
      <tr>
        <td>
          <div class="admin-table-cell-main">
            <div class="admin-table-icon">
              <span class="material-symbols-rounded">event</span>
            </div>
            <div>
              <strong>${evt.titulo}</strong>
              <small>${evt.local}</small>
            </div>
          </div>
        </td>
        <td>
          <div style="font-size: 0.875rem;">
            <div>📅 ${dataFormatada}</div>
            <div>🕐 ${horaFormatada}</div>
          </div>
        </td>
        <td>
          <span style="font-size: 0.875rem;">${vagasTexto}</span>
        </td>
        <td>
          <span class="admin-badge ${statusBadge[evt.status]}">
            ${statusTexto[evt.status]}
          </span>
          ${evt.destaque ? '<br><span class="admin-badge admin-badge-warning" style="margin-top: 0.25rem;">⭐ Destaque</span>' : ''}
        </td>
        <td>
          <div class="admin-table-actions">
            <button class="admin-btn-icon" 
                    onclick="visualizarEvento(${evt.id})"
                    aria-label="Visualizar evento ${evt.titulo}">
              <span class="material-symbols-rounded" aria-hidden="true">visibility</span>
            </button>
            <button class="admin-btn-icon" 
                    onclick="editarEvento(${evt.id})"
                    aria-label="Editar evento ${evt.titulo}">
              <span class="material-symbols-rounded" aria-hidden="true">edit</span>
            </button>
            <button class="admin-btn-icon" 
                    onclick="deletarEvento(${evt.id})"
                    aria-label="Excluir evento ${evt.titulo}">
              <span class="material-symbols-rounded" aria-hidden="true">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
  
  console.log(`✅ ${eventos.length} eventos renderizados`);
}

// ESTATÍSTICAS
async function carregarEstatisticas() {
  try {
    const response = await fetch(`${API_URL}/eventos/stats`);
    
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
    'total-eventos': stats.total || 0,
    'eventos-proximos': stats.proximos || 0,
    'eventos-publicados': stats.publicados || 0
  };
  
  Object.entries(elementos).forEach(([id, valor]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
  });
}

// EVENTOS
function inicializarEventos() {
  const btnCriar = document.getElementById('btn-criar-evento');
  if (btnCriar) btnCriar.addEventListener('click', abrirModalCriar);
  
  const btnFechar = document.getElementById('fechar-modal');
  if (btnFechar) btnFechar.addEventListener('click', fecharModal);
  
  const form = document.getElementById('form-evento');
  if (form) form.addEventListener('submit', salvarEvento);
  
  const inputBusca = document.getElementById('busca-evento');
  if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
      const termo = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('#tabela-eventos-body tr');
      rows.forEach(row => {
        const texto = row.textContent.toLowerCase();
        row.style.display = texto.includes(termo) ? '' : 'none';
      });
    });
  }
}

// MODAL
function abrirModalCriar() {
  eventoEditando = null;
  document.getElementById('modal-titulo').textContent = 'Novo Evento';
  document.getElementById('form-evento').reset();
  
  // Data padrão: hoje
  const hoje = new Date();
  hoje.setHours(hoje.getHours() + 1);
  const dataInput = document.getElementById('data_evento');
  if (dataInput) {
    dataInput.value = hoje.toISOString().slice(0, 16);
  }
  
  document.getElementById('modal-evento').classList.add('active');
}

function abrirModalEditar(evento) {
  eventoEditando = evento;
  document.getElementById('modal-titulo').textContent = 'Editar Evento';
  
  document.getElementById('titulo').value = evento.titulo;
  document.getElementById('descricao').value = evento.descricao;
  
  // Formatar data para input datetime-local
  const dataEvento = new Date(evento.data_evento);
  document.getElementById('data_evento').value = dataEvento.toISOString().slice(0, 16);
  
  document.getElementById('local').value = evento.local;
  document.getElementById('endereco').value = evento.endereco || '';
  document.getElementById('vagas').value = evento.vagas || '';
  document.getElementById('imagem_url').value = evento.imagem_url || '';
  document.getElementById('organizador').value = evento.organizador || '';
  document.getElementById('destaque').checked = evento.destaque;
  document.getElementById('status').value = evento.status;
  
  document.getElementById('modal-evento').classList.add('active');
}

function fecharModal() {
  document.getElementById('modal-evento').classList.remove('active');
  eventoEditando = null;
}

// AÇÕES
async function visualizarEvento(id) {
  try {
    const response = await fetch(`${API_URL}/eventos/${id}`);
    if (!response.ok) throw new Error('Não encontrado');
    
    const evt = await response.json();
    const dataEvento = new Date(evt.data_evento);
    
    alert(`
📅 ${evt.titulo}

📍 Local: ${evt.local}
${evt.endereco ? '📫 Endereço: ' + evt.endereco : ''}

📝 Descrição:
${evt.descricao}

🗓️ Data: ${dataEvento.toLocaleDateString('pt-BR')} às ${dataEvento.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}

${evt.vagas ? '👥 Vagas: ' + (evt.vagas_preenchidas || 0) + '/' + evt.vagas : '👥 Vagas: Sem limite'}
${evt.organizador ? '👤 Organizador: ' + evt.organizador : ''}
${evt.destaque ? '⭐ EM DESTAQUE' : ''}

Status: ${evt.status.toUpperCase()}
    `);
  } catch (error) {
    alert('❌ Erro ao buscar evento');
  }
}

async function editarEvento(id) {
  try {
    const response = await fetch(`${API_URL}/eventos/${id}`);
    if (!response.ok) throw new Error('Não encontrado');
    
    const evento = await response.json();
    abrirModalEditar(evento);
  } catch (error) {
    alert('❌ Erro ao buscar evento');
  }
}

async function salvarEvento(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  
  const dados = {
    titulo: formData.get('titulo'),
    descricao: formData.get('descricao'),
    data_evento: formData.get('data_evento'),
    local: formData.get('local'),
    endereco: formData.get('endereco') || null,
    vagas: formData.get('vagas') ? parseInt(formData.get('vagas')) : null,
    imagem_url: formData.get('imagem_url') || null,
    organizador: formData.get('organizador') || null,
    destaque: formData.get('destaque') === 'on',
    status: formData.get('status') || 'rascunho'
  };
  
  try {
    const url = eventoEditando 
      ? `${API_URL}/eventos/${eventoEditando.id}`
      : `${API_URL}/eventos`;
    
    const method = eventoEditando ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    
    if (response.ok || response.status === 201) {
      alert(`✅ Evento ${eventoEditando ? 'atualizado' : 'criado'} com sucesso!`);
      fecharModal();
      carregarEventos();
      carregarEstatisticas();
    } else {
      const erro = await response.json();
      alert('❌ ' + (erro.message || erro.error));
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('❌ Erro ao salvar evento');
  }
}

async function deletarEvento(id) {
  const evt = eventos.find(e => e.id === id);
  if (!evt) return;
  
  if (!confirm(`Deseja realmente deletar o evento "${evt.titulo}"?\n\nEsta ação não pode ser desfeita!`)) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/eventos/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      alert('✅ Evento removido!');
      carregarEventos();
      carregarEstatisticas();
    } else {
      alert('❌ Erro ao deletar');
    }
  } catch (error) {
    alert('❌ Erro ao deletar evento');
  }
}

// UTILITÁRIOS
function mostrarErro(msg) {
  console.error('❌', msg);
  alert('❌ ' + msg);
}

console.log('✅ admin-eventos.js carregado!');
