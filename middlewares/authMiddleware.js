// Archivo: middlewares/authMiddleware.js
/**
 * @file authMiddleware.js
 * @description Contiene middlewares para la autenticación y autorización de usuarios mediante JWT.
 * Estos middlewares se utilizan en las rutas protegidas para asegurar que solo los usuarios autenticados
 * y con los roles adecuados puedan acceder a ciertos recursos.
 */
const jwt = require("jsonwebtoken"); // Importa la librería JSON Web Token para verificar tokens.

// Obtiene la clave secreta para la verificación de tokens JWT desde las variables de entorno.
// Es crucial que esta clave sea la misma utilizada para firmar los tokens y se mantenga segura.
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @function verifyToken
 * @description Middleware para verificar la validez de un token de acceso JWT.
 * Busca el `accessToken` en las cookies de la solicitud. Si no existe o es inválido/expirado,
 * redirige al usuario a la página de login. Si es válido, decodifica el token y adjunta
 * la información del usuario (`req.user`) a la solicitud para uso posterior en los controladores.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware en la cadena.
 * @returns {void} Redirige o pasa el control al siguiente middleware.
 */
function verifyToken(req, res, next) {
  const token = req.cookies.accessToken; // Intenta obtener el token de acceso de las cookies.

  if (!token) {
    console.log("⛔ No hay token de acceso en las cookies, redirigiendo a /login");
    return res.redirect("/login"); // Si no hay token, el usuario no está autenticado, redirige al login.
  }

  // Verifica el token utilizando la clave secreta.
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("⛔ Token de acceso inválido o expirado:", err.message);
      return res.redirect("/login"); // Si el token no es válido, redirige al login.
    }

    // Si el token es válido, adjunta la información del usuario decodificada a `req.user`.
    req.user = user; // `user` contiene el payload del JWT (ej: id, rut, nombre, rol).
    console.log("✅ Token válido, usuario:", user.rut); // Log para indicar que el token es válido y el RUT del usuario.
    next(); // Pasa el control al siguiente middleware o controlador.
  });
}

/**
 * @function authorizeRole
 * @description Middleware de autorización que restringe el acceso a la ruta basándose en los roles del usuario.
 * Esta función devuelve otro middleware que comprueba si el rol del usuario (obtenido de `req.user` por `verifyToken`)
 * está incluido en la lista de roles permitidos (`allowedRoles`).
 * @param {Array<string>|string} allowedRoles - Un arreglo de strings o un string simple que contiene los roles permitidos para acceder a la ruta.
 * @returns {Function} Un middleware de Express que realiza la verificación del rol.
 */
function authorizeRole(allowedRoles) {
  // Asegura que `allowedRoles` sea siempre un arreglo para manejar tanto strings como arreglos.
  if (typeof allowedRoles === "string") {
    allowedRoles = [allowedRoles];
  }

  // Devuelve el middleware real que Express utilizará.
  return (req, res, next) => {
    // Verifica si el usuario (`req.user.rol`) tiene alguno de los roles permitidos.
    if (!allowedRoles.includes(req.user.rol)) {
      console.log(`⛔ Acceso denegado. Rol del usuario (${req.user.rol}) no autorizado para esta ruta.`);
      // Si el rol no está permitido, redirige a una página de error o acceso denegado.
      return res.redirect("/dashboard_error");
    }
    next(); // Si el rol es permitido, pasa el control al siguiente middleware o controlador.
  };
}

// Exporta los middlewares para que puedan ser utilizados en las definiciones de rutas de Express.
module.exports = {verifyToken, authorizeRole};
