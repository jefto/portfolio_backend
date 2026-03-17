const express = require('express');
const router = express.Router();
const { uploadCV } = require('../config/multer');
const { getCV, uploadCV: uploadCVController, deleteCV } = require('../controllers/cvController');

router.get('/', getCV);
router.post('/', uploadCV.single('cv'), uploadCVController);
router.delete('/', deleteCV);

module.exports = router;

