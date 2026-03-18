const https = require('https');
const CV = require('../models/CV');
const { deleteFromCloudinary } = require('../config/cloudinary');

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

// @desc    Proxy de téléchargement — stream direct depuis l'URL publique normalisée
// @route   GET /api/cv/download
// @access  Public
const downloadCV = async (req, res) => {
  try {
    const cv = await CV.findOne();
    if (!cv) {
      return res.status(404).json({ message: 'Aucun CV trouvé' });
    }

    // Normaliser l'URL : remplacer /authenticated/ ou /private/ par /upload/
    // et supprimer le token de signature s--xxx--
    let publicUrl = cv.filePath
      .replace(/\/(authenticated|private)\//, '/upload/')
      .replace(/\/s--[^/]+--\//, '/');


    const filename = encodeURIComponent(cv.originalName || 'CV.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${filename}`);
    res.setHeader('Cache-Control', 'no-cache');

    const request = https.get(publicUrl, (response) => {

      if (response.statusCode !== 200) {
        let body = '';
        response.on('data', c => { body += c; });
        response.on('end', () => {
          console.error(`[downloadCV] Erreur Cloudinary : ${body}`);
          if (!res.headersSent) {
            res.status(502).json({
              message: `Cloudinary a répondu ${response.statusCode}`,
              urlTentee: publicUrl,
              detail: body,
            });
          }
        });
        return;
      }

      if (response.headers['content-length']) {
        res.setHeader('Content-Length', response.headers['content-length']);
      }

      response.pipe(res);

      response.on('error', (err) => {
        if (!res.headersSent) res.status(500).end();
      });
    });

    request.on('error', (err) => {
      if (!res.headersSent) res.status(500).json({ message: err.message });
    });

    request.setTimeout(30000, () => {
      request.destroy();
      if (!res.headersSent) res.status(504).json({ message: 'Timeout' });
    });

  } catch (error) {
    if (!res.headersSent) res.status(500).json({ message: error.message });
  }
};

module.exports = { getCV, uploadCV, deleteCV, downloadCV };
