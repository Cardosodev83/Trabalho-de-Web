# 🏠 Casa do Caminho - Sistema de Gestão

Sistema completo de gestão para instituição sem fins lucrativos, desenvolvido com foco em transparência, impacto social e facilidade de uso.



## 🚀 Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Sequelize ORM** - Mapeamento objeto-relacional
- **PostgreSQL** - Banco de dados relacional
- **Nodemon** - Desenvolvimento com auto-restart

### Frontend
- **HTML5/CSS3** - Estrutura e estilos
- **JavaScript (Vanilla)** - Interatividade
- **Design Responsivo** - Mobile-first
- **Material Icons** - Ícones do Google

## ✨ Funcionalidades

### 📊 Dashboard Administrativo
- Estatísticas em tempo real
- Gráfico de doações dos últimos 6 meses
- Projetos em destaque com progresso visual
- Timeline de atividades recentes
- Auto-atualização a cada 30 segundos

### 💰 Gestão de Doações
- CRUD completo
- Formulário público de doação
- Seleção de projetos específicos
- Valores sugeridos (R$ 50, R$ 100, R$ 200, R$ 500)
- Doações recorrentes (única ou mensal)
- Integração com meios de pagamento:
  - PIX (QR Code dinâmico)
  - Cartão de Crédito
  - Boleto Bancário
- Página de resumo e confirmação

### 📁 Gestão de Projetos
- CRUD completo
- Upload de imagens
- Metas financeiras
- Acompanhamento de progresso
- Listagem pública com filtros
- Cards com informações detalhadas

### 🤝 Gestão de Voluntários
- CRUD completo
- Formulário público de inscrição
- Áreas de interesse (múltipla escolha)
- Disponibilidade por dia da semana
- Status: Pendente, Ativo, Inativo
- Dashboard com estatísticas

### 📅 Gestão de Eventos
- CRUD completo
- Data e horário do evento
- Local e tipo (Arrecadação, Social, Ambos)
- Controle de vagas limitadas
- Listagem pública
- Calendário visual

### 💬 Gestão de Depoimentos
- CRUD completo
- Sistema de aprovação/rejeição
- Exibição pública apenas aprovados
- Moderação de conteúdo

### 📷 Galeria de Fotos
- CRUD completo
- Upload de imagens
- Título e descrição
- Grid responsivo
- Modal de visualização
- Carregamento otimizado

## 🗂️ Estrutura do Projeto

```
Casa do Caminho/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuração do banco
│   ├── controllers/
│   │   ├── doacaoController.js
│   │   ├── projetoController.js
│   │   ├── voluntarioController.js
│   │   ├── eventoController.js
│   │   ├── depoimentoController.js
│   │   └── galeriaController.js
│   ├── models/
│   │   ├── index.js
│   │   ├── doacao.js
│   │   ├── projeto.js
│   │   ├── voluntarios.js
│   │   ├── evento.js
│   │   ├── depoimento.js
│   │   └── galeria.js
│   ├── routes/
│   │   ├── doacaoRoutes.js
│   │   ├── projetoRoutes.js
│   │   ├── voluntarioRoutes.js
│   │   ├── eventoRoutes.js
│   │   ├── depoimentoRoutes.js
│   │   └── galeriaRoutes.js
│   ├── migrations/
│   │   ├── create-projeto.js
│   │   ├── create-doacao.js
│   │   ├── create-voluntario.js
│   │   ├── create-evento.js
│   │   ├── create-depoimento.js
│   │   └── create-galeria.js
│   ├── .env                     # Variáveis de ambiente
│   ├── package.json
│   └── server.js                # Servidor Express
│
├── css/
│   ├── reset.css               # Reset CSS
│   ├── design-tokens.css       # Variáveis CSS
│   └── style.css               # Estilos principais
│
├── js/
│   ├── admin-dashboard.js      # Dashboard
│   ├── admin-projetos.js       # Admin Projetos
│   ├── admin-doacoes.js        # Admin Doações
│   ├── admin-voluntarios.js    # Admin Voluntários
│   ├── admin-eventos.js        # Admin Eventos
│   ├── admin-depoimentos.js    # Admin Depoimentos
│   ├── admin-galeria.js        # Admin Galeria
│   ├── projetos.js             # Listagem pública
│   ├── eventos.js              # Listagem pública
│   ├── voluntario.js           # Formulário público
│   ├── doar.js                 # Formulário doação
│   ├── pagamento.js            # Fluxo pagamento
│   └── api.js                  # Utilitários API
│
├── assets/
│   └── images/                 # Imagens do site
│
├── index.html                  # Página inicial
├── projetos.html
├── eventos.html
├── doar-agora.html
├── pagamento.html
├── ser-voluntario.html
├── admin-dashboard.html
├── admin-projetos.html
├── admin-doacoes.html
├── admin-voluntarios.html
├── admin-eventos.html
├── admin-depoimentos.html
├── admin-galeria.html
├── .gitignore
└── README.md
```

