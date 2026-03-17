const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

// ── Liste des serveurs : production en premier, localhost en fallback ─────────
const servers = [];

if (process.env.RENDER_EXTERNAL_URL) {
  servers.push({
    url: process.env.RENDER_EXTERNAL_URL,
    description: 'Production (Render)',
  });
}
if (process.env.API_URL) {
  servers.push({
    url: process.env.API_URL,
    description: 'Custom URL',
  });
}
// Localhost toujours en dernier (fallback dev)
servers.push({
  url: `http://localhost:${process.env.PORT || 5000}`,
  description: 'Développement local',
});

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Portfolio API',
      version: '1.0.0',
      description:
        'API REST pour gérer les **projets**, **compétences** et **CV** du portfolio.\n\n' +
        '> **Images** : les chemins retournés (ex: `uploads/xxx.png`) doivent être préfixés par la base URL.\n\n' +
        '> **Upload fichiers** : utiliser `multipart/form-data` (ne pas définir `Content-Type` manuellement).',
    },
    servers,
    components: {
      schemas: {
        // ── Modèle Project ─────────────────────────────────────────────────
        Project: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            coverImage: {
              type: 'string',
              description: 'Chemin relatif ou URL Cloudinary',
              example: 'uploads/coverImage-1234567890-123.png',
            },
            title: { type: 'string', example: 'Mon app e-commerce' },
            description: {
              type: 'string',
              example: 'Application fullstack avec panier et paiement',
            },
            technologies: {
              type: 'array',
              items: { type: 'string' },
              example: ['React', 'Node.js', 'PostgreSQL'],
            },
            client: { type: 'string', example: 'Client ABC' },
            date: { type: 'string', format: 'date', example: '2025-06-15' },
            category: {
              type: 'string',
              enum: ['projet-dev', 'projet-design'],
              example: 'projet-dev',
            },
            type: {
              type: 'string',
              enum: ['maquette', 'affiche', 'frontend', 'backend', 'fullstack', 'mobile', 'desktop'],
              example: 'fullstack',
            },
            link: { type: 'string', example: 'https://monprojet.com' },
            screenshots: {
              type: 'array',
              items: { type: 'string' },
              example: ['uploads/screenshots-1234567890-456.png'],
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ── Modèle Skill ───────────────────────────────────────────────────
        Skill: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'React' },
            level: {
              type: 'integer',
              minimum: 0,
              maximum: 100,
              description: 'Niveau de maîtrise (0 → 100)',
              example: 90,
            },
            category: {
              type: 'string',
              enum: ['dev', 'design'],
              example: 'dev',
            },
            type: {
              type: 'string',
              enum: [
                'langage-de-programmation',
                'framework',
                'base-de-donnee',
                'outil',
                'prototypage',
                'design',
                '3d',
              ],
              example: 'framework',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ── Modèle CV ──────────────────────────────────────────────────────
        CV: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            filePath: {
              type: 'string',
              description: 'Chemin relatif ou URL Cloudinary',
              example: 'uploads/cv/cv-1234567890.pdf',
            },
            originalName: { type: 'string', example: 'mon-cv.pdf' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ── Réponses génériques ────────────────────────────────────────────
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Projet non trouvé' },
            errors: {
              type: 'array',
              items: { type: 'string' },
              example: ['Le titre est requis'],
            },
          },
        },
        SuccessMessage: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Supprimé avec succès' },
          },
        },
      },
    },

    // ── Endpoint /api/health défini ici (pas dans un fichier de route) ────
    paths: {
      '/api/health': {
        get: {
          summary: 'Vérification santé de l\'API',
          tags: ['Health'],
          responses: {
            200: {
              description: 'API opérationnelle',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: {
                        type: 'string',
                        example: 'API Portfolio opérationnelle 🚀',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  // Fichiers où swagger-jsdoc doit chercher les annotations @openapi
  apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;


