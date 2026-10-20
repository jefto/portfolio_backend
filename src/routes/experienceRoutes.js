const express = require('express');
const router = express.Router();
const { upload } = require('../config/multer');
const {
  getAllExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} = require('../controllers/experienceController');

const optionalDesignUpload = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    return upload.array('designImages', 10)(req, res, next);
  }
  return next();
};

/**
 * @openapi
 * /api/experiences:
 *   get:
 *     summary: Récupérer tous les postes et expériences (triés par orderIndex)
 *     tags: [Experiences]
 *     responses:
 *       200:
 *         description: Liste des expériences professionnelles
 */
router.get('/', getAllExperiences);

/**
 * @openapi
 * /api/experiences/{id}:
 *   get:
 *     summary: Récupérer une expérience par son ID
 *     tags: [Experiences]
 */
router.get('/:id', getExperienceById);

/**
 * @openapi
 * /api/experiences:
 *   post:
 *     summary: Créer un poste / une expérience
 *     tags: [Experiences]
 */
router.post('/', optionalDesignUpload, createExperience);

/**
 * @openapi
 * /api/experiences/{id}:
 *   put:
 *     summary: Mettre à jour un poste / une expérience
 *     tags: [Experiences]
 */
router.put('/:id', optionalDesignUpload, updateExperience);

/**
 * @openapi
 * /api/experiences/{id}:
 *   delete:
 *     summary: Supprimer un poste / une expérience
 *     tags: [Experiences]
 */
router.delete('/:id', deleteExperience);

module.exports = router;
