// Archivo: controllers/assistController.js
/**
 * @file assistController.js
 * @description Controlador para manejar las operaciones relacionadas con la asistencia de los usuarios.
 * Incluye funciones para registrar la entrada/salida de asistencia, y para consultar las asistencias de un usuario.
 */

// Importación de modelos de Sequelize
const Asistencia = require('../models/assist'); // Modelo de Asistencia
const User = require('../models/User'); // Importar el modelo User
const EstadoAsistencia = require('../models/StateAssist'); // Modelo de Estado de Asistencia
const CategoriaAsistencia = require('../models/assistCategory'); // Modelo de Categoría de Asistencia
const moment = require('moment-timezone'); // Asegurarse de que moment esté importado si no lo está
const { isHoliday } = require('../helpers/holidayUtils'); // Importar la función isHoliday

/**
 * @function determinarCategoriaAsistencia
 * @description Determina la categoría de asistencia basada en el tipo de marcaje y el horario.
 * Horario laboral: 09:30:00 - 17:30:00
 * @param {string} tipo - Tipo de marcaje ('entrada' o 'salida')
 * @param {string} horaActual - Hora actual en formato HH:MM:SS
 * @returns {number} ID de la categoría de asistencia
 */
const determinarCategoriaAsistencia = (tipo, horaActual) => {
  const horaMarcaje = new Date(`2000-01-01T${horaActual}`);
  const horaEntradaNormal = new Date('2000-01-01T09:30:00');
  const horaSalidaNormal = new Date('2000-01-01T17:30:00');

  if (tipo === 'entrada') {
    // Si llega antes o a las 09:30, es entrada normal
    // Si llega después de las 09:30, es atraso
    return horaMarcaje <= horaEntradaNormal ? 1 : 4; // 1: Entrada Normal, 4: Atraso
  } else if (tipo === 'salida') {
    // Si sale a las 17:30 o después, es salida normal
    // Si sale antes de las 17:30, es salida anticipada
    return horaMarcaje >= horaSalidaNormal ? 2 : 3; // 2: Salida Normal, 3: Salida Anticipada
  }

  return 1; // Default: Entrada Normal
};

/**
 * @function registrarAsistencia
 * @description Registra la entrada o salida de asistencia de un usuario.
 * Esta función es accesible a través de una ruta POST y requiere el ID del usuario como parámetro en la URL
 * y el tipo de registro (entrada/salida) en el cuerpo de la petición.
 * @param {Object} req - Objeto de solicitud de Express (contiene parámetros, cuerpo, etc.)
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Envía una respuesta JSON indicando el éxito o el fracaso del registro.
 */
const registrarAsistencia = async (req, res) => {
  try {
    const { tipo } = req.body;
    const id_usuario = req.params.id;

    const hoy = new Date();
    const fechaFormateada = moment(hoy).format('YYYY-MM-DD'); // Usar moment para formatear la fecha

    // === Nueva lógica: Verificar si es día feriado ===
    const esFeriado = await isHoliday(fechaFormateada);
    if (esFeriado) {
        return res.status(400).json({ error: 'No se puede registrar asistencia en un día feriado.' });
    }
    // =================================================

    let asistencia = await Asistencia.findOne({
      where: { id_usuario, fecha: fechaFormateada }
    });

    if (tipo === 'entrada') {
      if (asistencia) return res.status(400).json({ error: 'Ya registraste tu entrada hoy.' });

      const horaActual = moment().tz('America/Santiago').format('HH:mm:ss'); // Usar moment para hora
      const idCategoria = determinarCategoriaAsistencia('entrada', horaActual);

      asistencia = await Asistencia.create({
        id_usuario,
        fecha: fechaFormateada,
        hora_entrada: horaActual,
        id_estado: 1,
        id_categoria: idCategoria
      });

      return res.json({ message: 'Entrada registrada con éxito', asistencia });
    }

    if (tipo === 'salida') {
      if (!asistencia) return res.status(400).json({ error: 'No has marcado entrada aún.' });
      if (asistencia.hora_salida) return res.status(400).json({ error: 'Ya registraste tu salida hoy.' });

      const horaActual = moment().tz('America/Santiago').format('HH:mm:ss'); // Usar moment para hora
      const idCategoria = determinarCategoriaAsistencia('salida', horaActual);

      asistencia.hora_salida = horaActual;
      asistencia.id_categoria = idCategoria;
      await asistencia.save();

      return res.json({ message: 'Salida registrada con éxito', asistencia });
    }

    return res.status(400).json({ error: 'Tipo inválido' });

  } catch (error) {
    console.error('Error al registrar asistencia:', error);
    res.status(500).json({ error: 'Error al registrar asistencia' });
  }
};

