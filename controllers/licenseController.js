const LicenciaMedica = require('../models/lecense'); // Importa el modelo de LicenciaMedica
const { extraerDatosLicencia } = require('../public/js/pdfExtractor'); // Importa la función de extracción de datos del PDF
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.mjs'); // Importa pdf.js para el backend
const fs = require('fs').promises; // Para trabajar con el sistema de archivos de forma asíncrona
const multer = require('multer'); // Middleware para manejar la subida de archivos
const path = require('path'); // Para manejar rutas de archivos

// Configuración de Multer para la subida de archivos
// Se configura el almacenamiento en disco, especificando el destino y el nombre del archivo.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Guarda los archivos en la carpeta 'uploads/'
    },
    filename: (req, file, cb) => {
        // Genera un nombre de archivo único para evitar colisiones
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

const createLicense = async (req, res) => {
    try {
        // Se espera que el archivo PDF se suba con el nombre de campo 'archivoLicencia'
        // Multer añade el archivo subido a req.file
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha subido ningún archivo PDF.' });
        }

        const id_usuario = req.body.id_usuario; // Asumiendo que el id_usuario viene en el cuerpo de la petición
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);
        if (!id_usuario) {
            // Si no hay ID de usuario, eliminar el archivo subido para evitar basura
            await fs.unlink(req.file.path);
            return res.status(400).json({ error: 'ID de usuario no proporcionado.' });
        }

        const pdfPath = req.file.path; // Ruta temporal del archivo PDF subido por Multer

        // Leer el contenido del PDF
        const data = new Uint8Array(await fs.readFile(pdfPath));
        const loadingTask = pdfjsLib.getDocument({ data: data });
        const pdf = await loadingTask.promise;

        let textoCompleto = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            textoCompleto += pageText + '\n';
        }

        // Extraer datos de la licencia utilizando la función importada
        const datosExtraidos = extraerDatosLicencia(textoCompleto);
        console.log('Datos extraídos del PDF:', datosExtraidos);

        // Validar que los campos obligatorios no sean 'No encontrado'
        const camposObligatorios = [
            { nombre: 'folio', valor: datosExtraidos.folio },
            { nombre: 'fecha_emision', valor: datosExtraidos.fechaEmision },
            { nombre: 'fecha_inicio', valor: datosExtraidos.inicioReposo },
            { nombre: 'fecha_fin', valor: datosExtraidos.fechaTermino },
            { nombre: 'dias_reposo', valor: datosExtraidos.dias }
        ];

        for (const campo of camposObligatorios) {
            if (campo.valor === 'No encontrado' || !campo.valor) {
                await fs.unlink(pdfPath); // Eliminar el archivo subido
                return res.status(400).json({ error: `Falta información obligatoria: ${campo.nombre}. No se pudo extraer del PDF.` });
            }
        }

        // Mapear los datos extraídos a los campos del modelo LicenciaMedica
        const nuevaLicencia = await LicenciaMedica.create({
            id_usuario: id_usuario,
            folio: datosExtraidos.folio !== 'No encontrado' ? datosExtraidos.folio : null,
            fecha_emision: datosExtraidos.fechaEmision !== 'No encontrado' ? datosExtraidos.fechaEmision : null,
            fecha_inicio: datosExtraidos.inicioReposo !== 'No encontrado' ? datosExtraidos.inicioReposo : null,
            fecha_fin: datosExtraidos.fechaTermino !== 'No encontrado' ? datosExtraidos.fechaTermino : null,
            dias_reposo: datosExtraidos.dias !== 'No encontrado' ? parseInt(datosExtraidos.dias) : null,
            // diagnostico: datosExtraidos.diagnostico, // No se extrae directamente aún
            profesional: datosExtraidos.profesional !== 'No encontrado' ? datosExtraidos.profesional : null,
            nombre_trabajador: datosExtraidos.nombre !== 'No encontrado' ? datosExtraidos.nombre : null,
            rut_trabajador: datosExtraidos.rut !== 'No encontrado' ? datosExtraidos.rut : null,
            edad_trabajador: datosExtraidos.edad !== 'No encontrado' ? parseInt(datosExtraidos.edad) : null,
            sexo_trabajador: datosExtraidos.sexo !== 'No encontrado' ? datosExtraidos.sexo : null,
            direccion_reposo: datosExtraidos.direccion !== 'No encontrado' ? datosExtraidos.direccion : null,
            telefono_contacto: datosExtraidos.telefono !== 'No encontrado' ? datosExtraidos.telefono : null,
            archivo: req.file.filename, // Guarda el nombre del archivo subido
            tipo_licencia: datosExtraidos.tipoLicencia !== 'No encontrado' ? datosExtraidos.tipoLicencia : null,
        });

        // Eliminar el archivo temporal después de procesar
        await fs.unlink(pdfPath);

        res.status(201).json({ message: 'Licencia creada con éxito', licencia: nuevaLicencia });
    } catch (error) {
        console.error('Error al crear licencia:', error);
        // Si hubo un error y el archivo temporal existe, intentar eliminarlo
        if (req.file && req.file.path) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error al eliminar archivo temporal:', unlinkError);
            }
        }
        res.status(500).json({ error: 'Error interno del servidor al crear licencia' });
    }
};

module.exports = { createLicense, upload };
