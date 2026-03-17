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

// @desc    Proxy de téléchargement — URL signée SDK Cloudinary (type authenticated)
// @route   GET /api/cv/download
// @access  Public
const downloadCV = async (req, res) => {
  try {
    const cv = await CV.findOne();
    if (!cv) {
      return res.status(404).json({ message: 'Aucun CV trouvé' });
    }

    console.log(`[downloadCV] filePath en base : ${cv.filePath}`);

    // Extraire le public_id depuis l'URL
    const uploadIndex = cv.filePath.indexOf('/upload/');
    if (uploadIndex === -1) {
      return res.status(500).json({ message: 'URL invalide', filePath: cv.filePath });
    }
    let afterUpload = cv.filePath.substring(uploadIndex + 8);
    afterUpload = afterUpload.replace(/^v\d+\//, '');
    const publicId = afterUpload.replace(/\.[^/.]+$/, '');

    console.log(`[downloadCV] public_id : ${publicId}`);

    // Générer une URL signée valable 60 secondes avec les credentials API
    const signedUrl = cloudinary.url(publicId, {
      resource_type: 'raw',
      type: 'authenticated',
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 60,
    });

    console.log(`[downloadCV] URL signée : ${signedUrl}`);

    const filename = encodeURIComponent(cv.originalName || 'CV.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${filename}`);
    res.setHeader('Cache-Control', 'no-cache');

    const request = https.get(signedUrl, (response) => {
      console.log(`[downloadCV] Cloudinary status : ${response.statusCode}`);

      if (response.statusCode !== 200) {
        let body = '';
        response.on('data', chunk => { body += chunk; });
        response.on('end', () => {
          console.error(`[downloadCV] Erreur body : ${body}`);
          if (!res.headersSent) {
            res.status(502).json({ message: `Cloudinary ${response.statusCode}`, detail: body });
          }
        });
        return;
      }

      if (response.headers['content-length']) {
        res.setHeader('Content-Length', response.headers['content-length']);
      }

      response.pipe(res);

      response.on('error', (err) => {
        console.error('[downloadCV] Stream error :', err.message);
        if (!res.headersSent) res.status(500).end();
      });
    });

    request.on('error', (err) => {
      console.error('[downloadCV] Request error :', err.message);
      if (!res.headersSent) res.status(500).json({ message: err.message });
    });

    request.setTimeout(30000, () => {
      request.destroy();
      if (!res.headersSent) res.status(504).json({ message: 'Timeout' });
    });

  } catch (error) {
    console.error('[downloadCV] Erreur serveur :', error.message);
    if (!res.headersSent) res.status(500).json({ message: error.message });
  }
};

module.exports = { getCV, uploadCV, deleteCV, downloadCV };
