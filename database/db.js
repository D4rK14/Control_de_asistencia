const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

module.export = sequelize;