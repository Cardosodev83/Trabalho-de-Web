// eventos.js - Página pública de eventos

const API_URL = 'http://localhost:3000/api';

let eventosPublicos = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Página de eventos carregada');
  carregarEventosPublicos();
});

// CARREGAR EVENTOS PÚBLICOS
async function carregarEventosPublicos() {
  try {
    const response = await fetch(`${API_URL}/eventos`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📦 Eventos recebidos:', data);
    
    if (data.eventos) {
      // Filtrar apenas eventos publicados
      eventosPublicos = data.eventos.filter(evento => evento.status === 'publicado');
      renderizarEventosPublicos();
    }
  } catch (error) {
    console.error('❌ Erro ao carregar eventos:', error);
    mostrarMensagemErro();
  }
}

// RENDERIZAR EVENTOS NA PÁGINA
function renderizarEventosPublicos() {
  const container = document.getElementById('eventos-container') || 
                   document.querySelector('.eventos-lista') ||
                   document.querySelector('.events-grid');
  
  if (!container) {
    console.error('❌ Container de eventos não encontrado!');
    return;
  }
  
  if (eventosPublicos.length === 0) {
    container.innerHTML = `
      <div class="no-events">
        <div class="no-events-content">
          <span class="material-symbols-rounded">event_note</span>
          <h3>Nenhum evento disponível no momento</h3>
          <p>Volte em breve para conferir nossos próximos eventos!</p>
        </div>
      </div>
    `;
    return;
  }
  
  // Separar eventos em próximos e em destaque
  const agora = new Date();
  const eventosProximos = eventosPublicos.filter(evt => new Date(evt.data_evento) >= agora);
  const eventosDestaque = eventosProximos.filter(evt => evt.destaque);
  
  let html = '';
  
  // Seção de destaques
  if (eventosDestaque.length > 0) {
    html += `
      <section class="eventos-destaque">
        <h2>✨ Eventos em Destaque</h2>
        <div class="eventos-grid">
          ${eventosDestaque.map(evento => criarCardEvento(evento, true)).join('')}
        </div>
      </section>
    `;
  }
  
  // Seção de próximos eventos
  html += `
    <section class="proximos-eventos">
      <h2>📅 Próximos Eventos</h2>
      <div class="eventos-grid">
        ${eventosProximos.map(evento => criarCardEvento(evento, false)).join('')}
      </div>
    </section>
  `;
  
  container.innerHTML = html;
  
  console.log(`✅ ${eventosPublicos.length} eventos públicos renderizados`);
}

// CRIAR CARD DE EVENTO
function criarCardEvento(evento, isDestaque = false) {
  const dataEvento = new Date(evento.data_evento);
  const dataFormatada = dataEvento.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const horaFormatada = dataEvento.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const vagasTexto = evento.vagas 
    ? `${evento.vagas - (evento.vagas_preenchidas || 0)} vagas restantes`
    : 'Vagas ilimitadas';
    
  const vagasDisponivel = !evento.vagas || (evento.vagas_preenchidas || 0) < evento.vagas;
  
  return `
    <article class="evento-card ${isDestaque ? 'evento-destaque' : ''}">
      ${evento.imagem_url ? `
        <div class="evento-imagem">
          <img src="${evento.imagem_url}" alt="${evento.titulo}" loading="lazy">
          ${isDestaque ? '<span class="badge-destaque">⭐ Destaque</span>' : ''}
        </div>
      ` : ''}
      
      <div class="evento-conteudo">
        <header class="evento-header">
          <h3>${evento.titulo}</h3>
          <div class="evento-data">
            <span class="data">📅 ${dataFormatada}</span>
            <span class="hora">🕐 ${horaFormatada}</span>
          </div>
        </header>
        
        <div class="evento-info">
          <p class="evento-descricao">${evento.descricao}</p>
          
          <div class="evento-detalhes">
            <div class="detalhe">
              <span class="material-symbols-rounded">location_on</span>
              <span>${evento.local}</span>
            </div>
            
            ${evento.endereco ? `
              <div class="detalhe endereco">
                <span class="material-symbols-rounded">map</span>
                <span>${evento.endereco}</span>
              </div>
            ` : ''}
            
            <div class="detalhe">
              <span class="material-symbols-rounded">group</span>
              <span>${vagasTexto}</span>
            </div>
            
            ${evento.organizador ? `
              <div class="detalhe">
                <span class="material-symbols-rounded">person</span>
                <span>Organizador: ${evento.organizador}</span>
              </div>
            ` : ''}
          </div>
        </div>
        
        <footer class="evento-footer">
          <button class="btn-inscrever ${vagasDisponivel ? 'btn-primary' : 'btn-disabled'}" 
                  onclick="inscreverEvento(${evento.id})"
                  ${!vagasDisponivel ? 'disabled' : ''}>
            <span class="material-symbols-rounded">
              ${vagasDisponivel ? 'event_available' : 'event_busy'}
            </span>
            ${vagasDisponivel ? 'Quero Participar' : 'Esgotado'}
          </button>
          
          <button class="btn-detalhes" onclick="verDetalhesEvento(${evento.id})">
            <span class="material-symbols-rounded">info</span>
            Mais Detalhes
          </button>
        </footer>
      </div>
    </article>
  `;
}

// INSCREVER NO EVENTO
async function inscreverEvento(eventoId) {
  const evento = eventosPublicos.find(e => e.id === eventoId);
  if (!evento) return;
  
  const confirmacao = confirm(`Deseja se inscrever no evento "${evento.titulo}"?\n\nVocê receberá mais informações por email.`);
  if (!confirmacao) return;
  
  try {
    // Aqui você pode implementar a lógica de inscrição
    // Por enquanto, vou simular incrementando vagas_preenchidas
    const response = await fetch(`${API_URL}/eventos/${eventoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...evento,
        vagas_preenchidas: (evento.vagas_preenchidas || 0) + 1
      })
    });
    
    if (response.ok) {
      alert(`✅ Inscrição realizada com sucesso!\n\nVocê está inscrito(a) no evento "${evento.titulo}".\n\nEm breve você receberá mais informações por email.`);
      
      // Recarregar eventos para atualizar vagas
      carregarEventosPublicos();
    } else {
      alert('❌ Erro ao realizar inscrição. Tente novamente.');
    }
  } catch (error) {
    console.error('❌ Erro na inscrição:', error);
    alert('❌ Erro ao realizar inscrição. Verifique sua conexão.');
  }
}

// VER DETALHES DO EVENTO
function verDetalhesEvento(eventoId) {
  const evento = eventosPublicos.find(e => e.id === eventoId);
  if (!evento) return;
  
  const dataEvento = new Date(evento.data_evento);
  const dataCompleta = dataEvento.toLocaleString('pt-BR');
  
  alert(`
📅 ${evento.titulo}

📝 DESCRIÇÃO:
${evento.descricao}

📍 LOCAL: ${evento.local}
${evento.endereco ? '📫 ENDEREÇO: ' + evento.endereco : ''}

🗓️ DATA E HORA: ${dataCompleta}

👥 VAGAS: ${evento.vagas ? (evento.vagas_preenchidas || 0) + '/' + evento.vagas + ' preenchidas' : 'Sem limite'}

${evento.organizador ? '👤 ORGANIZADOR: ' + evento.organizador : ''}

Para se inscrever, clique em "Quero Participar"!
  `);
}

// FILTRAR EVENTOS
function filtrarEventos(filtro) {
  const agora = new Date();
  let eventosFiltrados = eventosPublicos;
  
  switch (filtro) {
    case 'proximos':
      eventosFiltrados = eventosPublicos.filter(evt => new Date(evt.data_evento) >= agora);
      break;
    case 'destaque':
      eventosFiltrados = eventosPublicos.filter(evt => evt.destaque);
      break;
    case 'todos':
    default:
      eventosFiltrados = eventosPublicos;
      break;
  }
  
  // Re-renderizar com filtro aplicado
  const container = document.getElementById('eventos-container');
  if (container && eventosFiltrados.length === 0) {
    container.innerHTML = `
      <div class="no-events">
        <div class="no-events-content">
          <span class="material-symbols-rounded">search_off</span>
          <h3>Nenhum evento encontrado</h3>
          <p>Tente outro filtro ou volte mais tarde.</p>
        </div>
      </div>
    `;
  }
}

// BUSCAR EVENTOS
function buscarEventos(termo) {
  if (!termo) {
    renderizarEventosPublicos();
    return;
  }
  
  const termoLower = termo.toLowerCase();
  const eventosEncontrados = eventosPublicos.filter(evento => 
    evento.titulo.toLowerCase().includes(termoLower) ||
    evento.descricao.toLowerCase().includes(termoLower) ||
    evento.local.toLowerCase().includes(termoLower)
  );
  
  const container = document.getElementById('eventos-container');
  if (container) {
    if (eventosEncontrados.length === 0) {
      container.innerHTML = `
        <div class="no-events">
          <div class="no-events-content">
            <span class="material-symbols-rounded">search_off</span>
            <h3>Nenhum evento encontrado</h3>
            <p>Não encontramos eventos para "${termo}".</p>
            <button onclick="renderizarEventosPublicos()" class="btn-secondary">
              Ver todos os eventos
            </button>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <section class="resultados-busca">
          <h2>📍 Resultados para "${termo}" (${eventosEncontrados.length})</h2>
          <div class="eventos-grid">
            ${eventosEncontrados.map(evento => criarCardEvento(evento)).join('')}
          </div>
        </section>
      `;
    }
  }
}

// INICIALIZAR FILTROS E BUSCA
function inicializarFiltros() {
  const filtros = document.querySelectorAll('[data-filtro]');
  filtros.forEach(filtro => {
    filtro.addEventListener('click', (e) => {
      e.preventDefault();
      filtrarEventos(e.target.dataset.filtro);
    });
  });
  
  const campoBusca = document.querySelector('#busca-eventos') ||
                    document.querySelector('[data-busca="eventos"]');
  
  if (campoBusca) {
    campoBusca.addEventListener('input', (e) => {
      buscarEventos(e.target.value);
    });
  }
}

// MOSTRAR MENSAGEM DE ERRO
function mostrarMensagemErro() {
  const container = document.getElementById('eventos-container');
  if (container) {
    container.innerHTML = `
      <div class="error-message">
        <div class="error-content">
          <span class="material-symbols-rounded">error</span>
          <h3>Erro ao carregar eventos</h3>
          <p>Não foi possível carregar os eventos. Verifique sua conexão ou tente novamente.</p>
          <button onclick="carregarEventosPublicos()" class="btn-primary">
            Tentar Novamente
          </button>
        </div>
      </div>
    `;
  }
}

// Inicializar filtros quando página carrega
document.addEventListener('DOMContentLoaded', inicializarFiltros);

console.log('✅ eventos.js carregado e pronto!');
