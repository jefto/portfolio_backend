const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Singleton : une seule ligne en base contenant toutes les stats du portfolio
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
  },
  {
    tableName: 'statistics',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Statistic;

