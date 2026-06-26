// pagamento.js - Lógica da página de pagamento

// Dados da doação vindos da página anterior
let dadosDoacao = {};

// Carregar dados da doação do localStorage
document.addEventListener('DOMContentLoaded', function() {
  carregarDadosDoacao();
  inicializarEventos();
});

function carregarDadosDoacao() {
  const dados = localStorage.getItem('dadosDoacao');
  
  if (!dados) {
    // Se não tiver dados, usar valores de demonstração
    console.log('Nenhuma doação encontrada no localStorage. Usando dados de demonstração.');
    dadosDoacao = {
      valor: 100,
      nome: 'Doador',
      email: 'doador@email.com',
      tipo: 'unica',
      projeto: 'geral',
      projetoNome: 'Doação Geral - Casa do Caminho'
    };
  } else {
    dadosDoacao = JSON.parse(dados);
  }
  
  exibirResumoDoacao();
}

function exibirResumoDoacao() {
  const container = document.getElementById('resumo-doacao');
  
  const tipoTexto = dadosDoacao.tipo === 'unica' ? 'Doação Única' : 'Doação Recorrente';
  const frequenciaTexto = dadosDoacao.tipo === 'recorrente' 
    ? `(${dadosDoacao.frequencia === 'mensal' ? 'Mensal' : 'Anual'})` 
    : '';

  container.innerHTML = `
    <div style="background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
      <h2 style="margin-bottom: 1.5rem; color: var(--primary); font-family: var(--font-display); font-size: var(--text-h3); text-align: center;">
        <span class="material-symbols-rounded" style="vertical-align: middle; margin-right: 0.5rem;">receipt_long</span>
        Resumo da Doação
      </h2>
      
      <div style="display: grid; gap: 1rem;">
        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #e0e0e0;">
          <span style="font-weight: 600; color: #666;">Tipo:</span>
          <span style="color: #333;">${tipoTexto} ${frequenciaTexto}</span>
        </div>

        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #e0e0e0;">
          <span style="font-weight: 600; color: #666;">Valor:</span>
          <span style="font-size: 1.5rem; font-weight: 700; color: var(--tertiary);">R$ ${formatarValor(dadosDoacao.valor)}</span>
        </div>

        ${dadosDoacao.projetoNome && dadosDoacao.projetoNome !== 'Doação Geral - Casa do Caminho' ? `
          <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #e0e0e0;">
            <span style="font-weight: 600; color: #666;">Projeto:</span>
            <span style="color: #333;">${dadosDoacao.projetoNome}</span>
          </div>
        ` : ''}

        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #e0e0e0;">
          <span style="font-weight: 600; color: #666;">Doador:</span>
          <span style="color: #333;">${dadosDoacao.nome}</span>
        </div>

        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0;">
          <span style="font-weight: 600; color: #666;">Email:</span>
          <span style="color: #333;">${dadosDoacao.email}</span>
        </div>
      </div>
      
      <div style="margin-top: 1.5rem; padding: 1rem; background: #e8f5e9; border-radius: 8px; text-align: center;">
        <p style="margin: 0; color: #2e7d32; font-size: 0.875rem;">
          <span class="material-symbols-rounded" style="vertical-align: middle; margin-right: 0.5rem; font-size: 1rem;">verified</span>
          <strong>Transação 100% segura e protegida</strong>
        </p>
      </div>
    </div>
  `;
}

function formatarValor(valor) {
  return parseFloat(valor).toFixed(2).replace('.', ',');
}

function inicializarEventos() {
  // Botões de seleção de método de pagamento
  const btnMetodos = document.querySelectorAll('.metodo-pagamento-btn');
  btnMetodos.forEach(btn => {
    btn.addEventListener('click', function() {
      selecionarMetodoPagamento(this.dataset.metodo);
    });
  });

  // Botão PIX
  const btnPagarPix = document.getElementById('btn-pagar-pix');
  if (btnPagarPix) {
    btnPagarPix.addEventListener('click', gerarQRCodePix);
  }

  // Botão copiar PIX
  const btnCopiarPix = document.getElementById('btn-copiar-pix');
  if (btnCopiarPix) {
    btnCopiarPix.addEventListener('click', copiarCodigoPix);
  }

  // Formulário de cartão
  const formCartao = document.getElementById('form-cartao');
  if (formCartao) {
    formCartao.addEventListener('submit', processarPagamentoCartao);
  }

  // Botão gerar boleto
  const btnGerarBoleto = document.getElementById('btn-gerar-boleto');
  if (btnGerarBoleto) {
    btnGerarBoleto.addEventListener('click', gerarBoleto);
  }

  // Máscaras de input
  aplicarMascaras();
}

function selecionarMetodoPagamento(metodo) {
  // Atualizar botões
  const btnMetodos = document.querySelectorAll('.metodo-pagamento-btn');
  btnMetodos.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.metodo === metodo) {
      btn.classList.add('active');
    }
  });

  // Mostrar formulário correspondente
  const forms = document.querySelectorAll('.form-pagamento');
  forms.forEach(form => {
    form.style.display = 'none';
    form.classList.remove('active');
  });

  const formAtivo = document.getElementById(`form-${metodo}`);
  if (formAtivo) {
    formAtivo.style.display = 'block';
    formAtivo.classList.add('active');
  }
}

