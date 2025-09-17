// Importación de módulos necesarios para la autenticación
const jwt = require("jsonwebtoken");          // JSON Web Token para crear y verificar tokens
const bcrypt = require("bcryptjs");           // Para encriptar y comparar contraseñas
const User = require("../models/User");       // Modelo de usuario de la base de datos
const Rol = require("../models/Rol");         // Modelo de roles de la base de datos

// Obtención de las claves secretas para los tokens desde variables de entorno
// Estas claves deben ser seguras y mantenerse en secreto en producción
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

/**
 * Función para generar un token de acceso JWT
 * @param {Object} user - Objeto usuario con sus propiedades
 * @returns {String} Token JWT firmado con expiración de 15 minutos
 */
function generateAccessToken(user) {
  return jwt.sign(
    { 
      id: user.id,                    // ID único del usuario
      rut: user.rut,                  // RUT del usuario (identificador)
      nombre: user.nombre,            // Nombre del usuario
      rol: user.rol.nombre            // Nombre del rol del usuario
    },
    JWT_SECRET,                       // Clave secreta para firmar el token
    { expiresIn: "15m" }              // Tiempo de expiración (15 minutos)
  );
}

/**
 * Función para generar un token de refresco JWT
 * @param {Object} user - Objeto usuario con su ID
 * @returns {String} Token JWT firmado con expiración de 7 días
 */
function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id },                  // Solo incluye el ID para el refresh token
    JWT_REFRESH_SECRET,               // Clave secreta diferente para refresh tokens
    { expiresIn: "7d" }               // Tiempo de expiración más largo (7 días)
  );
}

/**
 * Controlador para renderizar la página de login
 * Verifica si el usuario ya tiene una sesión activa válida
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const renderLogin = (req, res) => {
  // Obtiene el token de acceso de las cookies
  const token = req.cookies.accessToken;

  // Si existe un token, verifica su validez
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) {
        // Token válido, redirige al dashboard (usuario ya autenticado)
        return res.redirect("/dashboard_usuario");
      }
      // Token inválido o expirado, muestra la página de login
      res.render("common/login", { error: null });
    });
  } else {
    // No hay token, muestra la página de login
    res.render("common/login", { error: null });
  }
};

/**
 * Controlador para procesar el inicio de sesión
 * @param {Object} req - Objeto de solicitud HTTP con credenciales
 * @param {Object} res - Objeto de respuesta HTTP
 */
const login = async (req, res) => {
    // Logs para debugging del proceso de login
    console.log("POST /login ejecutado", req.body);
    const { rut, password } = req.body;
    console.log("Datos recibidos:", rut, password);

    try {
        // Busca el usuario en la base de datos incluyendo su rol
        const user = await User.findOne({ 
            where: { rut }, 
            include: [{ model: Rol, as: 'rol'}] 
        });
        console.log("Usuario encontrado:", user);

        // Verifica si el usuario existe
        if (!user) {
            console.log("Error: usuario no existe");
            return res.status(401).render("common/login", { 
                error: "Usuario no registrado" 
            });
        }

        // Compara la contraseña proporcionada con la almacenada (encriptada)
        if (!bcrypt.compareSync(password, user.password)) {
            console.log("Error: contraseña incorrecta");
            return res.status(401).render("common/login", { 
                error: "Contraseña incorrecta" 
            });
        }

        // Si las credenciales son válidas, genera tokens de acceso y refresco
        console.log("Login correcto, generando tokens...");
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Establece el token de acceso como cookie HTTP-only (segura)
        res.cookie("accessToken", accessToken, {
            httpOnly: true,     // Previene acceso via JavaScript (XSS protection)
            secure: false,      // En true solo se envía sobre HTTPS (debe ser true en producción)
            sameSite: "strict", // Protección contra CSRF
            maxAge: 15 * 60 * 1000, // 15 minutos de vida
        });

        // Establece el token de refresco como cookie HTTP-only
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días de vida
        });

        // Redirige al dashboard del usuario después del login exitoso
        res.redirect("/dashboard_usuario");
    } catch (err) {
        // Manejo de errores del servidor
        res.status(500).send("Error al iniciar sesión: " + err.message);
    }
};

/**
 * Controlador para registrar un nuevo usuario
 * @param {Object} req - Objeto de solicitud HTTP con datos de registro
 * @param {Object} res - Objeto de respuesta HTTP
 */
const register = async (req, res) => {
    const { rut, password } = req.body;

    try {
        // Encripta la contraseña antes de almacenarla (10 salt rounds)
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        // Crea el nuevo usuario en la base de datos
        await User.create({ 
            rut, 
            password: hashedPassword 
        });
        
        // Redirige al login después del registro exitoso
        res.redirect("/login");
    } catch (err) {
        // Manejo de errores (usuario duplicado, etc.)
        res.status(400).send("Error al registrar usuario: " + err.message);
    }
};

/**
 * Controlador para cerrar sesión
 * Elimina las cookies de autenticación
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
const logout = (req, res) => {
    // Elimina las cookies de tokens
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    
    // Redirige a la página principal
    res.redirect("/");
};

// Exporta todas las funciones para su uso en las rutas
module.exports = {
    renderLogin,
    login,
    register,
    logout
};