/**
 * @function misAsistencias
 * @description Obtiene y devuelve todas las asistencias de un usuario específico.
 * Esta función es accesible a través de una ruta GET y requiere el ID del usuario como parámetro en la URL.
 * Incluye relaciones con el estado y la categoría de asistencia para mostrar información más completa.
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Envía una respuesta JSON con el listado de asistencias o un mensaje de error.
 */
const misAsistencias = async (req, res) => {
  try {
    const id_usuario = req.params.id; // Obtiene el ID del usuario de los parámetros de la URL.

    // Busca todas las asistencias del usuario, incluyendo información del estado y categoría de asistencia.
    const asistencias = await Asistencia.findAll({
      where: { id_usuario }, // Filtra por el ID del usuario
      include: [
        { model: EstadoAsistencia, as: 'estado' }, // Incluye la información del modelo EstadoAsistencia
        { model: CategoriaAsistencia, as: 'categoria' } // Incluye la información del modelo CategoriaAsistencia
      ],
      order: [['fecha', 'DESC']], // Ordena las asistencias por fecha de forma descendente
      raw: false // Cambiar a false para mantener la estructura de objetos anidados
    });

    console.log('Asistencias obtenidas de Sequelize:', asistencias); // Debugging

    // Mapear los resultados para ajustar el formato al esperado por el frontend
    const asistenciasFormateadas = asistencias.map(asistencia => ({
      fecha: asistencia.fecha,
      hora_entrada: asistencia.hora_entrada,
      hora_salida: asistencia.hora_salida || '-',
      tipo_asistencia: asistencia.categoria ? asistencia.categoria.nombre : 'Sin categoría',
      documento: asistencia.documento || '-',
      categoria: asistencia.categoria ? {
        id: asistencia.categoria.id,
        nombre: asistencia.categoria.nombre,
        descripcion: asistencia.categoria.descripcion
      } : null
    }));

    res.json(asistenciasFormateadas); // Envía las asistencias encontradas como respuesta JSON.

  } catch (error) {
    console.error('Error al obtener asistencias:', error); // Registra el error en la consola del servidor.
    res.status(500).json({ error: 'Error al obtener asistencias' }); // Envía una respuesta de error al cliente.
  }
};

/**
 * @function getMisAsistenciasByUserId
 * @description Función auxiliar para obtener las asistencias de un usuario por su ID.
 * Es similar a `misAsistencias` pero diseñada para ser llamada internamente por otros controladores,
 * devolviendo los datos directamente en lugar de enviar una respuesta HTTP.
 * @param {number} id_usuario - El ID del usuario cuyas asistencias se desean obtener.
 * @returns {Promise<Array<Object>>} Un arreglo de objetos planos con las asistencias del usuario.
 * @throws {Error} Si ocurre un error al intentar obtener las asistencias.
 */
