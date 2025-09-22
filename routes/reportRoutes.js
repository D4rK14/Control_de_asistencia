// routes/reportRoutes.js

const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');
const reportController = require('../controllers/reportController');

// Ruta para ver los reportes de inasistencia
router.get('/absence', verifyToken, authorizeRole(['administrador', 'RR.HH']), reportController.getAbsenceReports);

module.exports = router;
