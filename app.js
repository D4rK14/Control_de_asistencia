const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const moment = require('moment-timezone');

const app = express();

const PORT = 3000;

const ahoraChile = moment().tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss');
const ahoraUTC = moment().utc().format();


app.engine('.hbs', engine({
    extname: '.hbs',              // extensión de los archivos
    defaultLayout: 'main',        // layout principal
    layoutsDir: path.join(__dirname, 'views/layouts'), // carpeta de layouts
    partialsDir: path.join(__dirname, 'views/partials') // carpeta de parciales
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));


console.log('Hora UTC:', ahoraUTC);
console.log('Hora en Chile;', ahoraChile);


app.get('/', (req, res) => {
    res.render('home', { ahoraChile, ahoraUTC });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
