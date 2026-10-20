#!/usr/bin/env node

/**
 * Script de test et de ping manuel Keep-Alive
 * Usage: node scripts/pingKeepAlive.js [url_optionnelle]
 */

const https = require('https');
const http = require('http');

const targetUrl = process.argv[2] || process.env.API_URL || 'https://portfolio-backend-4mj2.onrender.com/api/keep-alive';
const client = targetUrl.startsWith('https') ? https : http;

console.log(`[PING] Envoi d'une requête de maintien en vie vers : ${targetUrl}`);
const startTime = Date.now();

const req = client.get(targetUrl, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const elapsed = Date.now() - startTime;
    console.log(`[PING] Statut HTTP : ${res.statusCode} (${elapsed}ms)`);
    try {
      const parsed = JSON.parse(data);
      console.log('[PING] Réponse du serveur :', JSON.stringify(parsed, null, 2));
    } catch {
      console.log('[PING] Corps brut :', data);
    }
    process.exit(res.statusCode >= 200 && res.statusCode < 400 ? 0 : 1);
  });
});

req.on('error', (err) => {
  console.error(`[PING ERROR] Échec de la requête : ${err.message}`);
  process.exit(1);
});

req.setTimeout(60000, () => {
  console.warn('[PING TIMEOUT] La requête a expiré après 60s (le serveur Render était peut-être en veille froide)');
  req.destroy();
  process.exit(1);
});
