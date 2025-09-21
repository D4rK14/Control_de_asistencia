// Archivo: controllers/assistController.js
/**
 * @file assistController.js
 * @description Controlador para manejar las operaciones relacionadas con la asistencia de los usuarios.
 * Incluye funciones para registrar la entrada/salida de asistencia, y para consultar las asistencias de un usuario.
 */

// Importación de modelos de Sequelize
const Asistencia = require('../models/assist'); // Modelo de Asistencia
const User = require('../models/User'); // Modelo de Usuario
const EstadoAsistencia = require('../models/StateAssist'); // Modelo de Estado de Asistencia
const CategoriaAsistencia = require('../models/assistCategory'); // Modelo de Categoría de Asistencia

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

    // Fecha local en YYYY-MM-DD
    const hoy = new Date();
    const fechaFormateada = hoy.getFullYear() + '-' +
                             String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
                             String(hoy.getDate()).padStart(2, '0');

    let asistencia = await Asistencia.findOne({
      where: { id_usuario, fecha: fechaFormateada }
    });

    if (tipo === 'entrada') {
      if (asistencia) return res.status(400).json({ error: 'Ya registraste tu entrada hoy.' });

      asistencia = await Asistencia.create({
        id_usuario,
        fecha: fechaFormateada,
        hora_entrada: new Date().toLocaleTimeString('es-CL', { hour12: false }),
        id_estado: 1
      });

      return res.json({ message: 'Entrada registrada con éxito', asistencia });
    }

    if (tipo === 'salida') {
      if (!asistencia) return res.status(400).json({ error: 'No has marcado entrada aún.' });
      if (asistencia.hora_salida) return res.status(400).json({ error: 'Ya registraste tu salida hoy.' });

      asistencia.hora_salida = new Date().toLocaleTimeString('es-CL', { hour12: false });
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
      raw: true // Devuelve objetos planos de JavaScript para facilitar su uso en las vistas.
    });

    console.log('Asistencias obtenidas de Sequelize:', asistencias); // Debugging

    // Mapear los resultados para ajustar el formato al esperado por el frontend
    const asistenciasFormateadas = asistencias.map(asistencia => ({
      fecha: asistencia.fecha,
      hora_entrada: asistencia.hora_entrada,
      hora_salida: asistencia.hora_salida || '-',
      tipo_asistencia: asistencia['estado.estado'] || '-', // Usar 'estado.estado' directamente de los resultados raw
      documento: asistencia.documento || '-' // Asegurarse de que el documento esté presente o sea '-' si no existe
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
      raw: true // Devuelve objetos planos de JavaScript para facilitar su uso.
    });
    return asistencias; // Devuelve el arreglo de asistencias.
  } catch (error) {
    console.error('Error al obtener asistencias por ID de usuario:', error); // Registra el error en la consola del servidor.
    throw new Error('Error al obtener asistencias'); // Lanza un nuevo error para ser manejado por el controlador que la invocó.
  }
};

// Exporta las funciones para que puedan ser utilizadas por las rutas de Express.
module.exports = { registrarAsistencia, misAsistencias, getMisAsistenciasByUserId };
