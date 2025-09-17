
const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Justificacion = sequelize.define('justificacion_comun', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER
    },
    fecha_solicitud: {
        type: DataTypes.DATE
    },
    fecha_inicio: {
        type: DataTypes.DATE
    },
    fecha_fin:{
        type: DataTypes.DATE
    },
    motivo:{
        type: DataTypes.STRING
    },
    archivo:{
        type: DataTypes.STRING
    },
    estado:{
        type: DataTypes.STRING
    }
}, { timestamps: false });

Justificacion.belongsTo(User, {foreignKey: 'id_usuario', as: 'usuario'});
User.hasMany(Justificacion, { foreignKey: 'id_usuario', as: 'justificaciones'});

module.exports = Justificacion;