const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

function generateAccessToken(user) {
  return jwt.sign({ id: user.id, rut: user.rut, nombre: user.nombre},JWT_SECRET, { expiresIn: "15m" });
};

function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

// Renderizar login
const renderLogin = (req, res) => {
  const token = req.cookies.accessToken;

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) {
        // Token válido, redirigir al dashboard
        return res.redirect("/dashboard_usuario");
      }
      // Si hay un error (token inválido/expirado), mostrar login
      res.render("common/login", { error: null });
    });
  } else {
    // No hay token, mostrar login
    res.render("common/login", { error: null });
  }
};

// Procesar login
const login = async (req, res) => {
    console.log("POST /login ejecutado", req.body);

    const { rut, password } = req.body;
    console.log("Datos recibidos:", rut, password);

    try {
        const user = await User.findOne({ where: { rut } });
        console.log("Usuario encontrado:", user);

        if (!user) {
            console.log("Error: usuario no existe");
            return res.status(401).render("common/login", { error: "Usuario no registrado" });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            console.log("Error: contraseña incorrecta");
            return res.status(401).render("common/login", { error: "Contraseña incorrecta" });
        }

    console.log("Login correcto, generando tokens...");
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ Redirigir a la ruta protegida, no al archivo .hbs
    res.redirect("/dashboard_usuario");
  } catch (err) {
    res.status(500).send("Error al iniciar sesión: " + err.message);
  }
};

// Registrar usuario
const register = async (req, res) => {
  const { rut, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    await User.create({ rut, password: hashedPassword });
    res.redirect("/login");
  } catch (err) {
    res.status(400).send("Error al registrar usuario: " + err.message);
  }
};

// Logout
const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.redirect("/"); // vuelve al home
};

module.exports = {
  renderLogin,
  login,
  register,
  logout
};
