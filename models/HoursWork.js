const sequelize = require('../database/db');
const { DataTypes } = require('sequelize');

const HoursWorking = sequelize.define('HorasTrabajadas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    entrada: {
        type: DataTypes.STRING,
    },
    salida: {
        type: DataTypes.STRING,
    }
});

module.exports = HoursWorking;