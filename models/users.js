const sequelize = require('../database/db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rut: {
        type: DataTypes.STRING,
        foreignKey: true
    },
    nombre:{
        type: DataTypes.STRING,
    },
    apellido:{
        type: DataTypes.STRING,
    },
    correo: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    id_rol: {
        type: DataTypes.INTEGER
    }
});

module.exports = User;