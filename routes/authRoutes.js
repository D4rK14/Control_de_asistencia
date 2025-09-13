// routes/authRoutes.js
const express = require("express");
const { renderLogin, login, register, logout } = require("../controllers/authController.js");

const router = express.Router();

// Login
router.get("/login", renderLogin); 
router.post("/login", login);

// Registro
router.get("/register", (req, res) => res.render("common/register")); // Vista de registro
router.post("/register", register);

// Logout
router.get("/logout", logout);

module.exports = router;
