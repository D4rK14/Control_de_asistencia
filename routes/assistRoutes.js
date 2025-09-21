// Archivo: routes/assistRoutes.js
/**
 * @file assistRoutes.js
 * @description Define las rutas de la API relacionadas con la gestión de asistencia de los usuarios.
 * Este módulo utiliza el `asistenciaController` para manejar las operaciones de registro y consulta de asistencia.
 */
const express = require('express'); // Importa el framework Express para crear y gestionar rutas.
const router = express.Router(); // Crea una nueva instancia de un router de Express.
const asistenciaController = require('../controllers/assistController'); // Importa el controlador de asistencia que contiene la lógica de negocio.

/**
 * @route POST /asistencia/:id
 * @description Ruta para registrar la entrada o salida de asistencia de un usuario.
 * Requiere el ID del usuario como un parámetro en la URL.
 * La lógica de procesamiento es manejada por `asistenciaController.registrarAsistencia`.
 */
router.post('/asistencia/:id', asistenciaController.registrarAsistencia);

/**
 * @route GET /asistencia/mis-asistencias/:id
 * @description Ruta para obtener todos los registros de asistencia de un usuario específico.
 * Requiere el ID del usuario como un parámetro en la URL.
 * La lógica para obtener y devolver las asistencias es manejada por `asistenciaController.misAsistencias`.
 */
router.get('/asistencia/mis-asistencias/:id', asistenciaController.misAsistencias);

// Exporta el router para que pueda ser utilizado por la aplicación principal (app.js).
module.exports = router;
