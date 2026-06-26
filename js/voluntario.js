// voluntario.js - VERSÃO CORRIGIDA para corresponder ao MODEL

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    
    if (!form) {
        console.error('❌ Formulário não encontrado!');
        return;
    }
    
    console.log('✅ Formulário de voluntários carregado');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('📝 Enviando inscrição de voluntário...');
        
        // Pegar valores do formulário
        const nome = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('phone').value;
        const idade = parseInt(document.getElementById('age').value);
        const area = document.getElementById('area').value;
        const disponibilidade = document.getElementById('availability').value;
        const experiencia = document.getElementById('experience').value || '';
        const motivacao = document.getElementById('motivation').value || '';
        
        // Calcular data_nascimento aproximada a partir da idade
        const anoAtual = new Date().getFullYear();
        const anoNascimento = anoAtual - idade;
        const data_nascimento = `${anoNascimento}-01-01`; // Data aproximada
        
        // Montar areas_interesse como JSON array (o model espera TEXT com JSON)
        const areas_interesse = JSON.stringify([area]);
        
        // Montar observacoes (juntando experiência e motivação)
        const observacoes = `MOTIVAÇÃO: ${motivacao}${experiencia ? `\n\nEXPERIÊNCIA/HABILIDADES: ${experiencia}` : ''}`;
        
        // Objeto que corresponde EXATAMENTE ao MODEL do backend
        const formData = {
            nome: nome,
            email: email,
            telefone: telefone,
            cpf: null,  // Formulário não pede CPF
            data_nascimento: data_nascimento,
            areas_interesse: areas_interesse,  // JSON string: ["sopa"]
            disponibilidade: disponibilidade,
            status: 'ativo',  // Sempre ativo ao se inscrever
            observacoes: observacoes
        };
        
        console.log('📦 Dados preparados:', formData);
        
        // Desabilitar botão enquanto envia
        const btnSubmit = form.querySelector('button[type="submit"]');
        const btnTextoOriginal = btnSubmit.innerHTML;
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span class="material-symbols-rounded">hourglass_empty</span> Enviando...';
        
        try {
            const response = await fetch('http://localhost:3000/api/voluntarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            console.log('📥 Resposta do servidor:', response.status);
            
            if (response.ok || response.status === 201) {
                const data = await response.json();
                console.log('✅ Voluntário cadastrado:', data);
                
                // Mensagem de sucesso
                mostrarMensagem('success', '🎉 Inscrição enviada com sucesso! Em breve entraremos em contato pelo email ou telefone informado.');
                
                // Limpar formulário
                form.reset();
                
                // Rolar para o topo suavemente
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
            } else {
                const erro = await response.json();
                console.error('❌ Erro do servidor:', erro);
                
                let mensagemErro = 'Erro ao enviar inscrição.';
                
                // Tratar erro de email duplicado
                if (erro.message && erro.message.includes('email')) {
                    mensagemErro = 'Este email já está cadastrado. Se você já se inscreveu antes, entraremos em contato em breve!';
                } else if (erro.error) {
                    mensagemErro = erro.error;
                } else if (erro.message) {
                    mensagemErro = erro.message;
                }
                
                mostrarMensagem('error', '❌ ' + mensagemErro);
            }
            
        } catch (error) {
            console.error('❌ Erro de conexão:', error);
            mostrarMensagem('error', '❌ Erro ao conectar com o servidor. Por favor, tente novamente mais tarde ou entre em contato por telefone.');
        } finally {
            // Reabilitar botão
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = btnTextoOriginal;
        }
    });
});

/**
 * Mostra mensagem de feedback para o usuário
 */
function mostrarMensagem(tipo, texto) {
    // Remover mensagem anterior se existir
    const msgAnterior = document.querySelector('.form-message');
    if (msgAnterior) {
        msgAnterior.remove();
    }
    
    // Criar nova mensagem
    const mensagem = document.createElement('div');
    mensagem.className = `form-message form-message-${tipo}`;
    mensagem.innerHTML = texto;
    mensagem.setAttribute('role', tipo === 'error' ? 'alert' : 'status');
    mensagem.setAttribute('aria-live', 'polite');
    
    // Estilos
    const styles = {
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        borderRadius: '8px',
        fontWeight: '500',
        fontSize: '1rem',
        lineHeight: '1.5',
        animation: 'slideDown 0.3s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    };
    
    if (tipo === 'success') {
        Object.assign(styles, {
            background: '#d4edda',
            color: '#155724',
            border: '2px solid #c3e6cb'
        });
    } else {
        Object.assign(styles, {
            background: '#f8d7da',
            color: '#721c24',
            border: '2px solid #f5c6cb'
        });
    }
    
    Object.assign(mensagem.style, styles);
    
    // Inserir antes do formulário
    const form = document.querySelector('.contact-form');
    form.parentNode.insertBefore(mensagem, form);
    
    // Focar na mensagem para leitores de tela
    mensagem.setAttribute('tabindex', '-1');
    mensagem.focus();
    
    // Remover após 8 segundos
    setTimeout(() => {
        mensagem.style.opacity = '0';
        mensagem.style.transition = 'opacity 0.5s';
        setTimeout(() => mensagem.remove(), 500);
    }, 8000);
}

// Adicionar animação CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

console.log('✅ voluntario.js carregado e pronto!');
