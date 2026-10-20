const Volunteering = require('../models/Volunteering');

const getAllVolunteerings = async (req, res, next) => {
  try {
    const items = await Volunteering.findAll({
      order: [
        ['order_index', 'ASC'],
        ['created_at', 'DESC'],
      ],
    });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

const getVolunteeringById = async (req, res, next) => {
  try {
    const item = await Volunteering.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Activité de bénévolat non trouvée' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const createVolunteering = async (req, res, next) => {
  try {
    const { title, organization, period, location, description, imageUrl, orderIndex } = req.body;
    const resolvedImage = req.file ? req.file.path : imageUrl || null;

    const item = await Volunteering.create({
      title,
      organization,
      period,
      location: location || 'Lomé, Togo',
      description: description || '',
      imageUrl: resolvedImage,
      orderIndex: orderIndex !== undefined ? Number(orderIndex) : 0,
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const updateVolunteering = async (req, res, next) => {
  try {
    const item = await Volunteering.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Activité de bénévolat non trouvée' });
    }

    const { title, organization, period, location, description, imageUrl, orderIndex } = req.body;
    if (title !== undefined) item.title = title;
    if (organization !== undefined) item.organization = organization;
    if (period !== undefined) item.period = period;
    if (location !== undefined) item.location = location;
    if (description !== undefined) item.description = description;
    if (orderIndex !== undefined) item.orderIndex = Number(orderIndex);

    if (req.file) {
      item.imageUrl = req.file.path;
    } else if (imageUrl !== undefined) {
      item.imageUrl = imageUrl || null;
    }

    await item.save();
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const deleteVolunteering = async (req, res, next) => {
  try {
    const item = await Volunteering.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Activité de bénévolat non trouvée' });
    }
    await item.destroy();
    res.json({ success: true, message: 'Activité de bénévolat supprimée' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVolunteerings,
  getVolunteeringById,
  createVolunteering,
  updateVolunteering,
  deleteVolunteering,
};
