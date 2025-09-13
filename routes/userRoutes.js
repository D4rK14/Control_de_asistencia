// routes/userRoutes.js
const express = require('express');
const { renderHome, renderProfile } = require('../controllers/userController.js');

const router = express.Router();

// Página principal
router.get("/", renderHome); 

// Perfil protegido
router.get("/dashboard_usuario", renderProfile); 

module.exports = router;
