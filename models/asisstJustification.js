
const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const Asistencia = require('./assist');
const Justificacion = require('./justification');

const AsistenciaJustificacion = sequelize.define('asistencia_justificacion', {
    id_asistencia:{
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_justificacion:{
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, { timestamps: false });

AsistenciaJustificacion.belongsTo(Asistencia, {foreignKey: 'id_asistencia', as:'asistencia'});
Asistencia.hasMany(AsistenciaJustificacion, {foreignKey: 'id_asistencia', as:'justificaciones'});

AsistenciaJustificacion.belongsTo(Justificacion, {foreignKey: 'id_justificacion', as:'justificacion'});
Justificacion.hasMany(AsistenciaJustificacion, {foreignKey:'id_justificacion', as:'asistencias'});

module.exports = AsistenciaJustificacion;