const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * POST /api/auth/login
 * Corps : { email, password }
 * Répond : { success, token }
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis',
      });
    }

    // Vérifier l'email (comparaison avec variable d'env)
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects',
      });
    }

    // Vérifier le mot de passe contre le hash bcrypt stocké en .env
    const isValid = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    );
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects',
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return res.json({ success: true, token });

  } catch (error) {
    console.error('[authController] login error:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

