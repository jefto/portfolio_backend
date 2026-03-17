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

// Routes
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', uploadFields, createProject);
router.put('/:id', uploadFields, updateProject);
router.delete('/:id', deleteProject);

module.exports = router;

