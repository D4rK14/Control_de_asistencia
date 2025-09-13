/**
 * Aplicación con Express y Handlebars que muestra
 * la hora actual en Chile y en formato UTC.
 * 
 * Dependencias:
 * - express: Framework web para Node.js
 * - express-handlebars: Motor de plantillas
 * - path: Manejo de rutas de archivos
 * - moment-timezone: Manejo de fechas y horas con zonas horarias
 */

// Importación de dependencias
const express = require('express');                   // Framework web
const { engine } = require('express-handlebars');     // Motor de plantillas Handlebars
const path = require('path');                         // Módulo para rutas
const moment = require('moment-timezone');            // Manejo de fechas con zonas horarias
const fs = require('fs');                             // Módulo para manejo de archivos            // Middleware para manejo de archivos subidos
const sequelize = require('./database/db');
const pdfParse = require('pdf-parse');                // Librería para extraer texto de PDFs
const { extraerDatosLicencia } = require("./pdfExtractor"); // Función personalizada para extraer datos de licencias
const multer = require("multer");                     // Middleware para manejo de archivos subidos
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Inicialización de la aplicación
const app = express();                                // Crea instancia de la aplicación Express
const PORT = 3000;

// --- Configuración de Multer para la subida de archivos ---
const upload = multer({ dest: "uploads/" });

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear el cuerpo de las peticiones
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuración de la sesión
app.use(cookieParser());
app.use(session({
    secret: 'una_clave_secreta_muy_segura', // Cambia esto por una clave segura en un entorno de producción
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Poner en true si usas HTTPS
}));

// Obtención de las fechas y horas
const ahoraChile = moment()                           // Fecha/hora actual
    .tz('America/Santiago')                           // Convertida a zona horaria de Chile
    .format('YYYY-MM-DD HH:mm:ss');                   // Formato legible (ej: 2025-08-30 00:15:30)

const ahoraUTC = moment()                             // Fecha/hora actual
    .utc()                                            // Convertida a UTC
    .format();                                        // Formato ISO estándar

/**
 * Configuración de Handlebars como motor de plantillas
 * 
 * - extname: extensión de archivos de vistas
 * - defaultLayout: layout principal
 * - layoutsDir: carpeta donde están los layouts
 * - partialsDir: carpeta con parciales reutilizables
 */
app.engine('.hbs', engine({
    extname: '.hbs',              
    defaultLayout: 'main',        
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));

// Establecer Handlebars como motor de vistas
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));      // Carpeta donde se encuentran las vistas

app.post("/upload", upload.single("pdfFile"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No se ha subido ningún archivo.");
    }
    const filePath = req.file.path;
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);

        // Usamos la función importada para procesar el texto.
        const datosExtraidos = extraerDatosLicencia(data.text);
        
        res.render("pdf/pdf-view", { datos: datosExtraidos });
    } catch (err) {
        console.error("Error al procesar PDF:", err);
        res.status(500).send("Error al procesar el PDF. Asegúrate de que es un archivo válido.");
    } finally {
        fs.unlinkSync(filePath);
    }
});

// Rutas principales
const mainRoutes = require('./routes/route');
app.use('/', mainRoutes);

/**
 * Levantar servidor en el puerto definido
 */

sequelize.sync().then(() => {
    app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
});
