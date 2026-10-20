const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Volunteering = sequelize.define(
  'Volunteering',
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
        notEmpty: { msg: "L'intitulé du rôle ou de l'activité est requis" },
      },
    },
    organization: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le nom de l'association ou organisation est requis" },
      },
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La période ou date est requise' },
      },
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Lomé, Togo',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'image_url',
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'order_index',
    },
  },
  {
    tableName: 'volunteerings',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Volunteering;
