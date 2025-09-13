const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const StateAssisting = sequelize.define('EstadoAsistencia', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    estado: {
        type: DataTypes.STRING,
    },
    descripcion:{
        type: DataTypes.STRING,
    }
},{timestamps: false});

module.exports = StateAssisting;