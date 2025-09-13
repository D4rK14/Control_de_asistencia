const User = require('../models/users');
const Rol = require('../models/Rol');
const StateAssisting = require('../models/StateAssist');
const HoursWorking = require('../models/HoursWork');

//Ver todos los usuarios
exports.ObtenerTodosLosUsuarios = async (req,res) => {
    try{
        const empleados = await User.findAll();
        const EmpleadosPlanosXD = empleados.map(users => users.get({plain: true}))
        res.render('VerUsuarios', { empleados: EmpleadosPlanosXD });
    }catch(error){
        res.status(500).json({error: 'No se encontraron empleados'})
    }
};

//Ver todos los roles
exports.ObtenerTodosLosUsuarios = async (req,res) => {
    try{
        const empleados = await Rol.findAll();
        const EmpleadosPlanosXD = empleados.map(users => users.get({plain: true}))
        res.render('VerUsuarios', { empleados: EmpleadosPlanosXD });
    }catch(error){
        res.status(500).json({error: 'No se encontraron empleados'})
    }
};

//Ver estado de asistencia
exports.ObtenerTodosLosUsuarios = async (req,res) => {
    try{
        const empleados = await StateAssisting.findAll();
        const EmpleadosPlanosXD = empleados.map(users => users.get({plain: true}))
        res.render('VerUsuarios', { empleados: EmpleadosPlanosXD });
    }catch(error){
        res.status(500).json({error: 'No se encontraron empleados'})
    }
};

//Ver las horas trabajadas
exports.ObtenerTodosLosUsuarios = async (req,res) => {
    try{
        const empleados = await HoursWorking.findAll();
        const EmpleadosPlanosXD = empleados.map(users => users.get({plain: true}))
        res.render('VerUsuarios', { empleados: EmpleadosPlanosXD });
    }catch(error){
        res.status(500).json({error: 'No se encontraron empleados'})
    }
};