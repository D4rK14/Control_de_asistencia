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

// Inicialización de la aplicación
const app = express();                                // Crea instancia de la aplicación Express
const PORT = 3000;                                    // Puerto donde se ejecutará el servidor

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

/**
 * Ruta principal "/"
 * 
 * Renderiza la vista "login.hbs"
 * 
 */
const Rutas = require('./routes/route');
app.use('/login',Rutas);

app.get('/', (req, res) => {
    res.render('home');
});

/**
 * Levantar servidor en el puerto definido
 */

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
