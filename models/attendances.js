const sequelize = require('../database/db');
const { DataTypes } = require('sequelize');

const Attendances = sequelize.define('Attendances', {
    id: {
        type: DataTypes.INTEGER,
    },
    userId: {
        type: DataTypes.INTEGER,
    },
    checkIn: {
        type: DataTypes.DATE,
    },
    checkOut: {
        type: DataTypes.DATE,
    }
});

module.exports = Attendances;