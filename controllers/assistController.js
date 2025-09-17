const Asistencia = require('../models/assist');
const User = require('../models/User');
const EstadoAsistencia = require('../models/StateAssist');
const CategoriaAsistencia = require('../models/assistCategory');

// Registrar entrada o salida
exports.registrarAsistencia = async (req, res) => {
  try {
    const { tipo } = req.body; // entrada o salida
    const id_usuario = req.user?.id; // suponiendo que guardaste el id del usuario en la sesión
    const hoy = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Buscar si ya existe registro de asistencia para hoy
    let asistencia = await Asistencia.findOne({
      where: { id_usuario, fecha: hoy }
    });

    if (tipo === 'entrada') {
      if (asistencia) {
        return res.status(400).json({ error: 'Ya registraste tu entrada hoy.' });
      }

      asistencia = await Asistencia.create({
        id_usuario,
        fecha: hoy,
        hora_entrada: new Date().toLocaleTimeString('es-CL', { hour12: false }),
        id_estado: 1 // ejemplo: 1 = Presente
      });

      return res.json({ message: 'Entrada registrada con éxito', asistencia });
    }

    if (tipo === 'salida') {
      if (!asistencia) {
        return res.status(400).json({ error: 'No has marcado entrada aún.' });
      }
      if (asistencia.hora_salida) {
        return res.status(400).json({ error: 'Ya registraste tu salida hoy.' });
      }

      asistencia.hora_salida = new Date().toLocaleTimeString('es-CL', { hour12: false });
      await asistencia.save();

      return res.json({ message: 'Salida registrada con éxito', asistencia });
    }

    return res.status(400).json({ error: 'Tipo inválido' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar asistencia' });
  }
};

// Obtener todas las asistencias de un usuario (para reportes personales)
exports.misAsistencias = async (req, res) => {
  try {
    const id_usuario = req.user?.id;

    const asistencias = await Asistencia.findAll({
      where: { id_usuario },
      include: [
        { model: EstadoAsistencia, as: 'estado' },
        { model: CategoriaAsistencia, as: 'categoria' }
      ],
      order: [['fecha', 'DESC']]
    });

    res.json(asistencias);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener asistencias' });
  }
};
