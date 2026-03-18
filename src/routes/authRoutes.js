const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

router.post('/login', login);

// TODO: supprimer cette route avant la mise en production
router.get('/debug-env', (req, res) => {
  res.json({
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD_HASH_LENGTH: process.env.ADMIN_PASSWORD_HASH?.length,
    ADMIN_PASSWORD_HASH_START: process.env.ADMIN_PASSWORD_HASH?.substring(0, 7),
    JWT_SECRET_SET: !!process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  });
});

module.exports = router;

