// Archivo: controllers/pdfController.js
/**
 * @file pdfController.js
 * @description Controlador encargado de la lógica para subir y procesar archivos PDF.
 * Este módulo maneja la visualización de formularios de subida y la extracción de datos de licencias médicas a partir de PDFs.
 */

const fs = require("fs"); // Módulo nativo de Node.js para interactuar con el sistema de archivos (ej: leer, eliminar archivos).
const pdfParse = require("pdf-parse"); // Librería para extraer texto de archivos PDF.
// La función extraerDatosLicencia es para el frontend y no debe ser requerida en el backend.
// const { extraerDatosLicencia } = require("../public/js/pdfExtractor"); // Importa la función personalizada para extraer datos específicos de licencias médicas.

/**
 * @function renderUpload
 * @description Renderiza la vista del formulario para justificar una inasistencia (subida de documento).
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {void} Renderiza la plantilla `justificaciones/inasistencia.hbs`.
 */
const renderUpload = (req, res) => {
  res.render("justificaciones/inasistencia");
};

/**
 * @function renderPdfView
 * @description Renderiza la vista del formulario para subir una licencia médica.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {void} Renderiza la plantilla `justificaciones/licencia_medica.hbs`.
 */
const renderPdfView = (req, res) => {
  // Pasamos `req.user` (con el middleware verifyToken) para que la vista pueda
  // incluir el ID del usuario en el input hidden (ej: {{usuario.id}}).
  res.render("justificaciones/licencia_medica", { usuario: req.user });
};

/**
 * @function procesarPDF
 * @description Procesa un archivo PDF subido, extrae su texto y luego utiliza una función personalizada
 * para obtener datos estructurados de una licencia médica. Finalmente, renderiza una vista con estos datos.
 * @param {Object} req - Objeto de solicitud de Express, se espera que `req.file` contenga la información del archivo subido por `multer`.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Renderiza una vista con los datos extraídos o envía un mensaje de error.
 */
const procesarPDF = async (req, res) => {
  // Verifica si se ha subido algún archivo. Si no, envía un error 400.
  if (!req.file) {
    return res.status(400).send("No se ha subido ningún archivo.");
  }

  const filePath = req.file.path; // Ruta temporal donde `multer` guarda el archivo subido.

  try {
    // Lee el contenido binario del archivo PDF desde la ruta temporal.
    const dataBuffer = fs.readFileSync(filePath);

    // Extrae todo el texto del PDF utilizando la librería `pdf-parse`.
    const data = await pdfParse(dataBuffer);

    // Utiliza la función personalizada `extraerDatosLicencia` para analizar el texto extraído
    // y obtener datos específicos de la licencia médica de forma estructurada.
    // const datosExtraidos = extraerDatosLicencia(data.text);

    // Renderiza una vista (ej: `pdf/pdf-view`) pasando los datos extraídos para mostrarlos al usuario.
    // res.render("pdf/pdf-view", { datos: datosExtraidos });
    res.json({ message: "PDF procesado correctamente. El texto se ha extraído.", text: data.text });
  } catch (err) {
    // Captura y registra cualquier error que ocurra durante el proceso de lectura o parseo del PDF.
    console.error("Error al procesar PDF:", err);
    // Envía una respuesta de error 500 al cliente con un mensaje descriptivo.
    res.status(500).send("Error al procesar el PDF. Asegúrate de que es un archivo válido.");
  } finally {
    // Bloque `finally` asegura que el archivo temporal se elimine siempre, incluso si ocurre un error.
    fs.unlinkSync(filePath); // Elimina el archivo PDF temporal del servidor para liberar espacio.
  }
};

// Exporta las funciones del controlador para que puedan ser utilizadas por las rutas de Express.
module.exports = {
  renderUpload,
  renderPdfView,
  procesarPDF
};
