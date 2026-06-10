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
    alert('Nenhuma doação encontrada. Redirecionando...');
    window.location.href = 'doar-agora.html';
    return;
  }

  dadosDoacao = JSON.parse(dados);
  exibirResumoDoacao();
}

function exibirResumoDoacao() {
  const container = document.getElementById('resumo-doacao');
  
  const tipoTexto = dadosDoacao.tipo === 'unica' ? 'Doação Única' : 'Doação Recorrente';
  const frequenciaTexto = dadosDoacao.tipo === 'recorrente' 
    ? `(${dadosDoacao.frequencia === 'mensal' ? 'Mensal' : 'Anual'})` 
    : '';

  container.innerHTML = `
    <div class="resumo-card">
      <h2 style="margin-bottom: 1.5rem; color: #2c5aa0;">Resumo da Doação</h2>
      
      <div class="resumo-item">
        <span class="resumo-label">Tipo:</span>
        <span class="resumo-valor">\${tipoTexto} \${frequenciaTexto}</span>
      </div>

      <div class="resumo-item">
        <span class="resumo-label">Valor:</span>
        <span class="resumo-valor destaque">R$ \${formatarValor(dadosDoacao.valor)}</span>
      </div>

      \${dadosDoacao.projeto ? `
        <div class="resumo-item">
          <span class="resumo-label">Projeto:</span>
          <span class="resumo-valor">\${dadosDoacao.projeto}</span>
        </div>
      ` : ''}

      <div class="resumo-item">
        <span class="resumo-label">Doador:</span>
        <span class="resumo-valor">\${dadosDoacao.nome}</span>
      </div>

      <div class="resumo-item">
        <span class="resumo-label">Email:</span>
        <span class="resumo-valor">\${dadosDoacao.email}</span>
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

  const formAtivo = document.getElementById(`form-\${metodo}`);
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
    const qrcodeImage = document.getElementById('qrcode-image');
    
    // Simular QR Code (em produção, viria da API)
    qrcodeImage.innerHTML = `
      <div style="width: 200px; height: 200px; margin: 0 auto; background: white; border: 2px solid #ddd; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 3rem;">📱</span>
      </div>
      <p style="margin-top: 1rem; color: #666; font-size: 0.875rem;">
        Código PIX: <strong>00020126...9999</strong>
      </p>
    `;
    
    qrcodeContainer.style.display = 'block';
    btn.style.display = 'none';

    // Em produção, registrar a doação
    console.log('Doação PIX iniciada:', dadosDoacao);
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
    
    // Salvar ID da doação e redirecionar
    localStorage.setItem('doacaoId', 'DOA-' + Date.now());
    window.location.href = 'confirmacao.html';
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