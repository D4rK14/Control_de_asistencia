const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('asistencia', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

module.export = sequelize;

console.log('Hola mundo!');