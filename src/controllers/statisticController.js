const Statistic = require('../models/Statistic');

// @desc    Récupérer les statistiques (singleton — crée un enregistrement par défaut si vide)
// @route   GET /api/statistics
// @access  Public
const getStatistics = async (req, res, next) => {
  try {
    let stats = await Statistic.findOne();
    if (!stats) {
      // Créer l'enregistrement par défaut
      stats = await Statistic.create({});
    }
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour les statistiques
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
    } = req.body;

    const updateData = {};
    if (completedProjects !== undefined) updateData.completedProjects = completedProjects;
    if (yearsExperience !== undefined) updateData.yearsExperience = yearsExperience;
    if (masteredTechnologies !== undefined) updateData.masteredTechnologies = masteredTechnologies;
    if (mockupsCreated !== undefined) updateData.mockupsCreated = mockupsCreated;
    if (postersDesigned !== undefined) updateData.postersDesigned = postersDesigned;
    if (masteredSoftware !== undefined) updateData.masteredSoftware = masteredSoftware;

    await stats.update(updateData);
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStatistics, updateStatistics };

