
const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const CategoriaAsistencia = sequelize.define('categoria_asistencia', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre:{
        type: DataTypes.STRING
    },
    descripcion:{
        type: DataTypes.STRING
    }
}, { timestamps: false });

module.exports = CategoriaAsistencia;