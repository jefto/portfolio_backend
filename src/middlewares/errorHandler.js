const errorHandler = (err, req, res, next) => {
  console.error('❌ Erreur :', err.message);

  // Erreur Multer (taille de fichier, type, etc.)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'Le fichier est trop volumineux. Taille max : 5 Mo.',
    });
  }

  // Erreur de validation Sequelize
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: messages,
    });
  }

  // Erreur de contrainte unique Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Violation de contrainte unique',
      errors: messages,
    });
  }

  // Erreur de base de données Sequelize
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(400).json({
      success: false,
      message: 'Erreur de base de données',
    });
  }

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Erreur interne du serveur',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
