const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Usuarios = sequelize.define('Usuarios', {
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    correo: DataTypes.STRING,
    contraseña: DataTypes.STRING
});