const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const moment = require('moment-timezone');

const app = express();


const ahoraChile = moment().tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss');
const ahoraUTC = moment().utc().format();



console.log('Hora UTC:', ahoraUTC);
console.log('Hora en Chile;', ahoraChile);