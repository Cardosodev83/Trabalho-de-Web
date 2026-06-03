# Trabalho-de-Web
Trabalho de Web da dupla Mariana Cardoso da Silva e Gabriel Phelippe Prado

# 🏠 Casa do Caminho - Plataforma Web

> Sistema web para gestão de ações sociais, doações e voluntariado de uma organização espírita assistencial.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)

[![Responsive](https://img.shields.io/badge/Responsive-Mobile%20First-success?style=for-the-badge)](https://web.dev/responsive-web-design-basics/)

---

## 🎯 Sobre o Projeto

Este projeto foi desenvolvido como trabalho acadêmico da disciplina de **Desenvolvimento Web** e consiste em uma plataforma completa para a **Casa do Caminho**, um centro espírita que realiza ações sociais e assistenciais.

O sistema tem como objetivo **aumentar a visibilidade dos projetos sociais**, **facilitar doações online** e **otimizar a gestão administrativa** através de um painel intuitivo que não requer conhecimentos técnicos.


## Cliente

**Casa do Caminho**  
Centro Espírita e Assistência Social

### Missão
Promover o bem-estar social através da caridade, educação e assistência às famílias em situação de vulnerabilidade, fundamentados nos princípios espíritas.

### Áreas de Atuação
- 🍲 **Sopa Solidária** - 200 refeições semanais
- 🛍️ **Bazar Beneficente** - Roupas e utensílios a preços sociais
- 📦 **Cesta Básica** - Distribuição mensal para famílias carentes
- 👶 **Creche Comunitária** - Educação infantil gratuita
- 🍼 **Enxoval Solidário** - Kits para gestantes carentes
- 🍞 **Pão Fraterno** - Distribuição de sopas para moradores de rua

---

## 🎯 Objetivos

### Objetivos do Site
1. Apresentar os projetos sociais de forma atrativa e transparente
2. Facilitar doações online com escolha de destino
3. Captar e gerenciar voluntários
4. Divulgar eventos e atividades
5. Permitir atualização de conteúdo sem conhecimento técnico

### Objetivos de Aprendizado
- Desenvolver aplicação web responsiva e acessível
- Aplicar princípios de design (CRAP, teoria das cores, tipografia)
- Implementar JavaScript vanilla para interatividade
- Preparar arquitetura para integração com back-end
- Trabalhar com cliente real e levantamento de requisitos

---

## Tecnologias

### Front-End (Fase 1 - Atual)
| Tecnologia | Uso |
|------------|-----|
| **HTML5** | Estrutura semântica das páginas |
| **CSS3** | Estilização e responsividade |
| **JavaScript (Vanilla)** | Interatividade e validações |
| **CSS Grid & Flexbox** | Layouts responsivos |
| **CSS Custom Properties** | Design tokens e variáveis |

---

## 📁 Estrutura do Projeto

```
 casa-do-caminho/
│
├── index.html # Página inicial
│
├── pages/ # Páginas do site
│ ├── institucional.html # Sobre a organização
│ ├── contato.html # Formulário de contato
│ ├── espiritual.html # Área religiosa
│ ├── eventos.html # Lista de eventos
│ │
│ ├── projetos/ # Projetos sociais
│ │ ├── projetos.html # Visão geral
│ │ ├── sopa_solidaria.html
│ │ ├── bazar_beneficiente.html
│ │ ├── pao_fraterno.html
│ │ ├── creche.html
│ │ ├── enxoval.html
│ │ ├── cesta_basica.html
│ │ # Doações e voluntariado
│ │ ├── doar_agora.html # Formulário de doação
│ │ ├── pagamento.html # Finalização de doação
│ │ └── ser_voluntario.html # Cadastro de voluntários
│ │
│ └── admin/ # Painel administrativo
│ ├── admin_login.html
│ ├── admin_dashboard.html
│ ├── admin_projetos.html
│ ├── admin_eventos.html
│ ├── admin_doacoes.html
│ ├── admin_voluntarios.html
│ ├── admin_galeria.html
│ └── admin_depoimentos.html
│
├── css/ # Estilos
│ ├── reset.css # Normalização de estilos
│ ├── design_tokens.css # Variáveis ​​CSS (núcleos, fontes, etc)
│ └── style.css # Estilos principais (5000+ linhas)
│
└── README.md # Este arquivo
```



---

## ✨ Funcionalidades

### 🏠 Área Pública

#### Páginas Institucionais
- ✅ **Home** - Hero section, cards de áreas, projetos em destaque, números de impacto
- ✅ **Sobre Nós** - Missão, visão, valores, história da organização
- ✅ **Contato** - Formulário de contato, mapa, informações
- ✅ **Área Espiritual** - Estudos, palestras, horários de funcionamento

#### Projetos Sociais
- ✅ **Visão Geral** - Grid com os 6 projetos
- ✅ **Páginas Individuais** - Descrição, como funciona, galeria, números, CTA doar

#### Engajamento
- ✅ **Doações** - Formulário em 2 etapas (escolha de destino + pagamento)
- ✅ **Voluntariado** - Cadastro com áreas de interesse e disponibilidade
- ✅ **Eventos** - Lista de próximos eventos com detalhes

### 🔐 Área Administrativa

#### Dashboard
- ✅ Métricas principais (doações, voluntários, eventos)
- ✅ Gráficos de performance
- ✅ Últimas atividades

#### Módulos de Gestão
- ✅ **Projetos** - CRUD completo (Create, Read, Update, Delete)
- ✅ **Eventos** - Adicionar, editar, remover eventos
- ✅ **Doações** - Relatório financeiro, filtros, exportação
- ✅ **Voluntários** - Lista, aprovar/rejeitar cadastros
- ✅ **Galeria** - Upload e organização de fotos
- ✅ **Depoimentos** - Moderar antes de publicar
- ✅ **Configurações** - Editar textos institucionais

### ⚙️ Funcionalidades Técnicas

#### JavaScript
- ✅ Menu hambúrguer responsivo (mobile)
- ✅ Validação de formulários em tempo real
- ✅ Máscaras de input (CPF, telefone, CEP)
- ✅ Smooth scroll para navegação interna
- ✅ Carrossel/slider de imagens
- ✅ Modais e pop-ups
- ✅ Filtros dinâmicos

#### Responsividade
- ✅ Mobile-first approach
- ✅ Breakpoints: 768px (tablet), 1024px (desktop)
- ✅ Imagens otimizadas
- ✅ Tipografia escalável

#### Acessibilidade
- ✅ HTML semântico (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- ✅ Alt text em todas as imagens
- ✅ Labels em todos os campos de formulário
- ✅ Navegação por teclado (Tab, Enter, Esc)
- ✅ Contraste de cores adequado (WCAG AA - 4.5:1)
- ✅ Foco visível em elementos interativos

---

## 🚀 Instalação e Uso

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Editor de código (recomendado: VS Code)
- Extensão Live Server (opcional, para desenvolvimento)

### Executar o Projeto

- Clone o repositório
  ```git clone https://github.com/cardosodev83/casa-do-caminho.git```

- Entre no diretório
  ```cd casa-do-caminho```

- Abra index.html em seu navegador
  - Duplo clique no arquivo ou:
    ```
    open index.html        # macOS
    start index.html       # Windows
    xdg-open index.html    # Linux
    ```

### Navegação

Páginas Principais:
  - Lar:index.html
  - Projetos:projetos.html
  - Doações:doar_agora.html
  - Administrador:admin_login.html

Credenciais de Teste (maquete):
  - Email: admin@casadocaminho.org
  - Senha: admin123


Desenvolvido por: Mariana Cardoso da Silva e Gabriel Phelippe Prado
Disciplina: Desenvolvimento Web - 2026.1
