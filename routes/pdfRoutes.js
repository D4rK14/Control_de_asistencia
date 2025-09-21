// Archivo: routes/pdfRoutes.js
/**
 * @file pdfRoutes.js
 * @description Define las rutas de la API relacionadas con la gestión de documentos PDF,
 * incluyendo la subida y procesamiento de licencias o justificaciones.
 */
const express = require("express"); // Importa el framework Express para crear y gestionar rutas.
const multer = require("multer"); // Importa Multer, un middleware para el manejo de `multipart/form-data`, usado para la subida de archivos.
const { renderUpload, procesarPDF, renderPdfView } = require("../controllers/pdfController.js"); // Importa las funciones del controlador de PDF.

const router = express.Router(); // Crea una nueva instancia de un router de Express.
const upload = multer({ dest: "uploads/" }); // Configura Multer para guardar los archivos subidos en la carpeta "uploads/".

/**
 * @section Rutas de Justificación de Inasistencia
 */

/**
 * @route GET /inasistencia
 * @description Muestra el formulario para subir una justificación de inasistencia.
 * La vista es renderizada por `pdfController.renderUpload`.
 */
router.get("/inasistencia", renderUpload);

// Las siguientes rutas están comentadas, pero muestran cómo se procesaría la subida de un PDF para inasistencias.
// router.post("/inasistencia", upload.single("pdfFile"), procesarPDF);

/**
 * @section Rutas de Licencia Médica
 */

/**
 * @route GET /licencia_medica
 * @description Muestra el formulario para subir una licencia médica.
 * La vista es renderizada por `pdfController.renderPdfView`.
 */
router.get("/licencia_medica", renderPdfView);

// Las siguientes rutas están comentadas, pero muestran cómo se procesaría la subida de un PDF para licencias médicas.
// router.post("/licencia_medica", upload.single("pdfFile"), procesarPDF);

// Exporta el router para que pueda ser utilizado por la aplicación principal (app.js).
module.exports = router;
