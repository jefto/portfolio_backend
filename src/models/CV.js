const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Une seule ligne en base — le CV actuel
const CV = sequelize.define(
  'CV',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'file_path',
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'original_name',
    },
  },
  {
    tableName: 'cv',
    timestamps: true,
    underscored: true,
  }
);

module.exports = CV;

