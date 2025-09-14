// controllers/userController.js
// Controlador para manejar vistas del usuario

// Página de inicio
const renderHome = (req, res) => {
  res.render("home");
};

// Dashboard del usuario (protegido con middleware JWT)
const renderDashboard = (req, res) => {
  // req.user viene del authMiddleware
  res.render("common/dashboard_usuario", {
    usuario: req.user,  // Puedes acceder con {{usuario.rut}}, {{usuario.nombre}} si lo incluyes en el token
    asistencias: []     // Aquí puedes traer datos desde DB si lo deseas
  });
};

module.exports = {
  renderHome,
  renderDashboard
};
