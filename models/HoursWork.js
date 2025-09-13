const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

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
    },
},{timestamps: false});

module.exports = HoursWorking;