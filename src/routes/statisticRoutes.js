const express = require('express');
const router = express.Router();
const { upload } = require('../config/multer');
const {
  getStatistics,
  updateStatistics,
  uploadHeroPhoto,
} = require('../controllers/statisticController');

router.get('/', getStatistics);
router.put('/', updateStatistics);
router.post('/hero-photo', upload.single('heroPhoto'), uploadHeroPhoto);

module.exports = router;
