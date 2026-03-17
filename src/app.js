const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const cvRoutes = require('./routes/cvRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// --- Middlewares globaux ---

// CORS – autorise toutes les origines en dev
app.use(cors());

// Logger HTTP
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Parser JSON et formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers uploadés en statique
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// --- Routes ---
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/cv', cvRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API Portfolio opérationnelle 🚀' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route non trouvée' });
});

// Gestionnaire d'erreurs global
app.use(errorHandler);

module.exports = app;

