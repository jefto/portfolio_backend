const { Readable } = require('stream');
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

// @desc    Proxy de téléchargement du CV — force le download en contournant la restriction CORS cross-origin
// @route   GET /api/cv/download
// @access  Public
const downloadCV = async (req, res, next) => {
  try {
    const cv = await CV.findOne();
    if (!cv) {
      return res.status(404).json({ success: false, message: 'Aucun CV disponible' });
    }

    let fileUrl = cv.filePath;
    console.log(`[downloadCV] URL stockée en base : ${fileUrl}`);

    // ── Correction automatique de l'URL Cloudinary ─────────────────────────
    // Si l'URL a été uploadée avec resource_type 'image' ou 'auto' au lieu de 'raw',
    // on tente de corriger le chemin pour utiliser /raw/upload/
    if (fileUrl && fileUrl.includes('cloudinary.com') && !fileUrl.includes('/raw/upload/')) {
      const fixedUrl = fileUrl
        .replace('/image/upload/', '/raw/upload/')
        .replace('/video/upload/', '/raw/upload/')
        .replace('/auto/upload/', '/raw/upload/');
      console.log(`[downloadCV] URL corrigée (resource_type raw) : ${fixedUrl}`);
      fileUrl = fixedUrl;
    }

    // ── Récupérer le PDF depuis Cloudinary côté serveur ────────────────────
    let cloudinaryResponse;
    try {
      cloudinaryResponse = await fetch(fileUrl);
      console.log(`[downloadCV] Réponse Cloudinary : ${cloudinaryResponse.status} ${cloudinaryResponse.statusText}`);
    } catch (fetchErr) {
      console.error(`[downloadCV] Erreur fetch : ${fetchErr.message}`);
      // Fallback : rediriger directement vers l'URL Cloudinary
      return res.redirect(cv.filePath);
    }

    if (!cloudinaryResponse.ok) {
      console.error(`[downloadCV] Cloudinary a retourné ${cloudinaryResponse.status} pour : ${fileUrl}`);
      // Fallback : rediriger directement vers l'URL originale stockée
      // (le navigateur ouvrira le PDF dans un nouvel onglet)
      return res.redirect(cv.filePath);
    }

    const fileName = cv.originalName || 'CV.pdf';

    // ── Headers qui forcent le téléchargement dans tous les navigateurs ─────
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(fileName)}"; filename*=UTF-8''${encodeURIComponent(fileName)}`
    );
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');

    // ── Pipe le stream Cloudinary → réponse Express ─────────────────────────
    const nodeStream = Readable.fromWeb(cloudinaryResponse.body);
    nodeStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCV, uploadCV, deleteCV, downloadCV };
