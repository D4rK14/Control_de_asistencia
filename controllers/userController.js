// Archivo: controllers/userController.js
/**
 * @file userController.js
 * @description Controlador dedicado a manejar las vistas y la lógica asociada a las operaciones del usuario,
 * como la visualización del dashboard. Interactúa con otros controladores para obtener datos necesarios.
 */

// Importación de funciones necesarias de otros controladores o módulos.
const { getMisAsistenciasByUserId } = require("../controllers/assistController"); // Función para obtener las asistencias de un usuario.
const { _fetchUsersAndRolesData } = require("../controllers/adminController"); // Importa la función interna para obtener usuarios y roles.

/**
 * @function renderHome
 * @description Renderiza la página de inicio de la aplicación.
 * Esta es típicamente la primera vista que un usuario ve al acceder a la URL raíz.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {void} Renderiza la plantilla `home.hbs`.
 */
const renderHome = (req, res) => {
  res.render("home");
};

/**
 * @function renderUserDashboard
 * @description Renderiza el dashboard principal para un usuario autenticado (no administrador).
 * Esta función está protegida por middleware JWT y carga los datos de asistencia del usuario
 * antes de mostrar la vista. Los datos del usuario (`req.user`) son provistos por el middleware de autenticación.
 * @param {Object} req - Objeto de solicitud de Express (espera `req.user` con datos del usuario).
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Renderiza la plantilla `common/dashboard_usuario.hbs` con los datos del usuario,
 * o una página de error si falla la carga de datos.
 */
const renderUserDashboard = async (req, res) => {
  // `req.user` contiene la información del usuario autenticado, gracias al middleware `authMiddleware.js`.
  try {
    // Renderiza la vista del dashboard, pasando el objeto `usuario` (con datos de `req.user`)
    res.render("common/dashboard_usuario", {
      usuario: { ...req.user, isAdmin: req.user.rol === 'Administrador' }
    });
  } catch (error) {
    // Si ocurre un error durante el renderizado,
    // se registra el error y se muestra una página de error al usuario.
    console.error("Error al renderizar el dashboard del usuario:", error);
    res.status(500).render("common/dashboard_error", { message: "Error al cargar el dashboard." });
  }
};

/**
 * @function renderAdminDashboard
 * @description Renderiza el dashboard principal para un usuario administrador.
 * Esta función está protegida por middleware JWT y de autorización de rol.
 * @param {Object} req - Objeto de solicitud de Express (espera `req.user` con datos del usuario administrador).
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Renderiza la plantilla `admin/admin.hbs` con los datos necesarios,
 * o una página de error si falla.
 */
const renderAdminDashboard = async (req, res) => {
  try {
    // Obtener usuarios y roles para la sección de gestión de usuarios en el dashboard de admin
    const { users, roles } = await _fetchUsersAndRolesData(); // Usa la función interna para obtener datos

    // Datos de ejemplo para los KPIs y reportes (estos deberían ser obtenidos de la BD en una implementación real)
    const attendancePercent = 85; // Ejemplo
    const lateCount = 10;         // Ejemplo
    const earlyLeaveCount = 5;    // Ejemplo
    const absentCount = 2;        // Ejemplo

    // Datos de reportes de ejemplo (vacío por ahora)
    const reports = []; // Aquí irían los reportes detallados de asistencia de todos los usuarios

    res.render("admin/admin", {
      user: req.user, // Información del usuario administrador logeado
      users: users,   // Lista de todos los usuarios para la tabla de gestión
      roles: roles,   // Lista de todos los roles para los filtros o selectores (si aplica)
      attendancePercent,
      lateCount,
      earlyLeaveCount,
      absentCount,
      reports: reports
    });
  } catch (error) {
    console.error("Error al renderizar el dashboard del administrador:", error);
    res.status(500).render("common/dashboard_error", { message: "Error al cargar el dashboard de administrador." });
  }
};

/**
 * @function renderUserReports
 * @description Renderiza la vista de reportes personales para un usuario autenticado.
 * Esta función está protegida por middleware JWT y carga los datos de asistencia del usuario
 * para mostrarlos en una vista dedicada.
 * @param {Object} req - Objeto de solicitud de Express (espera `req.user` con datos del usuario).
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Renderiza la plantilla `common/reportes_usuario.hbs` con los datos del usuario y sus asistencias,
 * o una página de error si falla la carga de datos.
 */
const renderUserReports = async (req, res) => {
  try {
    const id_usuario = req.user.id; // Extrae el ID del usuario del objeto `req.user`.
    // Llama a la función `getMisAsistenciasByUserId` para obtener todas las asistencias de este usuario.
    const asistencias = await getMisAsistenciasByUserId(id_usuario);

    // Renderiza la vista de reportes, pasando el objeto `usuario` y el arreglo de `asistencias`.
    res.render("common/reportes_usuario", {
      usuario: { ...req.user, isAdmin: req.user.rol === 'Administrador' },
      asistencias: asistencias
    });
  } catch (error) {
    // Si ocurre un error durante la obtención de asistencias o el renderizado,
    // se registra el error y se muestra una página de error al usuario.
    console.error("Error al renderizar los reportes del usuario:", error);
    res.status(500).render("common/dashboard_error", { message: "Error al cargar los reportes." });
  }
};

// Exporta las funciones del controlador para que puedan ser utilizadas por los routers de Express.
module.exports = {
  renderHome,
  renderUserDashboard,
  renderAdminDashboard,
  renderUserReports
};
