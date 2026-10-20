const Experience = require('../models/Experience');

const parseArrayField = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return trimmed
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const parseJsonField = (val, fallback) => {
  if (val && typeof val === 'object') return val;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return fallback;
};

const getAllExperiences = async (req, res, next) => {
  try {
    const experiences = await Experience.findAll({
      order: [
        ['order_index', 'ASC'],
        ['created_at', 'DESC'],
      ],
    });
    res.json({ success: true, count: experiences.length, data: experiences });
  } catch (error) {
    next(error);
  }
};

const getExperienceById = async (req, res, next) => {
  try {
    const experience = await Experience.findByPk(req.params.id);
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Expérience non trouvée' });
    }
    res.json({ success: true, data: experience });
  } catch (error) {
    next(error);
  }
};

const createExperience = async (req, res, next) => {
  try {
    const {
      title,
      company,
      roleType,
      startDate,
      endDate,
      isCurrent,
      description,
      achievements,
      metrics,
      techStack,
      designWorks,
      orderIndex,
    } = req.body;

    const parsedCurrent = isCurrent === true || isCurrent === 'true';
    const parsedMetrics = parseJsonField(metrics, {
      devWeight: 50,
      designWeight: 50,
      impactScore: 80,
      impactLabel: '',
    });

    let works = parseJsonField(designWorks, []);
    if (!Array.isArray(works)) works = [];

    const uploadedFiles = req.files || [];
    if (uploadedFiles.length > 0) {
      uploadedFiles.forEach((file, idx) => {
        const targetWork = works.find((w) => Number(w.uploadIndex) === idx);
        if (targetWork) {
          targetWork.imageUrl = file.path;
          delete targetWork.uploadIndex;
        } else {
          works.push({
            title: file.originalname.replace(/\.[^/.]+$/, ''),
            category: 'Visuel / Design',
            imageUrl: file.path,
            link: '',
          });
        }
      });
    }

    const experience = await Experience.create({
      title,
      company,
      roleType: roleType || 'HYBRID',
      startDate,
      endDate: parsedCurrent || !endDate ? null : endDate,
      isCurrent: parsedCurrent,
      description: description || '',
      achievements: parseArrayField(achievements),
      metrics: parsedMetrics,
      techStack: parseArrayField(techStack),
      designWorks: works,
      orderIndex: orderIndex !== undefined && orderIndex !== '' ? parseInt(orderIndex, 10) : 0,
    });

    res.status(201).json({ success: true, data: experience });
  } catch (error) {
    next(error);
  }
};

const updateExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findByPk(req.params.id);
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Expérience non trouvée' });
    }

    const {
      title,
      company,
      roleType,
      startDate,
      endDate,
      isCurrent,
      description,
      achievements,
      metrics,
      techStack,
      designWorks,
      orderIndex,
    } = req.body;

    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (company !== undefined) updateData.company = company;
    if (roleType !== undefined) updateData.roleType = roleType;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (isCurrent !== undefined) {
      updateData.isCurrent = isCurrent === true || isCurrent === 'true';
    }
    if (endDate !== undefined) {
      updateData.endDate = updateData.isCurrent || !endDate ? null : endDate;
    }
    if (description !== undefined) updateData.description = description;
    if (achievements !== undefined) updateData.achievements = parseArrayField(achievements);
    if (metrics !== undefined) {
      updateData.metrics = parseJsonField(metrics, experience.metrics);
    }
    if (techStack !== undefined) updateData.techStack = parseArrayField(techStack);
    if (orderIndex !== undefined && orderIndex !== '') {
      updateData.orderIndex = parseInt(orderIndex, 10);
    }

    if (designWorks !== undefined || (req.files && req.files.length > 0)) {
      let works =
        designWorks !== undefined
          ? parseJsonField(designWorks, experience.designWorks || [])
          : [...(experience.designWorks || [])];

      if (!Array.isArray(works)) works = [];

      const uploadedFiles = req.files || [];
      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach((file, idx) => {
          const targetWork = works.find((w) => Number(w.uploadIndex) === idx);
          if (targetWork) {
            targetWork.imageUrl = file.path;
            delete targetWork.uploadIndex;
          } else {
            works.push({
              title: file.originalname.replace(/\.[^/.]+$/, ''),
              category: 'Visuel / Design',
              imageUrl: file.path,
              link: '',
            });
          }
        });
      }
      updateData.designWorks = works;
    }

    await experience.update(updateData);
    res.json({ success: true, data: experience });
  } catch (error) {
    next(error);
  }
};

const deleteExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findByPk(req.params.id);
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Expérience non trouvée' });
    }
    await experience.destroy();
    res.json({ success: true, message: 'Expérience supprimée avec succès' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
};
