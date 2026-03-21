const express = require('express');
const router = express.Router();
const { getStatistics, updateStatistics } = require('../controllers/statisticController');

/**
 * @openapi
 * /api/statistics:
 *   get:
 *     summary: Récupérer les statistiques du portfolio
 *     description: >
 *       Retourne l'unique enregistrement de statistiques. Si aucun n'existe,
 *       un enregistrement avec des valeurs à 0 est créé automatiquement.
 *     tags: [Statistiques]
 *     responses:
 *       200:
 *         description: Statistiques du portfolio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Statistic'
 */
router.get('/', getStatistics);

/**
 * @openapi
 * /api/statistics:
 *   put:
 *     summary: Mettre à jour les statistiques du portfolio
 *     tags: [Statistiques]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completedProjects:
 *                 type: integer
 *                 description: Nombre de projets complétés (page Dev)
 *                 example: 8
 *               yearsExperience:
 *                 type: integer
 *                 description: "Années d'expérience (page Dev)"
 *                 example: 1
 *               masteredTechnologies:
 *                 type: integer
 *                 description: Technologies maîtrisées (page Dev)
 *                 example: 10
 *               mockupsCreated:
 *                 type: integer
 *                 description: Maquettes créées (page Design)
 *                 example: 5
 *               postersDesigned:
 *                 type: integer
 *                 description: Affiches conçues (page Design)
 *                 example: 10
 *               masteredSoftware:
 *                 type: integer
 *                 description: Logiciels maîtrisés (page Design)
 *                 example: 6
 *     responses:
 *       200:
 *         description: Statistiques mises à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Statistic'
 */
router.put('/', updateStatistics);

module.exports = router;

