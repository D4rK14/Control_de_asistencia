// models/Rol.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rol = sequelize.define('rols', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING },
    descripcion: { type: DataTypes.STRING }
}, { timestamps: false });

module.exports = Rol;
