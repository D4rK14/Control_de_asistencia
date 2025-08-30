const sequelize = require('../database/db');

const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username:{
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    rol: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.BOOLEAN
    },
    date: {
        type: DataTypes.DATE,
        notNull: true
    }
});