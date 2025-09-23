// config/database.js
// Versión limpia y mínima: selecciona entre DB_LOCAL_* y DB_AZURE_* según DB_MODE
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Determina el modo: 'azure' o 'local' (por defecto 'local')
const DB_MODE = process.env.DB_MODE === 'azure' ? 'azure' : 'local';

const LOCAL = {
  name: process.env.DB_LOCAL_NAME || process.env.DB_NAME || 'asistencia',
  user: process.env.DB_LOCAL_USER || process.env.DB_USER || 'root',
  pass: process.env.DB_LOCAL_PASS || process.env.DB_PASS || '',
  host: process.env.DB_LOCAL_HOST || process.env.DB_HOST || 'localhost',
  port: process.env.DB_LOCAL_PORT ? Number(process.env.DB_LOCAL_PORT) : (process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306),
  ssl: false,
};

const AZURE = {
  name: process.env.DB_AZURE_NAME || process.env.DB_NAME || 'nombre_de_tu_base',
  user: process.env.DB_AZURE_USER || process.env.DB_USER || 'RooterCLI',
  pass: process.env.DB_AZURE_PASS || process.env.DB_PASS || 'tu-password-aqui',
  host: process.env.DB_AZURE_HOST || process.env.DB_HOST || 'dev-enterprice-cli.mysql.database.azure.com',
  port: process.env.DB_AZURE_PORT ? Number(process.env.DB_AZURE_PORT) : (process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306),
  ssl: process.env.DB_AZURE_SSL ? process.env.DB_AZURE_SSL === 'true' : true,
};

const chosen = DB_MODE === 'azure' ? AZURE : LOCAL;

const sequelize = new Sequelize(chosen.name, chosen.user, chosen.pass, {
  host: chosen.host,
  port: chosen.port,
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  logging: false,
  dialectOptions: chosen.ssl ? { ssl: { rejectUnauthorized: true } } : {},
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
});

module.exports = sequelize;