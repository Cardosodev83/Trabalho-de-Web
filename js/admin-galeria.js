// admin-galeria.js - VERSÃO CORRIGIDA

const API_URL = 'http://localhost:3000/api';

let imagens = [];
let imagemEditando = null;

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Admin Galeria carregado');
  carregarImagens();
  carregarEstatisticas();
  inicializarEventos();
});

// CARREGAR IMAGENS
async function carregarImagens() {
  try {
    console.log('📥 Buscando imagens...');
    const response = await fetch(`${API_URL}/galeria`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📦 Dados recebidos:', data);
    
    if (data.imagens) {
      imagens = data.imagens;
      console.log(`✅ ${imagens.length} imagens carregadas`);
      renderizarImagens();
      // FORÇAR atualização de estatísticas após carregar imagens
      carregarEstatisticas();
    }
  } catch (error) {
    console.error('❌ Erro ao carregar imagens:', error);
    mostrarErro('Erro ao conectar com o servidor');
  }
}

// RENDERIZAR GRID
function renderizarImagens() {
  const grid = document.getElementById('galeria-grid');
  
  if (!grid) {
    console.error('❌ Grid não encontrado!');
    return;
  }
  
  if (imagens.length === 0) {
    grid.innerHTML = `
      <div class="galeria-vazia">
        <span class="material-symbols-rounded">photo_library</span>
        <h3>📸 Nenhuma imagem na galeria</h3>
        <p>Adicione a primeira imagem!</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = imagens.map(img => `
    <div class="galeria-item" data-id="${img.id}">
      <div class="galeria-imagem">
        <img src="${img.imagem_url}" 
             alt="${img.titulo}" 
             loading="lazy"
             onerror="this.src='https://via.placeholder.com/400x300?text=Imagem+Indisponivel'">
        
        <div class="galeria-overlay">
          <div class="galeria-acoes">
            <button class="btn-icon" 
                    onclick="visualizarImagem(${img.id})"
                    aria-label="Visualizar ${img.titulo}">
              <span class="material-symbols-rounded">visibility</span>
            </button>
            <button class="btn-icon" 
                    onclick="editarImagem(${img.id})"
                    aria-label="Editar ${img.titulo}">
              <span class="material-symbols-rounded">edit</span>
            </button>
            <button class="btn-icon btn-danger" 
                    onclick="deletarImagem(${img.id})"
                    aria-label="Excluir ${img.titulo}">
              <span class="material-symbols-rounded">delete</span>
            </button>
          </div>
        </div>
        
        ${img.destaque ? '<span class="badge-destaque">⭐ Destaque</span>' : ''}
        ${img.status === 'inativo' ? '<span class="badge-inativo">Inativa</span>' : ''}
      </div>
      
      <div class="galeria-info">
        <h4>${img.titulo}</h4>
        <div class="galeria-meta">
          <span class="categoria">${traduzirCategoria(img.categoria)}</span>
          ${img.autor ? `<span class="autor">📷 ${img.autor}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');
  
  console.log(`✅ Grid renderizado com ${imagens.length} imagens`);
}

// TRADUZIR CATEGORIAS
function traduzirCategoria(categoria) {
  const traducoes = {
    'projetos': '📂 Projetos',
    'eventos': '🎉 Eventos',
    'voluntarios': '👥 Voluntários',
    'instalacoes': '🏢 Instalações',
    'geral': '📷 Geral'
  };
  return traducoes[categoria] || categoria;
}

// CARREGAR ESTATÍSTICAS - CORRIGIDO
async function carregarEstatisticas() {
  try {
    console.log('📊 Buscando estatísticas...');
    const response = await fetch(`${API_URL}/galeria/stats`);
    
    if (!response.ok) {
      console.warn('⚠️ Erro ao carregar stats, usando fallback');
      // Calcular localmente se API falhar
      calcularEstatisticasLocais();
      return;
    }
    
    const stats = await response.json();
    console.log('📈 Estatísticas da API:', stats);
    
    atualizarCards(stats);
  } catch (error) {
    console.error('❌ Erro ao carregar estatísticas:', error);
    // Fallback: calcular localmente
    calcularEstatisticasLocais();
  }
}

// CALCULAR ESTATÍSTICAS LOCALMENTE (fallback)
function calcularEstatisticasLocais() {
  const stats = {
    total: imagens.length,
    ativas: imagens.filter(img => img.status === 'ativo').length,
    destaques: imagens.filter(img => img.destaque && img.status === 'ativo').length
  };
  
  console.log('📊 Estatísticas locais:', stats);
  atualizarCards(stats);
}

// ATUALIZAR CARDS - CORRIGIDO
function atualizarCards(stats) {
  console.log('🔄 Atualizando cards com:', stats);
  
  // Atualizar cada card
  const updates = {
    'total-imagens': stats.total || 0,
    'imagens-ativas': stats.ativas || 0,
    'imagens-destaque': stats.destaques || 0
  };
  
  Object.entries(updates).forEach(([id, valor]) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.textContent = valor;
      console.log(`✅ Card #${id} = ${valor}`);
    } else {
      console.error(`❌ Elemento #${id} não encontrado!`);
    }
  });
}

