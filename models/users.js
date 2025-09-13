const sequelize = require('../database/db');
const { DataTypes } = require('sequelize');
const Rol = require('./Rol');

const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rut: {
        type: DataTypes.STRING,
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
    },
},{timestamps: false});

User.belongsTo(Rol, {
    foreignKey: 'id_rol',
    as: 'rol'
});

Rol.hasMany(User, {
    foreignKey: 'id_rol',
    as: 'usuarios'
});

module.exports = User;