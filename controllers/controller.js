const User = require('../models/User');

exports.ObtenerTodosLosUsuarios = async (req,res) => {
    try{
        const empleados = await User.findAll();
        const EmpleadosPlanosXD = empleados.map(usuarios => usuarios.get({plain: true}))
        res.render('VerUsuarios', { empleados: EmpleadosPlanosXD });
    }catch(error){
        res.status(500).json({error: 'No se encontraron empleados'})
    }
};