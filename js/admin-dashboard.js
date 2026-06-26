// ===================================================================
// DASHBOARD - Casa do Caminho
// Atualiza valores dos cards com dados reais do backend
// ===================================================================

const API_URL = 'http://localhost:3000/api';

// ===================================================================
// CARREGAR DADOS INICIAIS
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Dashboard carregando...');
    carregarDashboard();
    
    // Atualizar a cada 30 segundos
    setInterval(carregarDashboard, 30000);
});

async function carregarDashboard() {
    try {
        await carregarEstatisticas();
        console.log('✅ Dashboard atualizado!');
    } catch (error) {
        console.error('❌ Erro ao carregar dashboard:', error);
    }
}

// ===================================================================
// ESTATÍSTICAS GERAIS
// ===================================================================

async function carregarEstatisticas() {
    try {
        console.log('📊 Buscando dados da API...');
        
        // Buscar dados de cada módulo em paralelo
        const [doacoes, projetos, voluntarios, eventos, depoimentos] = await Promise.all([
            fetch(`${API_URL}/doacoes`).then(r => r.json()).catch(err => {
                console.warn('Doações API falhou:', err);
                return {doacoes: []};
            }),
            fetch(`${API_URL}/projetos`).then(r => r.json()).catch(err => {
                console.warn('Projetos API falhou:', err);
                return {projetos: []};
            }),
            fetch(`${API_URL}/voluntarios/stats`).then(r => r.json()).catch(err => {
                console.warn('Voluntários API falhou:', err);
                return {total: 0, ativos: 0};
            }),
            fetch(`${API_URL}/eventos`).then(r => r.json()).catch(err => {
                console.warn('Eventos API falhou:', err);
                return {eventos: []};
            }),
            fetch(`${API_URL}/depoimentos`).then(r => r.json()).catch(err => {
                console.warn('Depoimentos API falhou:', err);
                return {depoimentos: []};
            })
        ]);

        console.log('📦 Dados recebidos:', {
            doacoes: doacoes.doacoes?.length || 0,
            projetos: projetos.projetos?.length || 0,
            voluntarios: voluntarios.ativos || 0,
            eventos: eventos.eventos?.length || 0,
            depoimentos: depoimentos.depoimentos?.length || 0
        });

        // ========== CALCULAR ESTATÍSTICAS ==========
        
        // 1. DOAÇÕES
        const totalDoacoes = (doacoes.doacoes || [])
            .reduce((sum, d) => sum + parseFloat(d.valor || 0), 0);
        
        const doacoesMes = calcularDoacoesMes(doacoes.doacoes || []);
        
        // 2. PROJETOS
        const projetosAtivos = (projetos.projetos || [])
            .filter(p => p.status === 'Ativo').length;
        
        // 3. VOLUNTÁRIOS
        const voluntariosAtivos = voluntarios.ativos || 0;
        
        // 4. EVENTOS PRÓXIMOS (30 dias)
        const eventosProximos = contarEventosProximos(eventos.eventos || []);
        
        // 5. DEPOIMENTOS
        const totalDepoimentos = (depoimentos.depoimentos || []).length;

        // ========== ATUALIZAR CARDS ==========
        
        atualizarCard('total-doacoes', formatarMoeda(totalDoacoes));
        atualizarCard('doacoes-mes', formatarMoeda(doacoesMes));
        atualizarCard('projetos-ativos', projetosAtivos);
        atualizarCard('voluntarios-ativos', voluntariosAtivos);
        atualizarCard('eventos-proximos', eventosProximos);
        atualizarCard('depoimentos-total', totalDepoimentos);

        console.log('✅ Cards atualizados com sucesso!');

    } catch (error) {
        console.error('❌ Erro ao carregar estatísticas:', error);
    }
}

function atualizarCard(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.textContent = valor;
        console.log(`  ✓ #${id} = ${valor}`);
    } else {
        console.warn(`  ⚠ Elemento #${id} não encontrado no HTML`);
    }
}

// ===================================================================
// FUNÇÕES DE CÁLCULO
// ===================================================================

function calcularDoacoesMes(doacoes) {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    
    return doacoes
        .filter(d => {
            const data = new Date(d.data_doacao || d.createdAt);
            return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
        })
        .reduce((sum, d) => sum + parseFloat(d.valor || 0), 0);
}

function contarEventosProximos(eventos) {
    const hoje = new Date();
    const proximos30dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return eventos.filter(e => {
        const dataEvento = new Date(e.data_evento);
        return dataEvento >= hoje && dataEvento <= proximos30dias;
    }).length;
}

// ===================================================================
// FORMATAÇÃO
// ===================================================================

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(valor || 0);
}

// ===================================================================
// EXPORTAR PARA DEBUG
// ===================================================================

window.dashboardFunctions = {
    carregarDashboard,
    carregarEstatisticas
};

console.log('✅ Dashboard JavaScript carregado e pronto!');
console.log('💡 Use window.dashboardFunctions.carregarDashboard() para atualizar manualmente');
