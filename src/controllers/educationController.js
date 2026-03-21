const Education = require('../models/Education');

// @desc    Récupérer tout le parcours académique
// @route   GET /api/educations
// @access  Public
const getAllEducations = async (req, res, next) => {
  try {
    const educations = await Education.findAll({ order: [['start_year', 'DESC']] });
    res.json({ success: true, count: educations.length, data: educations });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer une formation par ID
// @route   GET /api/educations/:id
// @access  Public
const getEducationById = async (req, res, next) => {
  try {
    const education = await Education.findByPk(req.params.id);
    if (!education) {
      return res.status(404).json({ success: false, message: 'Formation non trouvée' });
    }
    res.json({ success: true, data: education });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer une formation
// @route   POST /api/educations
// @access  Protégé
const createEducation = async (req, res, next) => {
  try {
    const { startYear, endYear, title, school, description } = req.body;
    const education = await Education.create({
      startYear,
      endYear: endYear === null || endYear === '' ? null : endYear,
      title,
      school,
      description,
    });
    res.status(201).json({ success: true, data: education });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour une formation
// @route   PUT /api/educations/:id
// @access  Protégé
const updateEducation = async (req, res, next) => {
  try {
    const education = await Education.findByPk(req.params.id);
    if (!education) {
      return res.status(404).json({ success: false, message: 'Formation non trouvée' });
    }

    const { startYear, endYear, title, school, description } = req.body;
    const updateData = {};
    if (startYear !== undefined) updateData.startYear = startYear;
    if (endYear !== undefined) updateData.endYear = endYear === null || endYear === '' ? null : endYear;
    if (title !== undefined) updateData.title = title;
    if (school !== undefined) updateData.school = school;
    if (description !== undefined) updateData.description = description;

    await education.update(updateData);
    res.json({ success: true, data: education });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer une formation
// @route   DELETE /api/educations/:id
// @access  Protégé
const deleteEducation = async (req, res, next) => {
  try {
    const education = await Education.findByPk(req.params.id);
    if (!education) {
      return res.status(404).json({ success: false, message: 'Formation non trouvée' });
    }
    await education.destroy();
    res.json({ success: true, message: 'Formation supprimée avec succès' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllEducations, getEducationById, createEducation, updateEducation, deleteEducation };

