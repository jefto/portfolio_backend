const fs = require('fs');
const path = require('path');
const CV = require('../models/CV');

const deleteFile = (filePath) => {
  const fullPath = path.resolve(filePath);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
};

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

    const filePath = req.file.path.replace(/\\/g, '/');
    const originalName = req.file.originalname;

    // Supprimer l'ancien CV s'il existe
    const existing = await CV.findOne();
    if (existing) {
      deleteFile(existing.filePath);
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
    deleteFile(cv.filePath);
    await cv.destroy();
    res.json({ success: true, message: 'CV supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCV, uploadCV, deleteCV };