function gerarQRCodePix() {
  const btn = document.getElementById('btn-pagar-pix');
  btn.disabled = true;
  btn.innerHTML = '<span class="material-symbols-rounded">hourglass_empty</span> Gerando...';

  // Simular chamada à API
  setTimeout(() => {
    const qrcodeContainer = document.getElementById('qrcode-container');
    qrcodeContainer.style.display = 'block';
    btn.style.display = 'none';

    // Em produção, registrar a doação
    console.log('Doação PIX iniciada:', dadosDoacao);
    
    // Mostrar mensagem de sucesso
    mostrarMensagem('QR Code gerado com sucesso! Escaneie para pagar.', 'sucesso');
  }, 1500);
}

function copiarCodigoPix() {
  const codigoPix = '00020126580014br.gov.bcb.pix...9999'; // Código fictício
  
  navigator.clipboard.writeText(codigoPix).then(() => {
    const btn = document.getElementById('btn-copiar-pix');
    const textoOriginal = btn.innerHTML;
    btn.innerHTML = '<span class="material-symbols-rounded">check</span> Copiado!';
    btn.style.background = '#4caf50';
    
    setTimeout(() => {
      btn.innerHTML = textoOriginal;
      btn.style.background = '';
    }, 2000);
  });
}

function processarPagamentoCartao(e) {
  e.preventDefault();

  const btnSubmit = e.target.querySelector('button[type="submit"]');
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<span class="material-symbols-rounded">hourglass_empty</span> Processando...';

  // Coletar dados do formulário
  const dadosCartao = {
    numero: document.getElementById('numero-cartao').value,
    validade: document.getElementById('validade-cartao').value,
    cvv: document.getElementById('cvv-cartao').value,
    nome: document.getElementById('nome-cartao').value,
    cpf: document.getElementById('cpf-cartao').value
  };

  // Simular processamento (em produção, chamar API)
  setTimeout(() => {
    console.log('Pagamento processado:', { ...dadosDoacao, ...dadosCartao });
    
    // Mostrar mensagem de sucesso
    mostrarMensagem('Pagamento aprovado! Obrigado pela sua doação! ❤️', 'sucesso');
    
    // Redirecionar após 2 segundos
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  }, 2000);
}

function gerarBoleto() {
  const btn = document.getElementById('btn-gerar-boleto');
  btn.disabled = true;
  btn.innerHTML = '<span class="material-symbols-rounded">hourglass_empty</span> Gerando...';

  // Simular geração de boleto
  setTimeout(() => {
    const codigoBarras = '34191.79001 01043.510047 91020.150008 1 84560000012345';
    document.getElementById('codigo-barras').textContent = codigoBarras;
    document.getElementById('boleto-gerado').style.display = 'block';
    btn.style.display = 'none';

    mostrarMensagem('Boleto gerado com sucesso! Enviado para seu email.', 'sucesso');

    // Botão de download
    const btnBaixar = document.getElementById('btn-baixar-boleto');
    btnBaixar.addEventListener('click', function() {
      alert('Em produção, o boleto PDF seria baixado aqui.');
      console.log('Boleto gerado para:', dadosDoacao);
    });
  }, 1500);
}

function aplicarMascaras() {
  // Máscara de cartão de crédito
  const inputNumeroCartao = document.getElementById('numero-cartao');
  if (inputNumeroCartao) {
    inputNumeroCartao.addEventListener('input', function(e) {
      let valor = e.target.value.replace(/\s/g, '');
      let valorFormatado = valor.match(/.{1,4}/g)?.join(' ') || valor;
      e.target.value = valorFormatado;
    });
  }

  // Máscara de validade
  const inputValidade = document.getElementById('validade-cartao');
  if (inputValidade) {
    inputValidade.addEventListener('input', function(e) {
      let valor = e.target.value.replace(/\D/g, '');
      if (valor.length >= 2) {
        valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
      }
      e.target.value = valor;
    });
  }

  // Máscara de CVV
  const inputCvv = document.getElementById('cvv-cartao');
  if (inputCvv) {
    inputCvv.addEventListener('input', function(e) {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  }

  // Máscara de CPF
  const inputCpf = document.getElementById('cpf-cartao');
  if (inputCpf) {
    inputCpf.addEventListener('input', function(e) {
      let valor = e.target.value.replace(/\D/g, '');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      e.target.value = valor;
    });
  }
}

function mostrarMensagem(texto, tipo) {
  // Remover mensagens anteriores
  const msgAnterior = document.querySelector('.alert-mensagem');
  if (msgAnterior) msgAnterior.remove();

  const cor = tipo === 'sucesso' ? '#d1fae5' : '#fee2e2';
  const corTexto = tipo === 'sucesso' ? '#065f46' : '#991b1b';
  const corBorda = tipo === 'sucesso' ? '#6ee7b7' : '#fca5a5';
  const icone = tipo === 'sucesso' ? 'check_circle' : 'error';

  const div = document.createElement('div');
  div.className = 'alert-mensagem';
  div.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    z-index: 9999;
    background: ${cor};
    color: ${corTexto};
    border: 2px solid ${corBorda};
    border-radius: 12px;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideInRight 0.3s ease;
  `;
  
  div.innerHTML = `
    <span class="material-symbols-rounded" style="font-size: 1.5rem;">${icone}</span>
    <p style="margin: 0; font-weight: 600;">${texto}</p>
  `;
  
  document.body.appendChild(div);
  
  setTimeout(() => {
    div.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => div.remove(), 300);
  }, 5000);
}

// CSS das animações
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }
`;
document.head.appendChild(style);
