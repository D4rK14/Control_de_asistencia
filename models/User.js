const sequelize = require('../database/db');

const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    id: DataTypes.INTEGER,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    rol: DataTypes.STRING,
    state: DataTypes.BOOLEAN,
    date: DataTypes.DATE
});