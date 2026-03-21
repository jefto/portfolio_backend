const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Education = sequelize.define(
  'Education',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    startYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'start_year',
      validate: {
        notNull: { msg: "L'année de début est requise" },
        isInt: { msg: "L'année de début doit être un entier" },
      },
    },
    endYear: {
      type: DataTypes.INTEGER,
      allowNull: true, // null = "En cours"
      field: 'end_year',
      validate: {
        isInt: { msg: "L'année de fin doit être un entier" },
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Le titre est requis' },
      },
    },
    school: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le nom de l'établissement est requis" },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'educations',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Education;

