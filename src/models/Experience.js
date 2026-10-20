const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Experience = sequelize.define(
  'Experience',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Le titre du poste est requis' },
      },
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le nom de l'organisation ou entreprise est requis" },
      },
    },
    roleType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'HYBRID',
      field: 'role_type',
      validate: {
        isIn: {
          args: [['DEV', 'DESIGN', 'HYBRID', 'COMMUNITY']],
          msg: 'Le type de rôle doit être DEV, DESIGN, HYBRID ou COMMUNITY',
        },
      },
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'start_date',
      validate: {
        notEmpty: { msg: 'La date de début est requise' },
      },
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'end_date',
    },
    isCurrent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_current',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    achievements: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    metrics: {
      type: DataTypes.JSONB,
      defaultValue: {
        devWeight: 50,
        designWeight: 50,
        impactScore: 80,
        impactLabel: '',
      },
    },
    techStack: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      field: 'tech_stack',
    },
    designWorks: {
      type: DataTypes.JSONB,
      defaultValue: [],
      field: 'design_works',
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'order_index',
    },
  },
  {
    tableName: 'experiences',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Experience;
