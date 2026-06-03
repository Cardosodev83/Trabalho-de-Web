require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Importar rotas
const projetoRoutes = require('./routes/projetoRoutes');
const doacaoRoutes = require('./routes/doacaoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite requisições do front-end
app.use(express.json()); // Parse de JSON
app.use(express.urlencoded({ extended: true })); // Parse de form-data

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    message: 'API Casa do Caminho está funcionando!',
    version: '1.0.0',
    endpoints: {
      projetos: '/api/projetos',
      doacoes: '/api/doacoes'
    }
  });
});

// Rotas da API
app.use('/api/projetos', projetoRoutes);
app.use('/api/doacoes', doacaoRoutes);

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Testar conexão com banco e iniciar servidor
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexão com banco de dados estabelecida!');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📡 Acesse: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erro ao conectar com o banco:', err);
  });
