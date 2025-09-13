const express = require('express');
const router = express.Router();
const control = require('../controllers/controller');

// Ruta para la página de inicio
router.get('/', (req, res) => {
    res.render('home');
});

// Rutas para el login
router.get('/login', (req,res) => {
    res.render('common/login');
});

router.post('/login', (req,res) => {
    // Aquí iría la lógica de autenticación
    res.render('common/dashboard_usuario');
});

// Ruta para subir PDF
router.get('/upload', (req, res) => {
    res.render('pdf/enviarLicencia');
});

module.exports = router;