// EVENTOS
function inicializarEventos() {
  const btnCriar = document.getElementById('btn-criar-imagem');
  if (btnCriar) btnCriar.addEventListener('click', abrirModalCriar);
  
  const btnFechar = document.getElementById('fechar-modal');
  if (btnFechar) btnFechar.addEventListener('click', fecharModal);
  
  const form = document.getElementById('form-galeria');
  if (form) form.addEventListener('submit', salvarImagem);
  
  // Preview da imagem
  const inputUrl = document.getElementById('imagem_url');
  if (inputUrl) {
    inputUrl.addEventListener('input', (e) => {
      mostrarPreview(e.target.value);
    });
  }
  
  // Filtro de categoria
  const filtroCategoria = document.getElementById('filtro-categoria');
  if (filtroCategoria) {
    filtroCategoria.addEventListener('change', (e) => {
      filtrarPorCategoria(e.target.value);
    });
  }
  
  // Busca
  const inputBusca = document.getElementById('busca-galeria');
  if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
      buscarImagens(e.target.value);
    });
  }
}

// PREVIEW DE IMAGEM
function mostrarPreview(url) {
  const preview = document.getElementById('preview-imagem');
  if (!preview) return;
  
  if (url && url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)) {
    preview.innerHTML = `<img src="${url}" alt="Preview" style="max-width: 100%; border-radius: 8px;">`;
  } else if (url && url.startsWith('http')) {
    preview.innerHTML = `<img src="${url}" alt="Preview" style="max-width: 100%; border-radius: 8px;" onerror="this.parentElement.innerHTML='<p style=color:#f44336>Erro ao carregar preview</p>'">`;
  } else if (url) {
    preview.innerHTML = '<p style="color: #999;">URL inválida</p>';
  } else {
    preview.innerHTML = '';
  }
}

// MODAL
function abrirModalCriar() {
  imagemEditando = null;
  document.getElementById('modal-titulo').textContent = 'Adicionar Imagem';
  document.getElementById('form-galeria').reset();
  const preview = document.getElementById('preview-imagem');
  if (preview) preview.innerHTML = '';
  document.getElementById('modal-galeria').classList.add('active');
}

function abrirModalEditar(imagem) {
  imagemEditando = imagem;
  document.getElementById('modal-titulo').textContent = 'Editar Imagem';
  
  document.getElementById('titulo').value = imagem.titulo;
  document.getElementById('descricao').value = imagem.descricao || '';
  document.getElementById('imagem_url').value = imagem.imagem_url;
  document.getElementById('categoria').value = imagem.categoria;
  document.getElementById('autor').value = imagem.autor || '';
  document.getElementById('ordem').value = imagem.ordem || 0;
  document.getElementById('destaque').checked = imagem.destaque;
  document.getElementById('status').value = imagem.status;
  
  mostrarPreview(imagem.imagem_url);
  
  document.getElementById('modal-galeria').classList.add('active');
}

function fecharModal() {
  document.getElementById('modal-galeria').classList.remove('active');
  imagemEditando = null;
}

// AÇÕES
async function visualizarImagem(id) {
  const img = imagens.find(i => i.id === id);
  if (!img) return;
  
  // Criar modal de visualização
  const modal = document.createElement('div');
  modal.className = 'modal-visualizar';
  modal.innerHTML = `
    <div class="modal-visualizar-content" style="position: relative; max-width: 90vw; max-height: 90vh; background: white; border-radius: 12px; overflow: hidden;">
      <button class="btn-fechar" onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10;">
        <span class="material-symbols-rounded">close</span>
      </button>
      <img src="${img.imagem_url}" alt="${img.titulo}" style="max-width: 100%; max-height: 70vh; display: block;">
      <div class="info" style="padding: 1.5rem;">
        <h2>${img.titulo}</h2>
        ${img.descricao ? `<p>${img.descricao}</p>` : ''}
        <div class="meta" style="margin-top: 1rem; display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.875rem; color: #666;">
          <span>${traduzirCategoria(img.categoria)}</span>
          ${img.autor ? `<span>📷 ${img.autor}</span>` : ''}
          ${img.destaque ? '<span style="color: #f39c12;">⭐ Destaque</span>' : ''}
        </div>
      </div>
    </div>
  `;
  
  modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 2rem;';
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
  
  document.body.appendChild(modal);
}

