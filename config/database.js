// Configuración de Sequelize para conectarse a MySQL
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Creamos la instancia de conexión
const sequelize = new Sequelize(
  process.env.DB_NAME, // Nombre de la BD
  process.env.DB_USER, // Usuario
  process.env.DB_PASS, // Contraseña
  {
    host: process.env.DB_HOST, // Host de la BD
    dialect: 'mysql',          // Motor de BD
    logging: false             // Si lo pones true, verás cada query SQL en consola
  }
);

module.exports = sequelize;
