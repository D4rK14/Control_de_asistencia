// routes/userRoutes.js
const express = require("express");
const { renderHome, renderDashboard } = require("../controllers/userController.js");
const verifyToken = require("../middlewares/authMiddleware.js");

const router = express.Router();

// Página principal
router.get("/", renderHome);

// Dashboard protegido con middleware
router.get("/dashboard_usuario", verifyToken, renderDashboard);

module.exports = router;
