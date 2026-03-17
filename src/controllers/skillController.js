const Skill = require('../models/Skill');

// @desc    Récupérer toutes les compétences
// @route   GET /api/skills
// @access  Public
const getAllSkills = async (req, res, next) => {
  try {
    const { category, type } = req.query;
    const where = {};
    if (category) where.category = category;
    if (type) where.type = type;

    const skills = await Skill.findAll({ where, order: [['level', 'DESC']] });
    res.json({ success: true, count: skills.length, data: skills });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer une compétence par ID
// @route   GET /api/skills/:id
// @access  Public
const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Compétence non trouvée' });
    }
    res.json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer une compétence
// @route   POST /api/skills
// @access  Public
const createSkill = async (req, res, next) => {
  try {
    const { name, level, category, type } = req.body;
    const skill = await Skill.create({ name, level, category, type });
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour une compétence
// @route   PUT /api/skills/:id
// @access  Public
const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Compétence non trouvée' });
    }

    const { name, level, category, type } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (level !== undefined) updateData.level = level;
    if (category !== undefined) updateData.category = category;
    if (type !== undefined) updateData.type = type;

    await skill.update(updateData);
    res.json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer une compétence
// @route   DELETE /api/skills/:id
// @access  Public
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Compétence non trouvée' });
    }
    await skill.destroy();
    res.json({ success: true, message: 'Compétence supprimée avec succès' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllSkills, getSkillById, createSkill, updateSkill, deleteSkill };

