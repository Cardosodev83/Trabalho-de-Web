// js/projetos.js

// Mapeamento de imagens para cada projeto
const imagensProjetos = {
  'Sopa Solidária': 'https://t3.ftcdn.net/jpg/03/14/36/26/240_F_314362650_R5nJPIJP2IwYxrMLhWKfxB7JrNd0ji91.jpg',
  'Bazar Beneficente': 'https://t3.ftcdn.net/jpg/02/48/62/24/240_F_248622442_Z5O6VvZNKo5XyE4VFS5vSwZKDFdrJ1pi.jpg',
  'Cesta Básica': 'https://t3.ftcdn.net/jpg/18/63/89/66/240_F_1863896664_yDK4Lh2l36u2avpYibMh88JLIj48bSoy.jpg',
  'Creche Comunitária': 'https://t4.ftcdn.net/jpg/04/42/33/63/240_F_442336399_EGEEc7YKuNnnclU368Q2uWeEB9en2XvT.jpg',
  'Pão Fraterno': 'https://t4.ftcdn.net/jpg/09/22/15/59/240_F_922155983_OqTCYQEjFWrQqBLh1miUe4CTShS9wvbt.jpg',
  'Enxoval Solidário': 'https://t4.ftcdn.net/jpg/00/46/35/53/240_F_46355304_HuerwsBU6SxQJrS5nHqdWtXh0AysAhRH.jpg'
};

// Mapeamento de nome do projeto → página HTML correspondente
const paginasProjetos = {
  'Sopa Solidária': 'sopa-solidaria.html',
  'Bazar Beneficente': 'bazar-beneficiente.html',
  'Cesta Básica': 'cesta-basica.html',
  'Creche Comunitária': 'creche-comunitaria.html',
  'Pão Fraterno': 'pao-fraterno.html',
  'Enxoval Solidário': 'enxoval.html'
};

// Função para renderizar cards de projetos
function renderizarProjetos(projetos) {
  const container = document.getElementById('projetos-container');
  
  if (!container) {
    console.error('Container de projetos não encontrado');
    return;
  }

  // Limpar container
  container.innerHTML = '';

  // Se não tiver projetos
  if (projetos.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: #999;">
        <p>Nenhum projeto encontrado no momento.</p>
      </div>
    `;
    return;
  }

  // Renderizar cada projeto
  projetos.forEach(projeto => {
    const card = criarCardProjeto(projeto);
    container.appendChild(card);
  });
}

// Função para criar card de um projeto
function criarCardProjeto(projeto) {
  const article = document.createElement('article');
  article.className = 'project-card';
  
  // Calcular porcentagem arrecadada
  const porcentagem = projeto.meta_financeira > 0 
    ? (projeto.arrecadado_atual / projeto.meta_financeira * 100).toFixed(0)
    : 0;

  // Pegar URL da imagem do mapeamento
  const imagemUrl = imagensProjetos[projeto.nome] || 'https://via.placeholder.com/400x200/2c5aa0/ffffff?text=Projeto';

  // Pegar página HTML correspondente
  const paginaProjeto = paginasProjetos[projeto.nome] || 'projetos.html';

  article.innerHTML = `
    <div class="project-image">
      <img src="${imagemUrl}" alt="${projeto.nome}">
      ${porcentagem >= 50 ? '<span class="project-badge">Destaque</span>' : ''}
    </div>
    
    <div class="project-content">
      <h3 class="project-title">${projeto.nome}</h3>
      
      <p class="project-description">
        ${projeto.descricao}
      </p>
      
      <div class="project-meta">
        <span class="meta-item">
          <span class="material-symbols-rounded">people</span>
          ${projeto.beneficiarios_atendidos} beneficiários
        </span>
        <span class="meta-item">
          <span class="material-symbols-rounded">attach_money</span>
          R$ ${parseFloat(projeto.arrecadado_atual).toLocaleString('pt-BR')}
        </span>
      </div>

      <div class="projeto-progresso" style="margin: 1rem 0;">
        <div class="progresso-barra" style="height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden;">
          <div class="progresso-fill" style="height: 100%; width: ${porcentagem}%; background: linear-gradient(90deg, #4CAF50, #8BC34A); transition: width 0.3s;"></div>
        </div>
        <span style="font-size: 0.85rem; color: #666; margin-top: 0.5rem; display: block;">
          ${porcentagem}% da meta de R$ ${parseFloat(projeto.meta_financeira).toLocaleString('pt-BR')}
        </span>
      </div>
      
      <a href="${paginaProjeto}" class="btn btn-secondary">Saiba Mais</a>
    </div>
  `;

  return article;
}

// Função para carregar projetos da API
async function carregarProjetos() {
  // Mostrar loading
  const container = document.getElementById('projetos-container');
  if (container) {
    container.innerHTML = '<div style="text-align: center; padding: 3rem; color: #666;">Carregando projetos...</div>';
  }

  // Buscar projetos da API
  const projetos = await api.getProjetos();
  
  // Renderizar
  renderizarProjetos(projetos);
}

// Executar quando página carregar
document.addEventListener('DOMContentLoaded', carregarProjetos);
