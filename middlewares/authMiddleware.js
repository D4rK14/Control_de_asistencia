// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) {
    console.log("⛔ No hay token, redirigiendo a /login");
    return res.redirect("/login");
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("⛔ Token inválido:", err.message);
      return res.redirect("/login");
    }

    // Guardamos los datos del usuario en la request
    req.user = user;
    console.log("✅ Token válido, usuario:", user.rut);
    next();
  });
}

//Autorizar usuario por rol
function authorizeRole(allowedRoles) {
  // Si pasan un string, lo convertimos a array
  if (typeof allowedRoles === "string") {
    allowedRoles = [allowedRoles];
  }

  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.rol)) {
      return res.redirect("/dashboard_error");
    }
    next();
  };
}

module.exports = {verifyToken, authorizeRole};
