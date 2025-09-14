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

module.exports = verifyToken;
