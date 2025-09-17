
const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const EstadoAsistencia = require('./StateAssist');
const CategoriaAsistencia = require('./assistCategory');

const asistencia = sequelize.define('asistencia', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER
    },
    fecha:{
        type: DataTypes.DATE
    },
    hora_entrada:{
        type: DataTypes.TIME
    },
    hora_salida:{
        type: DataTypes.TIME
    },
    id_estado:{
        type: DataTypes.INTEGER
    },
    id_categoria:{
        type: DataTypes.INTEGER
    }
}, { timestamps: false });

asistencia.belongsTo(User, {foreignKey: 'id_usuario', as:'asistencias'});
User.hasMany(asistencia, {foreignKey:'id_usuario', as:'usuario'});

asistencia.belongsTo(EstadoAsistencia, {foreignKey: 'id_estado', as:'asistencia'});
EstadoAsistencia.hasMany(asistencia, {foreignKey: 'id_estado', as:'usuarios'});

asistencia.belongsTo(CategoriaAsistencia, {foreignKey: 'id_categoria', as:'assist'});
CategoriaAsistencia.hasMany(asistencia, {foreignKey: 'id_categoria', as:'users'})

module.exports = asistencia;