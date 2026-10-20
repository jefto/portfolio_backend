require('dotenv').config();
const { connectDB, sequelize } = require('./src/config/db');
const app = require('./src/app');

// Importer les modèles pour que Sequelize les enregistre
require('./src/models/Project');
require('./src/models/Skill');
require('./src/models/CV');
require('./src/models/Education');
require('./src/models/Experience');
require('./src/models/Volunteering');
require('./src/models/Statistic');

// Keep-alive — chargé une seule fois, appelé uniquement en production
const startKeepAlive = require('./src/utils/keepAlive');

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectDB();

  // Synchroniser les tables (alter: true ajuste les colonnes sans tout supprimer)
  await sequelize.sync({ alter: true });
  console.log('[DB] Tables PostgreSQL synchronisées');

  app.listen(PORT, () => {
    console.log(`[SERVER] Serveur lancé sur http://localhost:${PORT}`);
    console.log(`[API] Projets : http://localhost:${PORT}/api/projects`);
    console.log(`[API] Expériences : http://localhost:${PORT}/api/experiences`);
    console.log(`[API] Bénévolat : http://localhost:${PORT}/api/volunteering`);
    console.log(`[HEALTH] Santé : http://localhost:${PORT}/api/health`);

    // Activer le keep-alive uniquement en production (Render Free)
    if (process.env.NODE_ENV === 'production') {
      startKeepAlive();
    }
  });
};

start();
