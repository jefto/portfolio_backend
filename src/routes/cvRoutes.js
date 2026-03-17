const express = require('express');
const router = express.Router();
const { uploadCV } = require('../config/multer');
const { getCV, uploadCV: uploadCVController, deleteCV } = require('../controllers/cvController');

/**
 * @openapi
 * /api/cv:
 *   get:
 *     summary: Récupérer les informations du CV actuel
 *     tags: [CV]
 *     responses:
 *       200:
 *         description: CV trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CV'
 *       404:
 *         description: Aucun CV disponible
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
router.get('/', getCV);

/**
 * @openapi
 * /api/cv:
 *   post:
 *     summary: Uploader ou remplacer le CV (PDF uniquement — max 10 Mo)
 *     description: >
 *       Si un CV existe déjà en base, il est **automatiquement supprimé** de Cloudinary
 *       et remplacé par le nouveau fichier.
 *     tags: [CV]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [cv]
 *             properties:
 *               cv:
 *                 type: string
 *                 format: binary
 *                 description: Fichier PDF du CV (max 10 Mo)
 *     responses:
 *       201:
 *         description: CV uploadé avec succès (premier upload)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CV'
 *       200:
 *         description: CV remplacé avec succès (un ancien CV existait)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CV'
 *       400:
 *         description: Fichier manquant ou format invalide (seul PDF accepté)
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
router.post('/', uploadCV.single('cv'), uploadCVController);

/**
 * @openapi
 * /api/cv:
 *   delete:
 *     summary: Supprimer le CV (fichier Cloudinary + enregistrement en base)
 *     tags: [CV]
 *     responses:
 *       200:
 *         description: CV supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       404:
 *         description: Aucun CV à supprimer
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
router.delete('/', deleteCV);

module.exports = router;
