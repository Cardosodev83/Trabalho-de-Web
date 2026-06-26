// js/doar.js

// Elementos do formulário
let formDoacao;
let selectProjeto;
let valorButtons;
let inputValorCustom;
let inputValorFinal;

// Inicializar quando página carregar
document.addEventListener('DOMContentLoaded', () => {
  // Pegar elementos do DOM
  formDoacao = document.getElementById('form-doacao');
  selectProjeto = document.getElementById('select-projeto');
  valorButtons = document.querySelectorAll('.valor-btn');
  inputValorCustom = document.getElementById('valor-custom');
  inputValorFinal = document.getElementById('valor-final');

  // Carregar projetos no dropdown
  carregarProjetos();

  // Configurar botões de valor
  configurarBotoesValor();

  // Configurar envio do formulário
  if (formDoacao) {
    formDoacao.addEventListener('submit', handleSubmit);
  }

  // Pegar projeto da URL (se vier de "Doar Agora" de um projeto específico)
  const urlParams = new URLSearchParams(window.location.search);
  const projetoId = urlParams.get('projeto');
  if (projetoId && selectProjeto) {
    selectProjeto.value = projetoId;
  }
});

// Carregar projetos da API para o dropdown
async function carregarProjetos() {
  if (!selectProjeto) return;

  try {
    const projetos = await api.getProjetos();

    // Limpar opções existentes
    selectProjeto.innerHTML = '<option value="">Selecione um projeto (opcional)</option>';
    selectProjeto.innerHTML += '<option value="geral">Doação Geral - Casa do Caminho</option>';

    // Adicionar cada projeto como opção
    projetos.forEach(projeto => {
      const option = document.createElement('option');
      option.value = projeto.id;
      option.textContent = `${projeto.nome} - Meta: R$ ${parseFloat(projeto.meta_financeira).toLocaleString('pt-BR')}`;
      selectProjeto.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar projetos:', error);
  }
}

// Configurar botões de valor pré-definido
function configurarBotoesValor() {
  if (!valorButtons || !inputValorFinal) return;

  valorButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      // Remover classe 'active' de todos
      valorButtons.forEach(b => b.classList.remove('active'));

      // Adicionar classe 'active' no clicado
      btn.classList.add('active');

      // Pegar valor do botão
      const valor = btn.dataset.valor;

      // Atualizar input hidden
      inputValorFinal.value = valor;

      // Limpar valor customizado
      if (inputValorCustom) {
        inputValorCustom.value = '';
      }
    });
  });

  // Input de valor customizado
  if (inputValorCustom) {
    inputValorCustom.addEventListener('input', () => {
      // Remover classe 'active' de todos os botões
      valorButtons.forEach(b => b.classList.remove('active'));

      // Atualizar valor final
      inputValorFinal.value = inputValorCustom.value;
    });
  }
}

// Lidar com envio do formulário
async function handleSubmit(e) {
  e.preventDefault();

  // Pegar dados do formulário
  const formData = new FormData(formDoacao);

  const doacao = {
    valor: parseFloat(formData.get('valor')),
    doador_nome: formData.get('nome'),
    doador_email: formData.get('email'),
    doador_cpf: formData.get('cpf')?.replace(/\D/g, ''), // Remove formatação
    tipo: formData.get('tipo') || 'unica'
  };

  // Projeto (se selecionado)
  const projetoSelecionado = formData.get('projeto');
  if (projetoSelecionado && projetoSelecionado !== 'geral' && projetoSelecionado !== '') {
    doacao.projeto_id = parseInt(projetoSelecionado);
  }

  // Validações
  if (!doacao.valor || doacao.valor <= 0) {
    mostrarErro('Por favor, selecione ou digite um valor para doar.');
    return;
  }

  if (!doacao.doador_nome || !doacao.doador_email) {
    mostrarErro('Por favor, preencha seu nome e email.');
    return;
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(doacao.doador_email)) {
    mostrarErro('Por favor, digite um email válido.');
    return;
  }

  // Desabilitar botão submit
  const btnSubmit = formDoacao.querySelector('button[type="submit"]');
  const textoOriginal = btnSubmit.textContent;
  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Processando...';

  try {
    // Enviar para API
    const resultado = await api.criarDoacao(doacao);

    if (resultado.success) {
      // Sucesso!
      mostrarSucesso('Doação registrada! Redirecionando para pagamento... ❤️');

      // ✅ CORRIGIDO: Salvar dados com a chave 'dadosDoacao' para página de pagamento
      const dadosParaPagamento = {
        valor: doacao.valor,
        nome: doacao.doador_nome,
        email: doacao.doador_email,
        cpf: doacao.doador_cpf,
        tipo: doacao.tipo,
        projeto: projetoSelecionado || 'geral',
        projetoNome: selectProjeto.options[selectProjeto.selectedIndex].text,
        doacaoId: resultado.data?.id // ID retornado pela API
      };

      // Se for doação recorrente, adicionar frequência
      if (doacao.tipo === 'recorrente') {
        dadosParaPagamento.frequencia = formData.get('frequencia') || 'mensal';
      }

      // Salvar no localStorage
      localStorage.setItem('dadosDoacao', JSON.stringify(dadosParaPagamento));

      // Aguardar 1.5 segundos e redirecionar
      setTimeout(() => {
        window.location.href = 'pagamento.html';
      }, 1500);
    } else {
      mostrarErro(resultado.message || 'Erro ao processar doação. Tente novamente.');
      btnSubmit.disabled = false;
      btnSubmit.textContent = textoOriginal;
    }
  } catch (error) {
    console.error('Erro ao enviar doação:', error);
    mostrarErro('Erro ao processar doação. Verifique sua conexão e tente novamente.');
    btnSubmit.disabled = false;
    btnSubmit.textContent = textoOriginal;
  }
}

// Mostrar mensagem de erro
function mostrarErro(mensagem) {
  // Remover mensagem anterior
  const msgAnterior = document.querySelector('.mensagem-feedback');
  if (msgAnterior) msgAnterior.remove();

  // Criar elemento de mensagem
  const msgDiv = document.createElement('div');
  msgDiv.className = 'mensagem-feedback mensagem-erro';
  msgDiv.innerHTML = `
    <p>⚠️ ${mensagem}</p>
  `;

  // Inserir no topo do formulário
  formDoacao.insertBefore(msgDiv, formDoacao.firstChild);

  // Scroll suave até a mensagem
  msgDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Remover após 5 segundos
  setTimeout(() => msgDiv.remove(), 5000);
}

// Mostrar mensagem de sucesso
function mostrarSucesso(mensagem) {
  // Remover mensagem anterior
  const msgAnterior = document.querySelector('.mensagem-feedback');
  if (msgAnterior) msgAnterior.remove();

  // Criar elemento de mensagem
  const msgDiv = document.createElement('div');
  msgDiv.className = 'mensagem-feedback mensagem-sucesso';
  msgDiv.innerHTML = `
    <p>✅ ${mensagem}</p>
  `;

  // Inserir no topo do formulário
  formDoacao.insertBefore(msgDiv, formDoacao.firstChild);

  // Scroll suave até a mensagem
  msgDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
