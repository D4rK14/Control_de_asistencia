// models/EstadoAsistencia.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js'); // Asegúrate que database.js exporte `module.exports = sequelize;`

// Definición del modelo
const StateAssisting = sequelize.define('EstadoAsistencia', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    estado: {
        type: DataTypes.STRING,
    },
    descripcion: {
        type: DataTypes.STRING,
    },
}, { timestamps: false });

module.exports = StateAssisting;
