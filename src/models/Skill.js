const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Skill = sequelize.define(
  'Skill',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Le nom de la compétence est requis' },
      },
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'Le niveau doit être entre 0 et 100' },
        max: { args: [100], msg: 'Le niveau doit être entre 0 et 100' },
        notNull: { msg: 'Le niveau de maîtrise est requis' },
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['dev', 'design']],
          msg: 'La catégorie doit être "dev" ou "design"',
        },
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['langage-de-programmation', 'framework', 'base-de-donnee', 'outil', 'prototypage', 'design', '3d']],
          msg: 'Le type doit être parmi : langage-de-programmation, framework, base-de-donnee, outil, prototypage, design, 3d',
        },
      },
    },
  },
  {
    tableName: 'skills',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Skill;

