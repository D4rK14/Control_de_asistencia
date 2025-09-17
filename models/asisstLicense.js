// modelo asistencia_Licencia
const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const LicenciaMedica = require('./lecense');
const Asistencia = require('./assist');

const AsistenciaLicencia = sequelize.define('asistencia_licencia', {
    id_asistencia:{
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_licencia:{
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, { timestamps: false });

AsistenciaLicencia.belongsTo(LicenciaMedica, {foreignKey: 'id_licencia', as:'licencia'});
LicenciaMedica.hasMany(AsistenciaLicencia, {foreignKey: 'id_licencia', as:'asistencias'});

AsistenciaLicencia.belongsTo(Asistencia, {foreignKey: 'id_asistencia', as:'asistencia'});
Asistencia.hasMany(AsistenciaLicencia, {foreignKey: 'id_asistencia', as:'licencias'});

module.exports = AsistenciaLicencia;