const getMisAsistenciasByUserId = async (id_usuario) => {
  try {
    // Busca todas las asistencias del usuario, incluyendo información del estado y categoría de asistencia.
    const asistencias = await Asistencia.findAll({
      where: { id_usuario }, // Filtra por el ID del usuario
      include: [
        { model: EstadoAsistencia, as: 'estado' }, // Incluye la información del modelo EstadoAsistencia
        { model: CategoriaAsistencia, as: 'categoria' } // Incluye la información del modelo CategoriaAsistencia
      ],
      order: [['fecha', 'DESC']], // Ordena las asistencias por fecha de forma descendente
      raw: false // Cambiar a false para mantener la estructura de objetos anidados
    });

    // Formatear los resultados para incluir la información de categoría
    const asistenciasFormateadas = asistencias.map(asistencia => ({
      fecha: asistencia.fecha,
      hora_entrada: asistencia.hora_entrada,
      hora_salida: asistencia.hora_salida || null,
      tipo_asistencia: asistencia.categoria ? asistencia.categoria.nombre : 'Sin categoría',
      documento: asistencia.documento || null,
      categoria: asistencia.categoria ? {
        id: asistencia.categoria.id,
        nombre: asistencia.categoria.nombre,
        descripcion: asistencia.categoria.descripcion
      } : null
    }));

    return asistenciasFormateadas; // Devuelve el arreglo de asistencias formateadas.
  } catch (error) {
    console.error('Error al obtener asistencias por ID de usuario:', error); // Registra el error en la consola del servidor.
    throw new Error('Error al obtener asistencias'); // Lanza un nuevo error para ser manejado por el controlador que la invocó.
  }
};

// Función para el marcado automático de asistencia en días feriados
const autoMarkHolidayAttendance = async () => {
    try {
        const hoy = moment().tz('America/Santiago').format('YYYY-MM-DD');

        const esFeriado = await isHoliday(hoy);

        if (esFeriado) {
            console.log(`✅ ${hoy} es feriado. Marcando asistencia como 'Presente' para todos los trabajadores.`);

            // Obtener todos los usuarios del sistema
            const users = await User.findAll({ attributes: ['id'] });

            const idEstadoPresente = 1; // Asumiendo que ID 1 es 'Presente' en EstadoAsistencia
            const idCategoriaEntradaNormal = 1; // Asumiendo que ID 1 es 'Entrada Normal' en CategoriaAsistencia

            for (const user of users) {
                // Verificar si el usuario ya tiene una asistencia para hoy
                let asistenciaExistente = await Asistencia.findOne({
                    where: {
                        id_usuario: user.id,
                        fecha: hoy
                    }
                });

                if (!asistenciaExistente) {
                    // Si no hay asistencia, crear una como 'Presente'
                    await Asistencia.create({
                        id_usuario: user.id,
                        fecha: hoy,
                        hora_entrada: '00:00:00', // Hora simbólica para feriado, o se puede dejar null
                        hora_salida: '00:00:00', // Hora simbólica para feriado, o se puede dejar null
                        id_estado: idEstadoPresente,
                        id_categoria: idCategoriaEntradaNormal
                    });
                    console.log(`- Asistencia marcada para el usuario ${user.id} como Presente (Feriado).`);
                } else {
                    console.log(`- El usuario ${user.id} ya tiene asistencia registrada para hoy.`);
                }
            }
            console.log('Proceso de marcado automático de feriados finalizado.');
            return { success: true, message: 'Asistencia marcada automáticamente para feriado.' };
        } else {
            console.log(`❌ ${hoy} no es feriado. No se requiere marcado automático.`);
            return { success: false, message: 'Hoy no es feriado, no se requiere marcado automático.' };
        }
    } catch (error) {
        console.error('Error en el marcado automático de asistencia en feriados:', error);
        return { success: false, message: 'Error en el marcado automático de asistencia.', error: error.message };
    }
};


// Exporta las funciones para que puedan ser utilizadas por las rutas de Express.
module.exports = { registrarAsistencia, misAsistencias, getMisAsistenciasByUserId, autoMarkHolidayAttendance };
