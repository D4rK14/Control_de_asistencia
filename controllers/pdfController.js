// controllers/pdfController.js

const fs = require("fs");
const pdfParse = require("pdf-parse");
const { extraerDatosLicencia } = require("../pdfExtractor"); // tu función personalizada

/**
 * Renderiza la vista para subir PDF
 */
const renderUpload = (req, res) => {
  res.render("pdf/enviarLicencia");
};

/**
 * Procesa el PDF subido y extrae los datos
 */
const procesarPDF = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No se ha subido ningún archivo.");
  }

  const filePath = req.file.path;

  try {
    // Leer el archivo PDF
    const dataBuffer = fs.readFileSync(filePath);

    // Extraer texto del PDF
    const data = await pdfParse(dataBuffer);

    // Usar tu función para obtener los datos específicos de la licencia
    const datosExtraidos = extraerDatosLicencia(data.text);

    // Renderizar la vista con los datos extraídos
    res.render("pdf/pdf-view", { datos: datosExtraidos });
  } catch (err) {
    console.error("Error al procesar PDF:", err);
    res.status(500).send("Error al procesar el PDF. Asegúrate de que es un archivo válido.");
  } finally {
    // Eliminar el archivo temporal
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  renderUpload,
  procesarPDF
};
