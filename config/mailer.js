// Archivo: config/mailer.js
// Configuración y exportación de un transporter de nodemailer usando variables de entorno.
const nodemailer = require('nodemailer');
require('dotenv').config();

// Valores por defecto (Ethereal) - puedes sobrescribir con variables de entorno en .env
const host = process.env.MAIL_HOST || 'smtp.ethereal.email';
const port = process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587;
// Credenciales de tu cuenta Ethereal (puedes cambiarlas en .env)
const user = process.env.MAIL_USER || 'jessika.morar@ethereal.email';
const pass = process.env.MAIL_PASS || 'tgE5b7kxNcrmS5Aubn';
const from = process.env.MAIL_FROM || `no-reply@ethereal.email`;

let transporter;
try {
    transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: user && pass ? { user, pass } : undefined
    });
    // Verificar configuración del transporter
    transporter.verify().then(() => {
        console.log(`Transporter de correo listo (host: ${host}, user: ${user})`);
    }).catch(err => {
        console.warn('Advertencia: no se pudo verificar transporter de correo:', err && err.message ? err.message : err);
    });
} catch (err) {
    console.error('Error creando transporter de nodemailer:', err);
}

module.exports = {
    transporter,
    from
};
