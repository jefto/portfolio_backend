const express = require('express');
const router = express.Router();
const {
  getAllEducations,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
} = require('../controllers/educationController');

/**
 * @openapi
 * /api/educations:
 *   get:
 *     summary: Récupérer tout le parcours académique (trié par année décroissante)
 *     tags: [Parcours académique]
 *     responses:
 *       200:
 *         description: Liste des formations
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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Education'
 */
router.get('/', getAllEducations);

/**
 * @openapi
 * /api/educations/{id}:
 *   get:
 *     summary: Récupérer une formation par son ID
 *     tags: [Parcours académique]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Formation trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Education'
 *       404:
 *         description: Formation non trouvée
 */
router.get('/:id', getEducationById);

/**
 * @openapi
 * /api/educations:
 *   post:
 *     summary: Créer une nouvelle formation
 *     tags: [Parcours académique]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [startYear, title, school]
 *             properties:
 *               startYear:
 *                 type: integer
 *                 example: 2023
 *               endYear:
 *                 type: integer
 *                 nullable: true
 *                 description: "null = En cours"
 *                 example: null
 *               title:
 *                 type: string
 *                 example: "Licence Professionnelle Génie Logiciel"
 *               school:
 *                 type: string
 *                 example: "École Polytechnique de Lomé"
 *               description:
 *                 type: string
 *                 example: "Formation en architecture et développement logiciel"
 *     responses:
 *       201:
 *         description: Formation créée
 *       400:
 *         description: Erreur de validation
 */
router.post('/', createEducation);

/**
 * @openapi
 * /api/educations/{id}:
 *   put:
 *     summary: Mettre à jour une formation
 *     tags: [Parcours académique]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startYear:
 *                 type: integer
 *               endYear:
 *                 type: integer
 *                 nullable: true
 *               title:
 *                 type: string
 *               school:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Formation mise à jour
 *       404:
 *         description: Formation non trouvée
 */
router.put('/:id', updateEducation);

/**
 * @openapi
 * /api/educations/{id}:
 *   delete:
 *     summary: Supprimer une formation
 *     tags: [Parcours académique]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Formation supprimée
 *       404:
 *         description: Formation non trouvée
 */
router.delete('/:id', deleteEducation);

module.exports = router;

