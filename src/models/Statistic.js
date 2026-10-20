const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Singleton : une seule ligne en base contenant toutes les stats, coordonnées et photo du hero
const Statistic = sequelize.define(
  'Statistic',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // --- Page Développement ---
    completedProjects: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'completed_projects',
      validate: { min: 0 },
    },
    yearsExperience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'years_experience',
      validate: { min: 0 },
    },
    masteredTechnologies: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'mastered_technologies',
      validate: { min: 0 },
    },
    // --- Page Design ---
    mockupsCreated: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'mockups_created',
      validate: { min: 0 },
    },
    postersDesigned: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'posters_designed',
      validate: { min: 0 },
    },
    masteredSoftware: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'mastered_software',
      validate: { min: 0 },
    },
    // --- Coordonnées de Contact (Modifiables depuis le Back-Office) ---
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '+228 91 02 01 71',
      field: 'contact_phone',
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'jefftchamie@gmail.com',
      field: 'contact_email',
    },
    contactLocation: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Lomé, Togo',
      field: 'contact_location',
    },
    // --- Photo de la Hero Section & Paramètres de Cadrage ---
    heroPhotoUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      field: 'hero_photo_url',
    },
    heroPhotoScale: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1.0,
      field: 'hero_photo_scale',
    },
    heroPhotoX: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
      field: 'hero_photo_x',
    },
    heroPhotoY: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
      field: 'hero_photo_y',
    },
  },
  {
    tableName: 'statistics',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Statistic;
