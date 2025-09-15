// routes/userRoutes.js
const express = require("express");
const { renderHome, renderDashboard } = require("../controllers/userController.js");
const {verifyToken, authorizeRole} = require("../middlewares/authMiddleware.js");

const router = express.Router();

// Página principal
router.get("/", renderHome);

// Dashboard protegido con middleware
router.get("/dashboard_usuario", verifyToken, authorizeRole(["Marketing", "Finanzas", "Administrador"]), renderDashboard);

module.exports = router;
