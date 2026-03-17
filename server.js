require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { connectDB, sequelize } = require('./src/config/db');
const app = require('./src/app');

// Importer les modèles pour que Sequelize les enregistre
require('./src/models/Project');
require('./src/models/Skill');
require('./src/models/CV');

// Créer les dossiers d'uploads s'ils n'existent pas (nécessaire pour Render)
const uploadsDir = path.join(__dirname, 'uploads');
const cvDir = path.join(uploadsDir, 'cv');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(cvDir)) fs.mkdirSync(cvDir, { recursive: true });

const PORT = process.env.PORT || 3001;

const start = async () => {
  await connectDB();

  // Synchroniser les tables (alter: true ajuste les colonnes sans tout supprimer)
  await sequelize.sync({ alter: true });
  console.log('📋 Tables PostgreSQL synchronisées');

  app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    console.log(`📦 API projets : http://localhost:${PORT}/api/projects`);
    console.log(`🩺 Santé : http://localhost:${PORT}/api/health`);
  });
};

start();
