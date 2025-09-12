const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Rol = sequelize.define('Usuarios', {
    id: {
        Type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        Type: DataTypes.STRING,
    },
    descripcion: {
        Type: DataTypes.STRING,
    }
});

module.exports = Rol;