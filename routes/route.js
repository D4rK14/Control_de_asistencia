const express = require('express');
const router = express.Router();
const control = require('../controllers/controller');

router.get('/', (req,res) => {
    res.render('usuario/login');
});

router.post('/', (req,res) => {
    res.render('usuario/dashboard_usuario');
});

module.exports = router;