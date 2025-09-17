const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/assistController');

// Registrar entrada o salida
router.post('/asistencia', asistenciaController.registrarAsistencia);

// Ver mis asistencias
router.get('/asistencia/mis-asistencias', asistenciaController.misAsistencias);

module.exports = router;
