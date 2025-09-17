const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("../models/User");

const LicenciaMedica = sequelize.define('licencia medica', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER
    },
    folio:{
        type: DataTypes.STRING
    },
    fecha_emicion: {
        type: DataTypes.DATE
    },
    fecha_inicio: {
        type: DataTypes.DATE
    },
    fecha_fin: {
        type: DataTypes.DATE
    },
    dias_reposo:{
        type: DataTypes.INTEGER
    },
    diagnostico:{
        type: DataTypes.STRING
    },
    medico_tratante:{
        type: DataTypes.STRING
    },
    archivo:{
        type: DataTypes.STRING
    },
    tipo_licencia:{
        type: DataTypes.STRING
    }
}, { timestamps: false });

LicenciaMedica.belongsTo(User, {foreignKey: 'id_usuario', as: 'usuario'});
User.hasMany(LicenciaMedica, { foreignKey: 'id_usuario', as: 'licencias'});

module.exports = LicenciaMedica;