async function editarImagem(id) {
  try {
    const response = await fetch(`${API_URL}/galeria/${id}`);
    if (!response.ok) throw new Error('Não encontrada');
    
    const imagem = await response.json();
    abrirModalEditar(imagem);
  } catch (error) {
    alert('❌ Erro ao buscar imagem');
  }
}

async function salvarImagem(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  
  const dados = {
    titulo: formData.get('titulo'),
    descricao: formData.get('descricao') || null,
    imagem_url: formData.get('imagem_url'),
    categoria: formData.get('categoria') || 'geral',
    autor: formData.get('autor') || null,
    ordem: formData.get('ordem') ? parseInt(formData.get('ordem')) : 0,
    destaque: formData.get('destaque') === 'on',
    status: formData.get('status') || 'ativo'
  };
  
  console.log('💾 Salvando:', dados);
  
  try {
    const url = imagemEditando 
      ? `${API_URL}/galeria/${imagemEditando.id}`
      : `${API_URL}/galeria`;
    
    const method = imagemEditando ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    
    if (response.ok || response.status === 201) {
      alert(`✅ Imagem ${imagemEditando ? 'atualizada' : 'adicionada'} com sucesso!`);
      fecharModal();
      
      // FORÇAR recarregamento completo
      await carregarImagens();
      await carregarEstatisticas();
    } else {
      const erro = await response.json();
      alert('❌ ' + (erro.message || erro.error));
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('❌ Erro ao salvar imagem');
  }
}

async function deletarImagem(id) {
  const img = imagens.find(i => i.id === id);
  if (!img) return;
  
  if (!confirm(`Deseja realmente deletar "${img.titulo}"?\n\nEsta ação não pode ser desfeita!`)) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/galeria/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      alert('✅ Imagem removida!');
      
      // FORÇAR recarregamento completo
      await carregarImagens();
      await carregarEstatisticas();
    } else {
      alert('❌ Erro ao deletar');
    }
  } catch (error) {
    alert('❌ Erro ao deletar imagem');
  }
}

// FILTROS
function filtrarPorCategoria(categoria) {
  const grid = document.getElementById('galeria-grid');
  if (!grid) return;
  
  if (!categoria || categoria === '') {
    // Mostrar todas
    carregarImagens();
    return;
  }
  
  const imagensFiltradas = imagens.filter(img => img.categoria === categoria);
  
  if (imagensFiltradas.length === 0) {
    grid.innerHTML = `
      <div class="galeria-vazia">
        <span class="material-symbols-rounded">filter_alt_off</span>
        <h3>Nenhuma imagem nesta categoria</h3>
        <p>Categoria: ${traduzirCategoria(categoria)}</p>
      </div>
    `;
  } else {
    // Re-renderizar apenas filtradas
    const imagensTemp = imagens;
    imagens = imagensFiltradas;
    renderizarImagens();
    imagens = imagensTemp; // Restaurar
  }
}

function buscarImagens(termo) {
  if (!termo) {
    renderizarImagens();
    return;
  }
  
  const termoLower = termo.toLowerCase();
  const encontradas = imagens.filter(img => 
    img.titulo.toLowerCase().includes(termoLower) ||
    (img.descricao && img.descricao.toLowerCase().includes(termoLower)) ||
    img.categoria.toLowerCase().includes(termoLower)
  );
  
  const grid = document.getElementById('galeria-grid');
  if (!grid) return;
  
  if (encontradas.length === 0) {
    grid.innerHTML = `
      <div class="galeria-vazia">
        <span class="material-symbols-rounded">search_off</span>
        <h3>Nenhuma imagem encontrada</h3>
        <p>Busca: "${termo}"</p>
      </div>
    `;
  } else {
    // Temporariamente substituir para renderizar
    const temp = imagens;
    imagens = encontradas;
    renderizarImagens();
    imagens = temp;
  }
}

// UTILITÁRIOS
function mostrarErro(msg) {
  console.error('❌', msg);
  alert('❌ ' + msg);
}

console.log('✅ admin-galeria.js carregado e pronto!');
