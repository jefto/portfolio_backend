const { Readable } = require('stream');
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

// @desc    Proxy de téléchargement du CV — force le download en contournant la restriction CORS cross-origin
// @route   GET /api/cv/download
// @access  Public
const downloadCV = async (req, res, next) => {
  try {
    const cv = await CV.findOne();
    if (!cv) {
      return res.status(404).json({ success: false, message: 'Aucun CV disponible' });
    }

    const storedUrl = cv.filePath;
    console.log(`[downloadCV] URL stockée : ${storedUrl}`);

    // ── Construire l'URL de fetch ──────────────────────────────────────────
    // Si l'URL est sur Cloudinary, on génère une URL signée (contourne le 401
    // même si le fichier est privé / accès restreint).
    let fetchUrl = storedUrl;

    if (storedUrl && storedUrl.includes('cloudinary.com')) {
      try {
        // Extraire le public_id depuis l'URL :
        // ex: https://res.cloudinary.com/xxx/raw/upload/v123/portfolio/cv/cv-xxx.pdf
        const parts = storedUrl.split('/upload/');
        if (parts[1]) {
          // Retirer le préfixe de version (v123456/) et l'extension
          const publicId = parts[1]
            .replace(/^v\d+\//, '')   // enlève "v1234567890/"
            .replace(/\.pdf$/i, '');  // enlève ".pdf" (Cloudinary stocke sans extension)

          console.log(`[downloadCV] public_id extrait : ${publicId}`);

          // URL signée valable 10 minutes
          fetchUrl = cloudinary.utils.private_download_url(publicId, 'pdf', {
            resource_type: 'raw',
            expires_at: Math.floor(Date.now() / 1000) + 600,
          });

          console.log(`[downloadCV] URL signée générée`);
        }
      } catch (signErr) {
        console.error(`[downloadCV] Impossible de générer l'URL signée : ${signErr.message}`);
        // On continue avec l'URL brute stockée
      }
    }

    // ── Fetch côté serveur ────────────────────────────────────────────────
    let cloudinaryResponse;
    try {
      cloudinaryResponse = await fetch(fetchUrl);
      console.log(`[downloadCV] Statut Cloudinary : ${cloudinaryResponse.status}`);
    } catch (fetchErr) {
      console.error(`[downloadCV] Erreur réseau : ${fetchErr.message}`);
      return res.redirect(storedUrl); // fallback : rediriger vers l'URL brute
    }

    if (!cloudinaryResponse.ok) {
      console.error(`[downloadCV] Échec fetch : ${cloudinaryResponse.status} — URL : ${fetchUrl}`);
      // Dernier recours : rediriger vers l'URL Cloudinary directe
      return res.redirect(storedUrl);
    }

    const fileName = cv.originalName || 'CV.pdf';

    // ── Headers qui forcent le téléchargement dans tous les navigateurs ───
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(fileName)}"; filename*=UTF-8''${encodeURIComponent(fileName)}`
    );
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');

    // ── Pipe le stream Cloudinary → réponse Express ──────────────────────
    const nodeStream = Readable.fromWeb(cloudinaryResponse.body);
    nodeStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCV, uploadCV, deleteCV, downloadCV };
