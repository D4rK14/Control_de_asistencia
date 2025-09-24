const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken'); // Importar jsonwebtoken
const { processAttendanceInternal } = require('../controllers/assistController');

const JWT_SECRET = process.env.JWT_QR_SECRET || 'super_secreto_para_qrs_seguros'; // Clave secreta para firmar los JWT de QR

// Este endpoint generará un código QR con un token JWT del usuario como contenido
router.get('/generate-qr/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // Crear un token JWT con el ID del usuario y una expiración corta (ej. 5 minutos)
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '5m' });
    const qrCodeDataUrl = await QRCode.toDataURL(token);
    res.json({ qrCode: qrCodeDataUrl });
  } catch (error) {
    console.error('Error generando QR:', error);
    res.status(500).json({ error: 'Error al generar el código QR' });
  }
});

// Nuevo endpoint para registrar asistencia mediante código QR
router.post('/register', async (req, res) => {
  const { qrCodeContent, tipo } = req.body; // Ahora esperamos el contenido completo del QR (el token)

  if (!qrCodeContent || !tipo) {
    return res.status(400).json({ error: 'Contenido del QR y tipo de marcaje son requeridos.' });
  }

  let userId;
  try {
    // Verificar y decodificar el token JWT
    const decoded = jwt.verify(qrCodeContent, JWT_SECRET);
    userId = decoded.userId;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Código QR expirado.' });
    }
    console.error('Error verificando token JWT del QR:', error);
    return res.status(401).json({ error: 'Código QR inválido o no autorizado.' });
  }

  const result = await processAttendanceInternal(userId, tipo);

  if (result.success) {
    return res.status(result.status).json({ message: result.message, asistencia: result.asistencia });
  } else {
    return res.status(result.status).json({ error: result.message, details: result.details });
  }
});

module.exports = router;
