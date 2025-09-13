const sequelize = require('../database/db');
const { DataTypes } = require('sequelize');

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
});

module.exports = StateAssisting;