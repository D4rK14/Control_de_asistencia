const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Página de inicio
const renderHome = (req, res) => {
  res.render("home");
};

// Página de perfil (protegida con JWT)
const renderProfile = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.redirect("/login");

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.redirect("/login");

    // Renderizamos la vista con los datos del usuario
    res.render("common/dashboard_usuario", { rut: user.rut });
  });
};

module.exports = {
  renderHome,
  renderProfile
};
