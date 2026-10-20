const cron = require('node-cron');
const http = require('http');
const https = require('https');
const { sequelize } = require('../config/db');

const DEFAULT_RENDER_URL = 'https://portfolio-backend-4mj2.onrender.com';

/**
 * Keep-alive interne pour Render et Supabase.
 *
 * Fonctionnement :
 * 1. Ping HTTP régulier (toutes les 12 min) vers /api/keep-alive pour signaler à Render
 *    du trafic actif et empêcher le spin-down de 15 minutes.
 * 2. Requête SQL directe (toutes les 10 min) vers Supabase PostgreSQL pour maintenir
 *    le pool de connexions chaud et empêcher la mise en pause de Supabase.
 */
function startKeepAlive() {
  const baseUrl = (
    process.env.RENDER_EXTERNAL_URL ||
    process.env.API_URL ||
    DEFAULT_RENDER_URL
  ).replace(/\/$/, '');

  const keepAliveUrl = `${baseUrl}/api/keep-alive`;
  const client = keepAliveUrl.startsWith('https') ? https : http;

  console.log(`[KEEP-ALIVE] Initialisation du système anti-mise en veille`);
  console.log(`[KEEP-ALIVE] Cible HTTP : ${keepAliveUrl} (toutes les 12 min)`);
  console.log(`[KEEP-ALIVE] Cible BD   : Supabase PostgreSQL SELECT 1 (toutes les 10 min)`);

  // 1. Ping HTTP toutes les 12 minutes (avant le seuil de 15 min de Render)
  cron.schedule('*/12 * * * *', () => {
    client
      .get(keepAliveUrl, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          console.log(`[KEEP-ALIVE] Ping HTTP envoyé avec succès (${res.statusCode})`);
        });
      })
      .on('error', (err) => {
        console.warn(`[KEEP-ALIVE] Avertissement ping HTTP : ${err.message}`);
      });
  });

  // 2. Requête directe en base toutes les 10 minutes pour maintenir Supabase actif
  cron.schedule('*/10 * * * *', async () => {
    try {
      await sequelize.query('SELECT 1 AS keepalive_direct;');
      console.log(`[KEEP-ALIVE] Battement de cœur Supabase SQL réussi`);
    } catch (err) {
      console.warn(`[KEEP-ALIVE] Erreur battement Supabase SQL : ${err.message}`);
    }
  });
}

module.exports = startKeepAlive;
