const https = require('https');
const CV = require('../models/CV');
const { cloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// @desc    Récupérer les infos du CV actuel
// @route   GET /api/cv
// @access  Public
const getCV = async (req, res, next) => {
  try {
    const cv = await CV.findOne();
    if (!cv) {
      return res.status(404).json({ success: false, message: 'Aucun CV disponible' });
    }
    res.json({ success: true, data: cv });
  } catch (error) {
    next(error);
  }
};

// @desc    Uploader ou remplacer le CV
// @route   POST /api/cv
// @access  Public
const uploadCV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucun fichier PDF fourni' });
    }

    // Cloudinary retourne l'URL dans req.file.path
    const filePath = req.file.path;
    const originalName = req.file.originalname;

    // Supprimer l'ancien CV de Cloudinary s'il existe
    const existing = await CV.findOne();
    if (existing) {
      await deleteFromCloudinary(existing.filePath, 'raw');
      await existing.update({ filePath, originalName });
      return res.json({ success: true, data: existing });
    }

    const cv = await CV.create({ filePath, originalName });
    res.status(201).json({ success: true, data: cv });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer le CV
// @route   DELETE /api/cv
// @access  Public
const deleteCV = async (req, res, next) => {
  try {
    const cv = await CV.findOne();
    if (!cv) {
      return res.status(404).json({ success: false, message: 'Aucun CV à supprimer' });
    }
    await deleteFromCloudinary(cv.filePath, 'raw');
    await cv.destroy();
    res.json({ success: true, message: 'CV supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};

// @desc    Proxy de téléchargement — génère une URL signée Cloudinary et streame le PDF
// @route   GET /api/cv/download
// @access  Public
const downloadCV = async (req, res) => {
  try {
    const cv = await CV.findOne();
    if (!cv) return res.status(404).json({ message: 'Aucun CV trouvé' });

    // Extraire le public_id depuis l'URL Cloudinary stockée
    // URL format : https://res.cloudinary.com/<cloud>/raw/upload/v123/<public_id>.pdf
    const publicId =
      cv.filePath.match(/\/v\d+\/(.+)\.\w+$/)?.[1] || cv.filePath;

    console.log(`[downloadCV] public_id : ${publicId}`);

    // Générer une URL signée valable 60 secondes
    const signedUrl = cloudinary.utils.private_download_url(publicId, 'pdf', {
      resource_type: 'raw',
      expires_at: Math.floor(Date.now() / 1000) + 60,
    });

    console.log(`[downloadCV] URL signée générée`);

    // Headers pour forcer le téléchargement
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${cv.originalName || 'CV.pdf'}"`
    );

    // Streamer le fichier depuis Cloudinary vers le client
    https
      .get(signedUrl, (stream) => {
        stream.pipe(res);
      })
      .on('error', (err) => {
        console.error('[downloadCV] Erreur stream:', err.message);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Erreur lors du téléchargement' });
        }
      });
  } catch (error) {
    console.error('[downloadCV] Erreur serveur:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

module.exports = { getCV, uploadCV, deleteCV, downloadCV };
