const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/assistController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/asistencia', verifyToken, asistenciaController.registrarAsistencia);
router.get('/asistencia/mis-asistencias', verifyToken, asistenciaController.misAsistencias);

module.exports = router;