## 🔧 Como Executar

### Pré-requisitos
- Node.js (v14 ou superior)
- PostgreSQL (v12 ou superior)
- npm ou yarn

### 1. Configurar Backend

```bash
# Entrar na pasta backend
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Copie .env.example para .env e configure:
# DATABASE_URL=postgres://usuario:senha@localhost:5432/casa_do_caminho
# PORT=3000

# Executar migrations
npx sequelize-cli db:migrate

# Iniciar servidor
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

### 2. Acessar Frontend

Abra o navegador e acesse:

- **Site público**: `http://localhost:3000/index.html`
- **Painel admin**: `http://localhost:3000/admin-dashboard.html`

## 📚 API Endpoints

### Projetos
- `GET /api/projetos` - Listar todos
- `GET /api/projetos/:id` - Buscar por ID
- `POST /api/projetos` - Criar novo
- `PUT /api/projetos/:id` - Atualizar
- `DELETE /api/projetos/:id` - Deletar

### Doações
- `GET /api/doacoes` - Listar todas
- `GET /api/doacoes/:id` - Buscar por ID
- `POST /api/doacoes` - Criar nova
- `PUT /api/doacoes/:id` - Atualizar
- `DELETE /api/doacoes/:id` - Deletar

### Voluntários
- `GET /api/voluntarios` - Listar todos
- `GET /api/voluntarios/stats` - Estatísticas
- `GET /api/voluntarios/:id` - Buscar por ID
- `POST /api/voluntarios` - Criar novo
- `PUT /api/voluntarios/:id` - Atualizar
- `DELETE /api/voluntarios/:id` - Deletar

### Eventos
- `GET /api/eventos` - Listar todos
- `GET /api/eventos/:id` - Buscar por ID
- `POST /api/eventos` - Criar novo
- `PUT /api/eventos/:id` - Atualizar
- `DELETE /api/eventos/:id` - Deletar

### Depoimentos
- `GET /api/depoimentos` - Listar todos
- `GET /api/depoimentos/:id` - Buscar por ID
- `POST /api/depoimentos` - Criar novo
- `PUT /api/depoimentos/:id` - Atualizar (aprovar/rejeitar)
- `DELETE /api/depoimentos/:id` - Deletar

### Galeria
- `GET /api/galeria` - Listar todas as fotos
- `GET /api/galeria/:id` - Buscar por ID
- `POST /api/galeria` - Upload de foto
- `PUT /api/galeria/:id` - Atualizar
- `DELETE /api/galeria/:id` - Deletar

## 🎨 Design System

### Cores
- **Primary**: `#ff6b35` (Laranja vibrante)
- **Secondary**: `#4a90e2` (Azul)
- **Success**: `#28a745` (Verde)
- **Warning**: `#ffc107` (Amarelo)
- **Danger**: `#dc3545` (Vermelho)

### Tipografia
- **Fonte Principal**: Poppins (Google Fonts)
- **Títulos**: 600-700 weight
- **Corpo**: 400-500 weight

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm test
```

## 🚀 Deploy

### Backend (Heroku)
```bash
heroku create casa-do-caminho-api
git push heroku main
heroku run npx sequelize-cli db:migrate
```

### Frontend (Vercel/Netlify)
```bash
vercel deploy
# ou
netlify deploy
```

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais.


---

**Desenvolvido com ❤️ para impactar vidas através da tecnologia**
