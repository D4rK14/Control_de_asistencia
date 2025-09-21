const express = require('express');
const router = express.Router();
const { createLicense } = require('../controllers/licenseController');
// Podrías necesitar middlewares de autenticación y autorización aquí
// const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

/**
 * @route POST /licenses
 * @description Ruta para subir y crear una nueva licencia médica.
 * Requiere autenticación y posiblemente autorización.
 */
router.post('/licenses', createLicense);

module.exports = router;
