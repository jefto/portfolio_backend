const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Project = sequelize.define(
  'Project',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'cover_image',
      validate: {
        notEmpty: { msg: 'La photo de couverture est requise' },
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Le titre est requis' },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La description est requise' },
      },
    },
    technologies: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    client: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['projet-dev', 'projet-design']],
          msg: 'La catégorie doit être "projet-dev" ou "projet-design"',
        },
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['maquette', 'affiche', 'frontend', 'backend', 'fullstack', 'mobile', 'desktop']],
          msg: 'Le type doit être parmi : maquette, affiche, frontend, backend, fullstack, mobile, desktop',
        },
      },
    },
    link: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    screenshots: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  },
  {
    tableName: 'projects',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Project;
