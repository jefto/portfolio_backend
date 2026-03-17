const cron = require('node-cron');
const http = require('http');
const https = require('https');

/**
 * Keep-alive — ping /api/health toutes les 14 minutes.
 * Empêche le serveur Render Free de se mettre en veille
 * (spin-down automatique après 15 min d'inactivité).
 *
 * Activé UNIQUEMENT en production (NODE_ENV === 'production').
 * L'URL cible est lue depuis RENDER_EXTERNAL_URL ou API_URL.
 */
function startKeepAlive() {
  const baseUrl = process.env.RENDER_EXTERNAL_URL || process.env.API_URL;

  if (!baseUrl) {
    console.warn(
      '⚠️  Keep-alive désactivé : aucune variable RENDER_EXTERNAL_URL ou API_URL trouvée.'
    );
    return;
  }

  // Supprimer le slash final si présent
  const healthUrl = `${baseUrl.replace(/\/$/, '')}/api/health`;
  const client = healthUrl.startsWith('https') ? https : http;

  // Cron : toutes les 14 minutes → "*/14 * * * *"
  cron.schedule('*/14 * * * *', () => {
    client
      .get(healthUrl, (res) => {
        console.log(`✅ Keep-alive ping sent → ${res.statusCode}`);
        // Consommer la réponse pour libérer la socket
        res.resume();
      })
      .on('error', (err) => {
        console.error(`❌ Keep-alive ping failed → ${err.message}`);
      });
  });

  console.log(`🏓 Keep-alive actif — ping toutes les 14 min → ${healthUrl}`);
}

module.exports = startKeepAlive;

