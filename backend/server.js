require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// MIDDLEWARES
// ========================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('../'));

// ========================================
// IMPORTAR ROTAS
// ========================================
const projetoRoutes = require('./routes/projetoRoutes');
const doacaoRoutes = require('./routes/doacaoRoutes');
const voluntarioRoutes = require('./routes/voluntarioRoutes');
const depoimentoRoutes = require('./routes/depoimentoRoutes');
app.use('/api/depoimentos', depoimentoRoutes);
const eventoRoutes = require('./routes/eventoRoutes');
app.use('/api/eventos', eventoRoutes);

const galeriaRoutes = require('./routes/galeriaRoutes');
app.use('/api/galeria', galeriaRoutes);

// ========================================
// REGISTRAR ROTAS
// ========================================
app.use('/api/projetos', projetoRoutes);
app.use('/api/doacoes', doacaoRoutes);
app.use('/api/voluntarios', voluntarioRoutes);

// ========================================
// ROTA DE TESTE
// ========================================
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

// ========================================
// ROTA 404 - DEVE FICAR NO FINAL
// ========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    type: 'NotFoundError',
    message: 'Route not found',
    route: req.path
  });
});

// ========================================
// INICIAR SERVIDOR
// ========================================
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexão com banco de dados estabelecida!');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 Acesse: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erro ao conectar com o banco de dados:', err);
  });

module.exports = app;
