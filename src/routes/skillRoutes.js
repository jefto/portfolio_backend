const express = require('express');
const router = express.Router();
const { getAllSkills, getSkillById, createSkill, updateSkill, deleteSkill } = require('../controllers/skillController');

/**
 * @openapi
 * /api/skills:
 *   get:
 *     summary: Récupérer toutes les compétences (triées par niveau décroissant)
 *     tags: [Compétences]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [dev, design]
 *         description: Filtrer par catégorie
 *         example: dev
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [langage-de-programmation, framework, base-de-donnee, outil, prototypage, design, 3d]
 *         description: Filtrer par type
 *         example: framework
 *     responses:
 *       200:
 *         description: Liste des compétences
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
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Skill'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', getAllSkills);

/**
 * @openapi
 * /api/skills/{id}:
 *   get:
 *     summary: Récupérer une compétence par son ID
 *     tags: [Compétences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compétence
 *         example: 1
 *     responses:
 *       200:
 *         description: Compétence trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Skill'
 *       404:
 *         description: Compétence non trouvée
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
router.get('/:id', getSkillById);

/**
 * @openapi
 * /api/skills:
 *   post:
 *     summary: Créer une nouvelle compétence
 *     tags: [Compétences]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, level, category, type]
 *             properties:
 *               name:
 *                 type: string
 *                 example: React
 *               level:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 90
 *               category:
 *                 type: string
 *                 enum: [dev, design]
 *                 example: dev
 *               type:
 *                 type: string
 *                 enum: [langage-de-programmation, framework, base-de-donnee, outil, prototypage, design, 3d]
 *                 example: framework
 *     responses:
 *       201:
 *         description: Compétence créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Skill'
 *       400:
 *         description: Erreur de validation
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
router.post('/', createSkill);

/**
 * @openapi
 * /api/skills/{id}:
 *   put:
 *     summary: Mettre à jour une compétence (tous les champs sont optionnels)
 *     tags: [Compétences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compétence
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               level:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *               category:
 *                 type: string
 *                 enum: [dev, design]
 *               type:
 *                 type: string
 *                 enum: [langage-de-programmation, framework, base-de-donnee, outil, prototypage, design, 3d]
 *     responses:
 *       200:
 *         description: Compétence mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Skill'
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Compétence non trouvée
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
router.put('/:id', updateSkill);

/**
 * @openapi
 * /api/skills/{id}:
 *   delete:
 *     summary: Supprimer une compétence
 *     tags: [Compétences]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compétence
 *         example: 1
 *     responses:
 *       200:
 *         description: Compétence supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       404:
 *         description: Compétence non trouvée
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
router.delete('/:id', deleteSkill);

module.exports = router;
