const express = require('express');
const router = express.Router();
const { upload } = require('../config/multer');
const {
  getAllVolunteerings,
  getVolunteeringById,
  createVolunteering,
  updateVolunteering,
  deleteVolunteering,
} = require('../controllers/volunteeringController');

const optionalImageUpload = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    return upload.single('image')(req, res, next);
  }
  return next();
};

router.get('/', getAllVolunteerings);
router.get('/:id', getVolunteeringById);
router.post('/', optionalImageUpload, createVolunteering);
router.put('/:id', optionalImageUpload, updateVolunteering);
router.delete('/:id', deleteVolunteering);

module.exports = router;
