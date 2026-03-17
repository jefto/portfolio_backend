const express = require('express');
const router = express.Router();
const { upload } = require('../config/multer');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

// Middleware Multer pour les champs fichiers
const uploadFields = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'screenshots', maxCount: 10 },
]);

// ─── Routes ────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/projects:
 *   get:
 *     summary: Récupérer tous les projets (triés par date décroissante)
 *     tags: [Projets]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [projet-dev, projet-design]
 *         description: Filtrer par catégorie
 *         example: projet-dev
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [maquette, affiche, frontend, backend, fullstack, mobile, desktop]
 *         description: Filtrer par type
 *         example: fullstack
 *     responses:
 *       200:
 *         description: Liste des projets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', getAllProjects);

/**
 * @openapi
 * /api/projects/{id}:
 *   get:
 *     summary: Récupérer un projet par son ID
 *     tags: [Projets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet
 *         example: 1
 *     responses:
 *       200:
 *         description: Projet trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       404:
 *         description: Projet non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getProjectById);

/**
 * @openapi
 * /api/projects:
 *   post:
 *     summary: Créer un nouveau projet
 *     tags: [Projets]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [coverImage, title, description, category, type]
 *             properties:
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Photo de couverture (JPEG/PNG/WebP/GIF — max 5 Mo)
 *               title:
 *                 type: string
 *                 example: Mon app e-commerce
 *               description:
 *                 type: string
 *                 example: Application fullstack avec panier et paiement
 *               category:
 *                 type: string
 *                 enum: [projet-dev, projet-design]
 *                 example: projet-dev
 *               type:
 *                 type: string
 *                 enum: [maquette, affiche, frontend, backend, fullstack, mobile, desktop]
 *                 example: fullstack
 *               technologies:
 *                 type: string
 *                 description: 'Tableau JSON sérialisé ex: ["React","Node.js"]'
 *                 example: '["React","Node.js","PostgreSQL"]'
 *               client:
 *                 type: string
 *                 example: Client ABC
 *               date:
 *                 type: string
 *                 format: date
 *                 example: '2025-06-15'
 *               link:
 *                 type: string
 *                 example: 'https://monprojet.com'
 *               screenshots:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Captures d'écran (max 10 — JPEG/PNG/WebP/GIF — max 5 Mo chacune)
 *     responses:
 *       201:
 *         description: Projet créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Erreur de validation ou fichier invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', uploadFields, createProject);

/**
 * @openapi
 * /api/projects/{id}:
 *   put:
 *     summary: Mettre à jour un projet (tous les champs sont optionnels)
 *     tags: [Projets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet
 *         example: 1
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Nouvelle photo de couverture (remplace et supprime l'ancienne sur Cloudinary)
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [projet-dev, projet-design]
 *               type:
 *                 type: string
 *                 enum: [maquette, affiche, frontend, backend, fullstack, mobile, desktop]
 *               technologies:
 *                 type: string
 *                 description: 'Tableau JSON sérialisé ex: ["Vue.js","Laravel"]'
 *               client:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               link:
 *                 type: string
 *               screenshots:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Nouvelles captures (remplacent toutes les anciennes sur Cloudinary)
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [projet-dev, projet-design]
 *               type:
 *                 type: string
 *                 enum: [maquette, affiche, frontend, backend, fullstack, mobile, desktop]
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *               client:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Projet mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Projet non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', uploadFields, updateProject);

/**
 * @openapi
 * /api/projects/{id}:
 *   delete:
 *     summary: Supprimer un projet et ses images Cloudinary
 *     tags: [Projets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet
 *         example: 1
 *     responses:
 *       200:
 *         description: Projet supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       404:
 *         description: Projet non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', deleteProject);

module.exports = router;

