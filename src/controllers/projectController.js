const Project = require('../models/Project');
const { deleteFromCloudinary } = require('../config/cloudinary');

// @desc    Récupérer tous les projets
// @route   GET /api/projects
// @access  Public
const getAllProjects = async (req, res, next) => {
  try {
    const { category, type } = req.query;
    const where = {};
    if (category) where.category = category;
    if (type) where.type = type;

    const projects = await Project.findAll({
      where,
      order: [['date', 'DESC']],
    });

    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer un projet par ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un nouveau projet
// @route   POST /api/projects
// @access  Public
const createProject = async (req, res, next) => {
  try {
    const { title, description, technologies, client, date, category, type, link } = req.body;

    // Cloudinary retourne l'URL dans req.file.path
    const coverImage = req.files?.coverImage?.[0]?.path || '';
    const screenshots = req.files?.screenshots?.map((f) => f.path) || [];

    // Parser technologies si envoyé en JSON string
    let techArray = technologies;
    if (typeof technologies === 'string') {
      try {
        techArray = JSON.parse(technologies);
      } catch {
        techArray = technologies.split(',').map((t) => t.trim());
      }
    }

    const project = await Project.create({
      coverImage,
      title,
      description,
      technologies: techArray || [],
      client,
      date,
      category,
      type,
      link,
      screenshots,
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un projet
// @route   PUT /api/projects/:id
// @access  Public
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    }

    const { title, description, technologies, client, date, category, type, link } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (client !== undefined) updateData.client = client;
    if (date !== undefined) updateData.date = date;
    if (category !== undefined) updateData.category = category;
    if (type !== undefined) updateData.type = type;
    if (link !== undefined) updateData.link = link;

    // Parser technologies
    if (technologies !== undefined) {
      if (typeof technologies === 'string') {
        try {
          updateData.technologies = JSON.parse(technologies);
        } catch {
          updateData.technologies = technologies.split(',').map((t) => t.trim());
        }
      } else {
        updateData.technologies = technologies;
      }
    }

    // Nouvelle cover image → supprimer l'ancienne de Cloudinary
    if (req.files?.coverImage?.[0]) {
      if (project.coverImage) await deleteFromCloudinary(project.coverImage);
      updateData.coverImage = req.files.coverImage[0].path;
    }

    // Nouvelles screenshots → supprimer les anciennes de Cloudinary
    if (req.files?.screenshots?.length) {
      for (const s of project.screenshots) {
        await deleteFromCloudinary(s);
      }
      updateData.screenshots = req.files.screenshots.map((f) => f.path);
    }

    await project.update(updateData);

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un projet
// @route   DELETE /api/projects/:id
// @access  Public
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    }

    // Supprimer les fichiers de Cloudinary
    if (project.coverImage) await deleteFromCloudinary(project.coverImage);
    for (const s of project.screenshots) {
      await deleteFromCloudinary(s);
    }

    await project.destroy();

    res.json({ success: true, message: 'Projet supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
