const { sequelize } = require('../config/db');

/**
 * Endpoint de santé et Keep-Alive
 * 
 * Rôle crucial :
 * 1. Maintient le serveur Render Free éveillé (empêche le spin-down de 15 minutes).
 * 2. Exécute une vraie requête SQL légère sur Supabase PostgreSQL (SELECT 1),
 *    ce qui réinitialise le délai d'inactivité de 7 jours de Supabase et empêche
 *    la mise en pause automatique du projet de base de données.
 */
const checkHealth = async (req, res) => {
  const startTime = Date.now();
  try {
    // 1. Exécution d'une vraie requête SQL sur Supabase PostgreSQL
    await sequelize.query('SELECT 1 AS heartbeat;');
    const dbLatencyMs = Date.now() - startTime;

    return res.status(200).json({
      success: true,
      status: 'healthy',
      service: 'portfolio-backend',
      database: {
        status: 'connected',
        provider: 'Supabase PostgreSQL',
        latencyMs: dbLatencyMs,
      },
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      message: 'Backend Render et base Supabase maintenus actifs avec succès.',
    });
  } catch (error) {
    const dbLatencyMs = Date.now() - startTime;
    return res.status(503).json({
      success: false,
      status: 'degraded',
      service: 'portfolio-backend',
      database: {
        status: 'disconnected',
        error: error.message,
        latencyMs: dbLatencyMs,
      },
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      message: 'Attention : la base de données Supabase ne répond pas.',
    });
  }
};

module.exports = { checkHealth };
