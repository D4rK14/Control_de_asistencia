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

const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const moment = require('moment-timezone');
const sequelize = require('./config/database'); // CommonJS
const multer = require('multer');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Importación de routers
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

// Inicialización de la aplicación
const app = express();
const PORT = 3000;

// --- Configuración de Multer para la subida de archivos ---
const upload = multer({ dest: "uploads/" });

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear el cuerpo de las peticiones
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de la sesión
app.use(cookieParser());
app.use(session({
    secret: 'una_clave_secreta_muy_segura',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

// Obtención de las fechas y horas
const ahoraChile = moment()
    .tz('America/Santiago')
    .format('YYYY-MM-DD HH:mm:ss');

const ahoraUTC = moment()
    .utc()
    .format();

/**
 * Configuración de Handlebars como motor de plantillas
 */
app.engine('.hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
        section: function(name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

/**
 * Rutas principales
 */
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', pdfRoutes);

/**
 * Levantar servidor en el puerto definido
 */

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
});
