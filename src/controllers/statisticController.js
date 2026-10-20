const Statistic = require('../models/Statistic');

// @desc    Récupérer les statistiques, coordonnées et photo hero (singleton)
// @route   GET /api/statistics
// @access  Public
const getStatistics = async (req, res, next) => {
  try {
    let stats = await Statistic.findOne();
    if (!stats) {
      stats = await Statistic.create({});
    }
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour les statistiques, coordonnées de contact et cadrage de la photo
// @route   PUT /api/statistics
// @access  Protégé
const updateStatistics = async (req, res, next) => {
  try {
    let stats = await Statistic.findOne();
    if (!stats) {
      stats = await Statistic.create({});
    }

    const {
      completedProjects,
      yearsExperience,
      masteredTechnologies,
      mockupsCreated,
      postersDesigned,
      masteredSoftware,
      contactPhone,
      contactEmail,
      contactLocation,
      heroPhotoUrl,
      heroPhotoScale,
      heroPhotoX,
      heroPhotoY,
    } = req.body;

    const updateData = {};
    if (completedProjects !== undefined) updateData.completedProjects = completedProjects;
    if (yearsExperience !== undefined) updateData.yearsExperience = yearsExperience;
    if (masteredTechnologies !== undefined) updateData.masteredTechnologies = masteredTechnologies;
    if (mockupsCreated !== undefined) updateData.mockupsCreated = mockupsCreated;
    if (postersDesigned !== undefined) updateData.postersDesigned = postersDesigned;
    if (masteredSoftware !== undefined) updateData.masteredSoftware = masteredSoftware;
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone;
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
    if (contactLocation !== undefined) updateData.contactLocation = contactLocation;

    // Cadrage et photo Hero Section
    if (heroPhotoUrl !== undefined) updateData.heroPhotoUrl = heroPhotoUrl;
    if (heroPhotoScale !== undefined) updateData.heroPhotoScale = parseFloat(heroPhotoScale);
    if (heroPhotoX !== undefined) updateData.heroPhotoX = parseFloat(heroPhotoX);
    if (heroPhotoY !== undefined) updateData.heroPhotoY = parseFloat(heroPhotoY);

    await stats.update(updateData);
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

// @desc    Uploader une nouvelle photo pour la Hero Section vers Cloudinary
// @route   POST /api/statistics/hero-photo
// @access  Protégé
const uploadHeroPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucun fichier image fourni' });
    }

    let stats = await Statistic.findOne();
    if (!stats) {
      stats = await Statistic.create({});
    }

    const heroPhotoUrl = req.file.path; // Cloudinary secure URL
    await stats.update({ heroPhotoUrl });

    res.json({
      success: true,
      data: {
        heroPhotoUrl,
        heroPhotoScale: stats.heroPhotoScale,
        heroPhotoX: stats.heroPhotoX,
        heroPhotoY: stats.heroPhotoY,
      },
      message: 'Photo de la Hero Section uploadée avec succès sur Cloudinary',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStatistics, updateStatistics, uploadHeroPhoto };
