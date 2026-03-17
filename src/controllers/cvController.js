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
    if (!cv) {
      return res.status(404).json({ message: 'Aucun CV trouvé' });
    }

    // Extraire le public_id — gère tous les formats Cloudinary possibles :
    // https://res.cloudinary.com/cloud/raw/upload/v123/portfolio/cv/cv-xxx.pdf
    // https://res.cloudinary.com/cloud/raw/upload/portfolio/cv/cv-xxx.pdf
    // https://res.cloudinary.com/cloud/image/upload/v123/portfolio/cv/cv-xxx.pdf
    let publicId;
    try {
      const uploadIndex = cv.filePath.indexOf('/upload/');
      if (uploadIndex === -1) throw new Error('pas de /upload/ dans URL');

      let afterUpload = cv.filePath.substring(uploadIndex + 8); // +8 = longueur de '/upload/'

      // Enlever le préfixe de version si présent (v1234567890/)
      afterUpload = afterUpload.replace(/^v\d+\//, '');

      // Enlever l'extension du fichier
      publicId = afterUpload.replace(/\.[^/.]+$/, '');

      console.log(`[downloadCV] filePath en base : ${cv.filePath}`);
      console.log(`[downloadCV] public_id extrait : ${publicId}`);

    } catch (e) {
      console.error('[downloadCV] Impossible d\'extraire public_id :', e.message);
      return res.status(500).json({
        message: 'URL CV invalide en base de données',
        filePath: cv.filePath,
      });
    }

    // Générer URL signée via l'API Cloudinary (valable 5 minutes)
    const signedUrl = cloudinary.utils.private_download_url(publicId, 'pdf', {
      resource_type: 'raw',
      expires_at: Math.floor(Date.now() / 1000) + 300,
    });

    console.log(`[downloadCV] URL signée générée`);

    // Headers AVANT tout stream
    const filename = encodeURIComponent(cv.originalName || 'CV.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${filename}`);
    res.setHeader('Cache-Control', 'no-cache');

    // Stream depuis Cloudinary vers le client via https natif
    const request = https.get(signedUrl, (response) => {
      // Vérifier que Cloudinary répond bien 200
      if (response.statusCode !== 200) {
        console.error(`[downloadCV] Cloudinary status : ${response.statusCode}`);
        if (!res.headersSent) {
          res.status(502).json({ message: 'Erreur récupération fichier Cloudinary' });
        }
        return;
      }

      // Propager Content-Length si disponible (évite la troncature du fichier)
      if (response.headers['content-length']) {
        res.setHeader('Content-Length', response.headers['content-length']);
      }

      // Pipe propre : Cloudinary → client
      response.pipe(res);

      response.on('error', (err) => {
        console.error('[downloadCV] Erreur stream :', err.message);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Erreur stream' });
        }
      });
    });

    request.on('error', (err) => {
      console.error('[downloadCV] Erreur connexion :', err.message);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Erreur connexion Cloudinary' });
      }
    });

    // Timeout 30 secondes pour éviter les connexions ouvertes indéfiniment
    request.setTimeout(30000, () => {
      request.destroy();
      if (!res.headersSent) {
        res.status(504).json({ message: 'Timeout téléchargement' });
      }
    });

  } catch (error) {
    console.error('[downloadCV] Erreur serveur :', error.message);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = { getCV, uploadCV, deleteCV, downloadCV };
